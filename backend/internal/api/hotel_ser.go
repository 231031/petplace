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
	BookingService service.BookingServiceIn
}

func NewHotelHandler(bookingServiceIn service.BookingServiceIn) *HotelHandler {
	return &HotelHandler{BookingService: bookingServiceIn}
}


func (h *HotelHandler) RegisterRoutes(g *echo.Group) {
	// hotel
	g.GET("/:id/:status", h.GetAllHotelServiceByHotel)
	g.GET("/:id", h.GetHotelService)

	// client
	g.POST("/client/booking", h.BookHotelService)
	g.GET("/client/:id/:status", h.GetAllHotelServiceByUser)

	// both
	g.PUT("/:id", h.UpdateHotelSerivice)
}

// @Summary		Book Hotel Service
// @Description	book hotel service
// @Produce  application/json
// @tags HotelServices
// @Success 201
// @Failure 400
// @Failure 500
// @Router /service/hotel [post]
// @Security BearerAuth
func (h *HotelHandler) BookHotelService(c echo.Context) error {
	s := types.BookingHotelPayload{}
	err := c.Bind(&s)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}

	err = h.BookingService.BookHotelService(s)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Booking not success", err)
	}
	
	return c.JSON(http.StatusOK, "Booking success")
}

// @Summary		Get Hotel Service Hotel
// @Description	get hotel service hotel
// @Produce  application/json
// @tags HotelServices
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /service/hotel/:id/:status [get]
// @Security BearerAuth
func (h *HotelHandler) GetAllHotelServiceByHotel(c echo.Context) error {
	id := c.Param("id")
	profile_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Booking detail not correct", err)
	}
	status := c.Param("status")

	ser_info, err := h.BookingService.GetAllBookingHotelByHotel(profile_id, status)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Booking not available", err)
	}
	
	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Get Hotel Service User
// @Description	get hotel service user
// @Produce  application/json
// @tags HotelServices
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /client/service/hotel/:id/:status [get]
// @Security BearerAuth
func (h *HotelHandler) GetAllHotelServiceByUser(c echo.Context) error {
	id := c.Param("id")
	user_id, err := utils.ConvertTypeToUint(id)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}
	status := c.Param("status")

	ser_info, err := h.BookingService.GetAllBookingHotelByUser(user_id, status)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	
	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Get Hotel Service 
// @Description	get hotel service 
// @Produce  application/json
// @tags HotelServices
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /service/hotel/:id [get]
// @Security BearerAuth
func (h *HotelHandler) GetHotelService(c echo.Context) error {
	str := c.Param("id")
	id, err := utils.ConvertTypeToUint(str)
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	ser_info, err := h.BookingService.GetBookingHotel(id)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	
	return c.JSON(http.StatusOK, ser_info)
}

// @Summary		Update Hotel Service
// @Description	update hotel service
// @Produce  application/json
// @tags HotelServices
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /service/hotel/:id [put]
// @Security BearerAuth
func (h *HotelHandler) UpdateHotelSerivice(c echo.Context) error {
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
	
	err = h.BookingService.UpdateHotelService(id, ser)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Update booking detail not successful", err)
	}
	
	return c.JSON(http.StatusOK, "Update booking detail successful")
}