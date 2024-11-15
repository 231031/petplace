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
	g.GET("/review/:profile_id", h.handleGetReviewByHotel)
	g.PUT("/:id", h.handleAcceptRejectBookHotel)

	// client
	g.POST("/client/booking", h.handleBookHotelService)
	g.PUT("/client/:id", h.handleManageRefundBookHotel)
	g.PUT("/client/review/:id", h.handleReviewHotelService)
	g.GET("/client/:id/:status", h.handleGetAllHotelServiceByUser)

	// both
}

// @Summary		Book Hotel Service
// @Description	book hotel service
// @Accept application/json
// @Produce application/json
// @tags HotelServices
// @Param   BookingPayload body types.BookingPayload true "Booking payload"
// @Success 201
// @Failure 400
// @Failure 500
// @Router /hotel/client/booking [post]
// @Security BearerAuth
func (h *HotelHandler) handleBookHotelService(c echo.Context) error {
	s := types.BookingPayload{}
	err := c.Bind(&s)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "booking detail not correct", err)
	}

	status, err_str, err := h.bookingServiceIn.BookHotelService(s)
	if err != nil {
		return utils.HandleError(c, status, err_str.Error(), err)
	}

	return c.JSON(http.StatusCreated, "booking success")
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
// @Router /hotel/{id}/{status} [get]
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
// @Router /hotel/client/{id}/{status} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetAllHotelServiceByUser(c echo.Context) error {
	id := c.Param("id")
	user_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}
	status := c.Param("status")

	ser_info, err := h.bookingServiceIn.GetAllBookingHotelByUser(user_id, status)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "falied to get reservation history", err)
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
// @Router /hotel/{id} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetHotelService(c echo.Context) error {
	str := c.Param("id")
	id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "hotel information is not correct", err)
	}

	ser_info, err := h.bookingServiceIn.GetBookingHotel(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "falied to get reservation history", err)
	}

	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Get Review Hotel Service by Hotel
// @Description	get review hotel service by hotel
// @Produce application/json
// @tags HotelServices
// @Param profile_id path string true "Profile ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /hotel/review/{profile_id} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetReviewByHotel(c echo.Context) error {
	str := c.Param("profile_id")
	id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "hotel information is not correct", err)
	}

	reviews, err := h.bookingServiceIn.GetReviewByHotel(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "reviews is not available", err)
	}

	return c.JSON(http.StatusOK, reviews)
}

// @Summary		Accept or Reject a booking request
// @Description	Accept or Reject a booking request
// @Produce application/json
// @tags HotelServices
// @Param id path string true "Hotel Service ID"
// @Param   SelectStatusPayload body types.SelectStatusPayload true "SelectStatus payload"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /hotel/{id} [put]
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
// @Param   RefundPayload body types.RefundPayload true "Refund payload"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /hotel/cleint/{id} [put]
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

// @Summary		review Reservation
// @Description	review reservation
// @Produce application/json
// @tags HotelServices
// @Param id path string true "Hotel Service ID"
// @Param   ReviewPayload body types.ReviewPayload true "Review payload"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /hotel/client/review/{id} [put]
// @Security BearerAuth
func (h *HotelHandler) handleReviewHotelService(c echo.Context) error {
	payload := types.ReviewPayload{}
	err := c.Bind(&payload)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "review detail is not correct", err)
	}

	status, errStr, err := h.bookingServiceIn.ReviewHotelService(payload)
	if err != nil {
		return utils.HandleError(c, status, errStr.Error(), err)
	}

	return c.JSON(http.StatusOK, "reviewed successfully")
}
