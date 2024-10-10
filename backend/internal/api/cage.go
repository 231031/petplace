package api

import (
	"net/http"
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
	g.GET("/:profile_id", h.getAllCageRoomByHotel)
	g.GET("/:id", h.getCageRoom)
}

func (h *CageRoomHandler) getCageRoom(c echo.Context) error { 
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cage, err := h.CageRoomService.GetCageRoom(*id)
	if err != nil {
		utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, cage)
}

func (h *CageRoomHandler) getAllCageRoomByHotel(c echo.Context) error {
	param_id := c.Param("profile_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cages, err := h.CageRoomService.GetAllCageRoom(*id)
	if err != nil {
		utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, cages)
}