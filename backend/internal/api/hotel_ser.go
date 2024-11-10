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
	bookingServiceIn service.BookingServiceIn
}

func NewHotelHandler(bookingServiceIn service.BookingServiceIn) *HotelHandler {
	return &HotelHandler{bookingServiceIn: bookingServiceIn}
}

func (h *HotelHandler) RegisterRoutes(g *echo.Group) {
	// hotel
	g.GET("/:id/:status", h.handleGetAllHotelServiceByHotel)
	g.GET("/:id", h.handleGetHotelService)
	g.PUT("/:id", h.handleAcceptRejectBookHotel)

	// client
	g.POST("/client/booking", h.handleBookHotelService)
	g.GET("/client/:id/:status", h.handleGetAllHotelServiceByUser)
	g.PUT("/client/:id", h.handleManageRefundBookHotel)

	// both
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

	return c.JSON(http.StatusCreated, "Booking success")
}

// @Summary		Get Hotel Service Hotel
// @Description	get hotel service hotel
// @Produce application/json
// @tags HotelServices
// @Param id path string true "Profile ID"
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
// @Param id path string true "User ID"
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
// @Param id path string true "Hotel Service ID"
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

// @Summary		Accept or Reject a booking request
// @Description	Accept or Reject a booking request
// @Produce application/json
// @tags HotelServices
// @Param id path string true "Hotel Service ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/hotel/{id} [put]
// @Security BearerAuth
func (h *HotelHandler) handleAcceptRejectBookHotel(c echo.Context) error {
	sel := types.SelectStatusPayload{}
	err := c.Bind(&sel)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "this detail is not correct", err)
	}

	err = h.bookingServiceIn.AcceptRejectBookHotel(sel)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "falied to update status of this booking", err)
	}

	return c.JSON(http.StatusOK, "update successfully")
}

// @Summary		Cancel or Refund Reservation
// @Description	cancel or refund reservation
// @Produce application/json
// @tags HotelServices
// @Param id path string true "Hotel Service ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/hotel/cleint/{id} [put]
// @Security BearerAuth
func (h *HotelHandler) handleManageRefundBookHotel(c echo.Context) error {
	payload := types.RefundPayload{}
	err := c.Bind(&payload)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "this detail is not correct", err)
	}

	err = h.bookingServiceIn.ManageRefundBookHotel(payload)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "failed to refuded", err)
	}

	return c.JSON(http.StatusOK, "process successfully")
}
