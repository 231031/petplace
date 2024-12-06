package api

import (
	"fmt"
	"net/http"
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/types"
	"petplace/internal/utils"
	"strings"

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
	// hotel
	g.POST("", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleCreateCageRoom,
		),
	))
	g.PUT("/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleUpdateCageRoom,
		),
	))
	g.DELETE("/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleDeleteCageRoom,
		),
	))

	// hotel get
	g.GET("/all/:profile_id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleGetAllCageRoomByHotel,
		),
	))
	g.GET("/type/:id", auth.AuthMiddleware(
		auth.AuthurizationMiddleware(
			[]string{string(RoleHotel)}, h.handleGetTypeCageRoom,
		),
	))
	g.GET("/:id", h.handleGetCageRoom, auth.AuthMiddleware)

	// user
	g.GET("/search", h.handleSearchCage)
	g.GET("/search/:user_id/:profile_id", h.handleSearchCageByHotel)
}

// @Summary		Create Cage
// @Description	create cage
// @Accept application/json
// @Produce application/json
// @tags CageRooms
// @Param   CageRoom body  model.CageRoom true "cageroom payload"
// @Success 201
// @Failure 400
// @Failure 500
// @Router /cageroom [post]
// @Security BearerAuth
func (h *CageRoomHandler) handleCreateCageRoom(c echo.Context) error {
	cage := model.CageRoom{}
	err := c.Bind(&cage)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "cage detail not correct", err)
	}

	status, msg, err := h.cageRoomServiceIn.CreateCageRoom(cage)
	if err != nil {
		return utils.HandleError(c, status, msg, err)
	}
	if status != http.StatusCreated {
		return utils.HandleError(c, status, msg, err)
	}

	return c.JSON(status, msg)
}

// @Summary		Update Cage
// @Description	update cage
// @Accept application/json
// @Produce application/json
// @tags CageRooms
// @Param id path string true "ID"
// @Param   CageRoom body  model.CageRoom true "cageroom payload"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /cageroom/{id} [put]
// @Security BearerAuth
func (h *CageRoomHandler) handleUpdateCageRoom(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "get cage room failed", err)
	}

	cage := model.CageRoom{}
	err = c.Bind(&cage)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cage detail not correct", err)
	}

	err = h.cageRoomServiceIn.UpdateCageRoom(id, cage)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "failed to update cage room", err)
	}

	return c.JSON(http.StatusOK, "updated successfully")
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
// @Router /cageroom/{id} [delete]
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
// @Router /cageroom/{id} [get]
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

// @Summary		Get Cage type and animal type
// @Description	Get Cage type and animal type
// @Produce application/json
// @tags CageRooms
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /cageroom/type/{id} [get]
// @Security BearerAuth
func (h *CageRoomHandler) handleGetTypeCageRoom(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get cage room", err)
	}

	cage, err := h.cageRoomServiceIn.GetAllAnimalCageType(id)
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
// @Router /cageroom/all/{profile_id} [get]
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
// @Router /cageroom/search [get]
func (h *CageRoomHandler) handleSearchCage(c echo.Context) error {
	filter := types.FilterSearchCage{}
	err := (&echo.DefaultBinder{}).BindQueryParams(c, &filter)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Search system not available", err)
	}

	animals := []types.FilterInfo{}
	for i := 0; ; i++ {
		animalType := strings.ToLower(c.QueryParam(fmt.Sprintf("animals[%d].animal_type", i)))
		cageSize := strings.ToLower(c.QueryParam(fmt.Sprintf("animals[%d].cage_size", i)))
		if animalType == "" && cageSize == "" {
			break
		}
		animals = append(animals, types.FilterInfo{AnimalType: animalType, CageSize: cageSize})
	}

	if len(animals) == 0 {
		return utils.HandleError(c, http.StatusInternalServerError, "please provide animal type and size", err)
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
// @Param user_id path string true "User ID of Client"
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
// @Router /cageroom/search/{user_id}/{profile_id} [get]
func (h *CageRoomHandler) handleSearchCageByHotel(c echo.Context) error {
	param_id := c.Param("profile_id")
	profile_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "hotel information is not correct", err)
	}

	param_id = c.Param("user_id")
	user_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	filter := types.FilterSearchCage{}
	err = (&echo.DefaultBinder{}).BindQueryParams(c, &filter)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "search system not available", err)
	}

	animals := []types.FilterInfo{}
	for i := 0; ; i++ {
		animalType := strings.ToLower(c.QueryParam(fmt.Sprintf("animals[%d].animal_type", i)))
		cageSize := strings.ToLower(c.QueryParam(fmt.Sprintf("animals[%d].cage_size", i)))
		if animalType == "" && cageSize == "" {
			break // End parsing when no more indexed parameters are found
		}
		animals = append(animals, types.FilterInfo{AnimalType: animalType, CageSize: cageSize})
	}

	if len(animals) == 0 {
		return utils.HandleError(c, http.StatusBadRequest, "please provide animal type and size", err)
	}

	// ?latitude=12.34&longitude=56.78&start_time=...&end_time=...&animals[0][animal_type]=dog&animals[0][cage_size]=large&animals[1][animal_type]=cat&animals[1][cage_size]=small
	profiles, err := h.cageRoomServiceIn.SearchCageByHotel(animals, filter, profile_id, user_id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "search system not available", err)
	}

	return c.JSON(http.StatusOK, profiles)
}
