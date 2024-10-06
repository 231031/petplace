package api

import (
	"net/http"
	"petplace/internal/service"
	"petplace/internal/types"
	"petplace/internal/utils"

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
	g.GET("/:id/:status", h.getAllHotelService)
	g.GET("/:id", h.getHotelService)
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

func (h *HotelHandler) getAllHotelService(c echo.Context) error {
	id := c.Param("id")
	profile_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	status := c.Param("status")

	ser_info, err := h.BookingService.GetAllBookingHotel(*profile_id, status)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	
	return c.JSON(http.StatusOK, ser_info)
}

func (h *HotelHandler) getHotelService(c echo.Context) error {
	str := c.Param("id")
	id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	ser_info, err := h.BookingService.GetBookingHotel(*id)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	
	return c.JSON(http.StatusOK, ser_info)
}