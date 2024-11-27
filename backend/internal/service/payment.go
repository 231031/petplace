package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"petplace/internal/types"
	"time"

	"github.com/coocood/freecache"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/plutov/paypal/v4"
	exchangerates "github.com/yusufthedragon/exchange-rates-go"
)

// implement bussiness logic
type PaymentService struct {
	Validate *validator.Validate
	Cache    *freecache.Cache
}

func NewPaymentService(
	validate *validator.Validate,
) *PaymentService {
	return &PaymentService{
		Validate: validate,
		Cache:    freecache.NewCache(1800 * 1024 * 1024),
	}
}

// do cache to reduce response time
func (s *PaymentService) getAccessToken() (*paypal.TokenResponse, error) {
	cacheKey := []byte("access_token")
	cachedTokenData, err := s.Cache.Get(cacheKey)
	if err != nil {
		fmt.Println("error getting token", err.Error())
	} else if cachedTokenData != nil {
		var cachedToken *paypal.TokenResponse
		err = json.Unmarshal(cachedTokenData, &cachedToken)
		if err != nil {
			fmt.Println("error unmarshalling", err.Error())
		} else {
			fmt.Println("used cached token")
			return cachedToken, nil
		}
	}

	clientID := os.Getenv("CLIENT_ID")
	secretID := os.Getenv("SECRET_ID")

	c, err := paypal.NewClient(clientID, secretID, paypal.APIBaseSandBox)
	if err != nil {
		return nil, err
	}

	// token expired
	tokenRes, err := c.GetAccessToken(context.Background())
	if err != nil {
		return nil, err
	}

	tokenData, err := json.Marshal(tokenRes)
	if err != nil {
		fmt.Println("error marshalling token")
	}

	expToken := int(time.Duration(tokenRes.ExpiresIn) * time.Second)
	err = s.Cache.Set(cacheKey, []byte(tokenData), expToken)
	if err != nil {
		fmt.Println("error setting token", err.Error())
	}

	return tokenRes, nil
}

// request paypal to transfer money from client account to web app account
func (s *PaymentService) RequestPayment(payload types.BookingPayload, bookDel types.BookingDetail) (string, error) {

	access_token, err := s.getAccessToken()
	if err != nil {
		return "", err
	}

	units := []paypal.PurchaseUnitRequest{
		{
			Amount: &paypal.PurchaseUnitAmount{
				Currency: "THB",
				Value:    bookDel.TotalPrice,
			},
			// Items: []paypal.Item{
			// 	{
			// 		Name: payload.ClientName,
			// 		UnitAmount: &paypal.Money{
			// 			Currency: "THB",
			// 			Value:    bookDel.TotalPrice,
			// 		},
			// 		Description: payload.Detail,
			// 		Quantity:    bookDel.Day,
			// 		Category:    bookDel.Category,
			// 	},
			// },
		},
	}

	source := types.PaymentSource{
		Card: types.CardPayload{
			Name:         payload.CardDetail.Name,
			Number:       payload.CardDetail.Number,
			Expiry:       payload.CardDetail.Expiry,
			SecurityCode: payload.CardDetail.SecurityCode,
		},
	}

	appCtx := paypal.ApplicationContext{
		BrandName: payload.ProfileName,
		PaymentMethod: paypal.PaymentMethod{
			PayeePreferred: paypal.PayeePreferredImmediatePaymentRequired,
		},
	}

	paymentInfo := map[string]interface{}{
		"intent":              "CAPTURE",
		"purchase_units":      units,
		"payment_source":      source,
		"application_context": appCtx,
	}

	fmt.Println(paymentInfo)
	paymentInfoBytes, err := json.Marshal(paymentInfo)
	if err != nil {
		return "", err
	}

	request_id := uuid.New().String()

	url := paypal.APIBaseSandBox + "/v2/checkout/orders"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(paymentInfoBytes))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("PayPal-Request-Id", request_id)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", access_token.Token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		fmt.Println(resp)
		return "", fmt.Errorf("payment failed")
	}

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return "", err
	}

	return request_id, nil
}

// from web application paypal's account to profile account ( hotel , so on )
func (s *PaymentService) CreatePayout(cost float32, paypalEmail string) (string, error) {
	access_token, err := s.getAccessToken()
	if err != nil {
		return "", err
	}

	costUsd, err := exchangerates.ConvertCurrency(
		&exchangerates.RequestParameter{
			Date:  time.Now(),
			From:  "THB",
			To:    "USD",
			Value: float64(cost),
		},
	)
	// fmt.Println(cost, costUsd)

	if err != nil {
		return "", err
	}

	request_id := uuid.New().String()
	sender_id := uuid.New().String()
	payout := paypal.Payout{
		SenderBatchHeader: &paypal.SenderBatchHeader{
			EmailSubject:  "Payout reservation by petplace",
			SenderBatchID: sender_id,
		},
		Items: []paypal.PayoutItem{
			{
				RecipientType: "EMAIL",
				Receiver:      paypalEmail,
				Amount: &paypal.AmountPayout{
					Value:    fmt.Sprintf("%.2f", costUsd),
					Currency: "USD",
				},
			},
		},
	}

	payoutBytes, err := json.Marshal(payout)
	if err != nil {
		return "", err
	}

	url := paypal.APIBaseSandBox + "/v1/payments/payouts"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payoutBytes))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("PayPal-Request-Id", request_id)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", access_token.Token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("payout failed")
	}

	return sender_id, nil
}
