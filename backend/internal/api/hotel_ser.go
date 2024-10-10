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
	// hotel
	g.GET("/:id/:status", h.getAllHotelServiceByHotel)
	g.GET("/:id", h.getHotelService)

	// client
	g.POST("/client/booking", h.bookHotelService)
	g.GET("/client/:id/:status", h.getAllHotelServiceByUser)
}

func (h *HotelHandler) bookHotelService(c echo.Context) error {
	s := &types.BookingHotelPayload{}
	err := c.Bind(s)
	if err != nil {
		utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}

	err = h.BookingService.BookHotelService(*s)
	if err != nil {
		utils.HandleError(c, http.StatusInternalServerError, "Booking not success", err)
	}
	
	return c.JSON(http.StatusOK, "Booking success")
}

func (h *HotelHandler) getAllHotelServiceByHotel(c echo.Context) error {
	id := c.Param("id")
	profile_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}
	status := c.Param("status")

	ser_info, err := h.BookingService.GetAllBookingHotelByHotel(*profile_id, status)
	if err != nil {
		utils.HandleError(c, http.StatusInternalServerError, "Booking not available", err)
	}
	
	return c.JSON(http.StatusOK, ser_info)
}

func (h *HotelHandler) getAllHotelServiceByUser(c echo.Context) error {
	id := c.Param("id")
	user_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	status := c.Param("status")

	ser_info, err := h.BookingService.GetAllBookingHotelByUser(*user_id, status)
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