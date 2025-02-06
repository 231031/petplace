package api

import (
	"net/http"
	"petplace/internal/service"
	"petplace/internal/types"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type PaymentHandler struct {
	paymentService service.PaymentService
}

func NewPaymentHandler(paymentService service.PaymentService) *PaymentHandler {
	return &PaymentHandler{paymentService: paymentService}
}

func (h *PaymentHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/pay", h.handlePayment)
	g.POST("/payout", h.handlePayout)
}

func (h *PaymentHandler) handlePayment(c echo.Context) error {
	payload := types.BookingPayload{}
	bookDel := types.BookingDetail{}

	_, err := h.paymentService.RequestPayment(payload, bookDel)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Payment Failed", err)
	}
	return c.JSON(http.StatusOK, "Payment Success")
}

func (h *PaymentHandler) handlePayout(c echo.Context) error {
	_, err := h.paymentService.CreatePayout(5.0, "")
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Payout Failed", err)
	}

	return c.JSON(http.StatusOK, "Payout Success")
}
