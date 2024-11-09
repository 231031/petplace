package api

import (
	"fmt"
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/types"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type CageRoomHandler struct {
	cageRoomServiceIn service.CageRoomServiceIn
}

func NewCageRoomHandler(cageRoomServiceIn service.CageRoomServiceIn) *CageRoomHandler {
	return &CageRoomHandler{cageRoomServiceIn: cageRoomServiceIn}
}

func (h *CageRoomHandler) RegisterRoutes(g *echo.Group) {
	g.POST("", h.handleCreateCageRoom)
	g.PUT("/:id", h.handleUpdateCageRoom)
	g.DELETE("/:id", h.handleDeleteCageRoom)
	g.GET("/all/:profile_id", h.handleGetAllCageRoomByHotel)
	g.GET("/:id", h.handleGetCageRoom)
	g.GET("/search", h.handleSearchCage)
	g.GET("/search/:profile_id", h.handleSearchCageByHotel)
}

// @Summary		Create Cage
// @Description	create cage
// @Accept application/json
// @Produce application/json
// @tags CageRooms
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/cageroom [post]
// @Security BearerAuth
func (h *CageRoomHandler) handleCreateCageRoom(c echo.Context) error {
	cages := []model.CageRoom{}
	err := c.Bind(&cages)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cage detail not correct", err)
	}

	err = h.cageRoomServiceIn.CreateCageRoom(cages)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Add cage not success", err)
	}

	return c.JSON(http.StatusCreated, "Add cage success")
}

// @Summary		Update Cage
// @Description	update cage
// @Accept application/json
// @Produce application/json
// @tags CageRooms
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/cageroom/{id} [put]
// @Security BearerAuth
func (h *CageRoomHandler) handleUpdateCageRoom(c echo.Context) error {

	return nil
}

// @Summary		Delete Cage
// @Description	delete cage
// @Accept application/json
// @Produce application/json
// @tags CageRooms
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/cageroom/{id} [delete]
// @Security BearerAuth
func (h *CageRoomHandler) handleDeleteCageRoom(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "get cage room failed", err)
	}

	err = h.cageRoomServiceIn.DeleteCageRoom(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "cage room not available", err)
	}

	return c.JSON(http.StatusOK, "Delete cage success")
}

// @Summary		Get Cage
// @Description	get cage
// @Produce application/json
// @tags CageRooms
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/cageroom/{id} [get]
// @Security BearerAuth
func (h *CageRoomHandler) handleGetCageRoom(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cage, err := h.cageRoomServiceIn.GetCageRoom(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, cage)
}

// @Summary		Get Cages
// @Description	get cages
// @Produce application/json
// @tags CageRooms
// @Param profile_id path string true "Profile ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/cageroom/all/{profile_id} [get]
// @Security BearerAuth
func (h *CageRoomHandler) handleGetAllCageRoomByHotel(c echo.Context) error {
	param_id := c.Param("profile_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cages, err := h.cageRoomServiceIn.GetAllCageRoom(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Cage room not available", err)
	}

	return c.JSON(http.StatusOK, cages)
}

// @Summary		Get Selected Cages
// @Description	get selected cages
// @Produce application/json
// @tags CageRooms
// @Param animals query string false "Filter by animal type and size ex. animals[0].animal_type=dog&animals[0].cage_size=s"
// @Param start_time query string false "Filter by start_time"
// @Param end_time query string false "Filter by end_time"
// @Param latitude query string false "Filter by latitude"
// @Param longitude query string false "Filter by longitude"
// @Param sort query string false "Sort by sort"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/cageroom/search [get]
func (h *CageRoomHandler) handleSearchCage(c echo.Context) error {
	filter := types.FilterSearchCage{}
	err := (&echo.DefaultBinder{}).BindQueryParams(c, &filter)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Search system not available", err)
	}

	animals := []types.FilterInfo{}
	for i := 0; ; i++ {
		animalType := c.QueryParam(fmt.Sprintf("animals[%d].animal_type", i))
		cageSize := c.QueryParam(fmt.Sprintf("animals[%d].cage_size", i))
		if animalType == "" && cageSize == "" {
			break // End parsing when no more indexed parameters are found
		}
		animals = append(animals, types.FilterInfo{AnimalType: animalType, CageSize: cageSize})
	}

	// ?latitude=12.34&longitude=56.78&start_time=...&end_time=...&animals[0][animal_type]=dog&animals[0][cage_size]=large&animals[1][animal_type]=cat&animals[1][cage_size]=small

	profiles, err := h.cageRoomServiceIn.SearchCage(animals, filter)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Search system not available", err)
	}

	return c.JSON(http.StatusOK, profiles)
}

// @Summary		Get Selected Cages by Hotel
// @Description	get selected cages by hotel
// @Produce application/json
// @tags CageRooms
// @Param profile_id path string true "Profile ID"
// @Param animals query string false "Filter by animal type and size ex. animals[0].animal_type=dog&animals[0].cage_size=s"
// @Param start_time query string false "Filter by start_time"
// @Param end_time query string false "Filter by end_time"
// @Param latitude query string false "Filter by latitude"
// @Param longitude query string false "Filter by longitude"
// @Param sort query string false "Sort by sort"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/cageroom/search/{profile_id} [get]
func (h *CageRoomHandler) handleSearchCageByHotel(c echo.Context) error {
	param_id := c.Param("profile_id")
	profile_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "cannot get hotel detail", err)
	}

	filter := types.FilterSearchCage{}
	err = (&echo.DefaultBinder{}).BindQueryParams(c, &filter)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "search system not available", err)
	}

	animals := []types.FilterInfo{}
	for i := 0; ; i++ {
		animalType := c.QueryParam(fmt.Sprintf("animals[%d].animal_type", i))
		cageSize := c.QueryParam(fmt.Sprintf("animals[%d].cage_size", i))
		if animalType == "" && cageSize == "" {
			break // End parsing when no more indexed parameters are found
		}
		animals = append(animals, types.FilterInfo{AnimalType: animalType, CageSize: cageSize})
	}

	// ?latitude=12.34&longitude=56.78&start_time=...&end_time=...&animals[0][animal_type]=dog&animals[0][cage_size]=large&animals[1][animal_type]=cat&animals[1][cage_size]=small

	profiles, err := h.cageRoomServiceIn.SearchCageByHotel(animals, filter, profile_id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "search system not available", err)
	}

	return c.JSON(http.StatusOK, profiles)
}
