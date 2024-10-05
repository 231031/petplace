package api

import (
	"petplace/internal/service"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type HotelHandler struct {
	BookingService service.BookingServiceIn
}

func NewHotelHandler(bookingServiceIn service.BookingServiceIn) *HotelHandler {
	return &HotelHandler{BookingService: bookingServiceIn}
}

func (h *HotelHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/", h.test)
}

func (h *HotelHandler) test(c echo.Context) error {
	return nil
}