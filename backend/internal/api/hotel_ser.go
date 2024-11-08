package api

import (
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/types"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type HotelHandler struct {
	bookingServiceIn service.BookingServiceIn
}

func NewHotelHandler(bookingServiceIn service.BookingServiceIn) *HotelHandler {
	return &HotelHandler{bookingServiceIn: bookingServiceIn}
}

func (h *HotelHandler) RegisterRoutes(g *echo.Group) {
	// hotel
	g.GET("/:id/:status", h.handleGetAllHotelServiceByHotel)
	g.GET("/:id", h.handleGetHotelService)

	// client
	g.POST("/client/booking", h.handleBookHotelService)
	g.GET("/client/:id/:status", h.handleGetAllHotelServiceByUser)

	// both
	g.PUT("/:id", h.handleUpdateHotelSerivice)
}

// @Summary		Book Hotel Service
// @Description	book hotel service
// @Accept application/json
// @Produce application/json
// @tags HotelServices
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/hotel/client/booking [post]
// @Security BearerAuth
func (h *HotelHandler) handleBookHotelService(c echo.Context) error {
	s := types.BookingPayload{}
	err := c.Bind(&s)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}

	status, err_str, err := h.bookingServiceIn.BookHotelService(s)
	if err != nil {
		return utils.HandleError(c, status, err_str.Error(), err)
	}

	return c.JSON(http.StatusOK, "Booking success")
}

// @Summary		Get Hotel Service Hotel
// @Description	get hotel service hotel
// @Produce application/json
// @tags HotelServices
// @Param id path string true "ID"
// @Param status path string true "Status"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/hotel/{id}/{status} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetAllHotelServiceByHotel(c echo.Context) error {
	id := c.Param("id")
	profile_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}
	status := c.Param("status")

	ser_info, err := h.bookingServiceIn.GetAllBookingHotelByHotel(profile_id, status)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Booking not available", err)
	}

	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Get Hotel Service User
// @Description	get hotel service user
// @Produce application/json
// @tags HotelServices
// @Param id path string true "ID"
// @Param status path string true "Status"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/hotel/client/{id}/{status} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetAllHotelServiceByUser(c echo.Context) error {
	id := c.Param("id")
	user_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	status := c.Param("status")

	ser_info, err := h.bookingServiceIn.GetAllBookingHotelByUser(user_id, status)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Get Hotel Service
// @Description	get hotel service
// @Produce application/json
// @tags HotelServices
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/hotel/{id} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetHotelService(c echo.Context) error {
	str := c.Param("id")
	id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	ser_info, err := h.bookingServiceIn.GetBookingHotel(id)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Update Hotel Service
// @Description	update hotel service
// @Produce application/json
// @tags HotelServices
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/hotel/{id} [put]
// @Security BearerAuth
func (h *HotelHandler) handleUpdateHotelSerivice(c echo.Context) error {
	str := c.Param("id")
	id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	ser := model.HotelService{}
	err = c.Bind(&ser)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}

	err = h.bookingServiceIn.UpdateHotelService(id, ser)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Update booking detail not successful", err)
	}

	return c.JSON(http.StatusOK, "Update booking detail successful")
}
