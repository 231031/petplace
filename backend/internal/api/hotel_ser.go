package api

import (
	"net/http"
	"petplace/internal/auth"
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
	g.PUT("/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleAcceptRejectBookHotel,
		),
	))

	// hotel get
	g.GET("/:id/:status", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleGetAllHotelServiceByHotel,
		),
	))

	// client
	g.POST("/client/booking", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient)}, h.handleBookHotelService,
		),
	))
	g.PUT("/client/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient)}, h.handleManageRefundBookHotel,
		),
	))
	g.PUT("/client/review/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient)}, h.handleReviewHotelService,
		),
	))

	// client get
	g.GET("/client/:id/:status", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient)}, h.handleGetStatusHotelServiceByUser,
		),
	))
	g.GET("/client/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient)}, h.handleGetAllHotelServiceByUser,
		),
	))
	g.GET("/client/again/:cage_id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient)}, h.handleCheckBookAgain,
		),
	))

	// both
	g.GET("/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleClient), string(RoleHotel)}, h.handleGetHotelService,
		),
	))

	// user
	g.GET("/review/:profile_id", h.handleGetReviewByHotel)
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
	if err != nil || status != http.StatusCreated {
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

// @Summary		Get Hotel Service User by status
// @Description	get hotel service user by status
// @Produce application/json
// @tags HotelServices
// @Param id path string true "User ID"
// @Param status path string true "Status"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /hotel/client/{id}/{status} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetStatusHotelServiceByUser(c echo.Context) error {
	id := c.Param("id")
	user_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}
	status := c.Param("status")

	ser_info, err := h.bookingServiceIn.GetStatusBookingHotelByUser(user_id, status)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "falied to get reservation history", err)
	}

	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Get all Hotel Service User
// @Description	get all hotel service user
// @Produce application/json
// @tags HotelServices
// @Param id path string true "User ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /hotel/client/{id} [get]
// @Security BearerAuth
func (h *HotelHandler) handleGetAllHotelServiceByUser(c echo.Context) error {
	id := c.Param("id")
	user_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	ser_info, err := h.bookingServiceIn.GetAllHotelServiceByUser(user_id)
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

// @Summary		Check Book Hotel Service Again
// @Description	Check Book Hotel Service Again
// @Produce application/json
// @tags HotelServices
// @Param id path string true "Cage ID"
// @Param start_time query string false "Filter by start_time"
// @Param end_time query string false "Filter by end_time"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /client/again/{cage_id} [get]
// @Security BearerAuth
func (h *HotelHandler) handleCheckBookAgain(c echo.Context) error {
	str := c.Param("cage_id")
	cage_id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "hotel information is not correct", err)
	}

	payload := types.BookAgainPayload{}
	err = (&echo.DefaultBinder{}).BindQueryParams(c, &payload)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "time information is not correct", err)
	}
	payload.CageID = cage_id

	checked, strErr, err := h.bookingServiceIn.CheckAvailableBooking(payload)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, strErr.Error(), err)
	}
	if strErr != nil {
		return utils.HandleError(c, http.StatusBadRequest, strErr.Error(), err)
	}

	if !checked {
		return utils.HandleError(c, http.StatusBadRequest, "selected date is not available", err)
	}

	return c.JSON(http.StatusOK, "selected date is available")
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
