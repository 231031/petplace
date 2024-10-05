package api

import (
	"net/http"
	"petplace/internal/service"
	"petplace/internal/types"

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
	g.POST("/booking", h.bookHotelService)
}

func (h *HotelHandler) bookHotelService(c echo.Context) error {
	s := &types.BookingHotelPayload{}
	err := c.Bind(s)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	err = h.BookingService.BookHotelService(*s)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	
	return nil
}