package api

import (
	"net/http"
	"petplace/internal/service"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type PaymentHandler struct {
	paymentServiceIn service.PaymentServiceIn
}

func NewPaymentHandler(paymentServiceIn service.PaymentServiceIn) *PaymentHandler {
	return &PaymentHandler{paymentServiceIn: paymentServiceIn}
}

func (h *PaymentHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/pay", h.handlePayment)
}

func (h *PaymentHandler) handlePayment(c echo.Context) error {
	err := h.paymentServiceIn.RequestPayment()
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Payment Failed", err)
	}
	return c.JSON(http.StatusOK, "Payment Success")
}
