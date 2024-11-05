package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/plutov/paypal/v4"
)

// implement bussiness logic
type PaymentService struct {
	CageRoomRepositoryIn repository.CageRoomRepositoryIn
	Validate             *validator.Validate
}

func NewPaymentService(
	validate *validator.Validate,
) *PaymentService {
	return &PaymentService{
		Validate: validate,
	}
}

// request paypal to transfer money from client account to web app account
func (s *PaymentService) RequestPayment() error {
	clientID := os.Getenv("CLIENT_ID")
	secretID := os.Getenv("SECRET_ID")

	c, err := paypal.NewClient(clientID, secretID, paypal.APIBaseSandBox)
	if err != nil {
		return err
	}

	access_token, err := c.GetAccessToken(context.Background())
	if err != nil {
		return err
	}

	units := []paypal.PurchaseUnitRequest{
		{
			Amount: &paypal.PurchaseUnitAmount{
				Currency: "THB",
				Value:    "",
			},
		},
	}

	source := types.PaymentSource{
		Card: types.CardPayload{
			Name:         "",
			Number:       "",
			Expiry:       "",
			SecurityCode: "",
		},
	}

	appCtx := paypal.ApplicationContext{
		BrandName: "hotel1",
		PaymentMethod: paypal.PaymentMethod{
			PayeePreferred: paypal.PayeePreferredImmediatePaymentRequired,
		},
	}

	payload := map[string]interface{}{
		"intent":              "CAPTURE",
		"purchase_units":      units,
		"payment_source":      source,
		"application_context": appCtx,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	request_id := uuid.New().String()

	url := paypal.APIBaseSandBox + "/v2/checkout/orders"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("PayPal-Request-Id", request_id)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", access_token.Token))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return err
	}

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return err
	}

	return nil
}

// from web application paypal's account to profile account ( hotel , so on )
func (s *PaymentService) CreatePayout() error {
	return nil
}
