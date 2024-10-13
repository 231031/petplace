package api

import (
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type CageRoomHandler struct {
	CageRoomService service.CageRoomServiceIn
}

func NewCageRoomHandler(cageRoomServiceIn service.CageRoomServiceIn) *CageRoomHandler {
	return &CageRoomHandler{CageRoomService: cageRoomServiceIn}
}


func (h *CageRoomHandler) RegisterRoutes(g *echo.Group) {
	g.POST("", h.handleCreateCageRoom)
	g.PUT("/:id", h.handleUpdateCageRoom)
	g.DELETE("/:id", h.handleDeleteCageRoom)
	g.GET("/all/:profile_id", h.handleGetAllCageRoomByHotel)
	g.GET("/:id", h.handleGetCageRoom)
}

// @Summary		Create Cage
// @Description	create cage
// @Produce  application/json
// @tags CageRooms
// @Success 201
// @Failure 400
// @Failure 500
// @Router /cageroom [post]
// @Security BearerAuth
func (h *CageRoomHandler) handleCreateCageRoom(c echo.Context) error {
	cages := []model.CageRoom{}
	err := c.Bind(&cages)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cage detail not correct", err)
	}

	err = h.CageRoomService.CreateCageRoom(cages)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Add cage not success", err)
	}
	
	return c.JSON(http.StatusOK, "Add cage success")
}

// @Summary		Update Cage
// @Description	update cage
// @Produce  application/json
// @tags CageRooms
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /cageroom/:id [put]
// @Security BearerAuth
func (h *CageRoomHandler) handleUpdateCageRoom(c echo.Context) error {

	return nil
}

// @Summary		Delete Cage
// @Description	delete cage
// @Produce  application/json
// @tags CageRooms
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /cageroom/:id [delete]
// @Security BearerAuth
func (h *CageRoomHandler) handleDeleteCageRoom(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	err = h.CageRoomService.DeleteCageRoom(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, "Delete cage success")
}

// @Summary		Get Cage
// @Description	get cage 
// @Produce  application/json
// @tags CageRooms
// @Param    id path int true "id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /cageroom/:id [get]
// @Security BearerAuth
func (h *CageRoomHandler) handleGetCageRoom(c echo.Context) error { 
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cage, err := h.CageRoomService.GetCageRoom(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, cage)
}

// @Summary		Get Cages
// @Description	get cages
// @Produce  application/json
// @tags CageRooms
// @Param    profile_id path int true "profile_id"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /cageroom/all/:profile_id [get]
// @Security BearerAuth
func (h *CageRoomHandler) handleGetAllCageRoomByHotel(c echo.Context) error {
	param_id := c.Param("profile_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cages, err := h.CageRoomService.GetAllCageRoom(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, cages)
}