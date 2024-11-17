package api

import (
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type UsersHandler struct {
	usersServiceIn service.UsersServiceIn
}

func NewUsersHandler(usersServiceIn service.UsersServiceIn) *UsersHandler {
	return &UsersHandler{usersServiceIn: usersServiceIn}
}

func (h *UsersHandler) RegisterRoutes(g *echo.Group) {
	// role : client
	g.GET("/card/:id", h.GetCreaditCard)

	// animal
	g.GET("/animal/:user_id/:animal_type", h.handleGetAnimalUserByType)
	g.GET("/animal/:id", h.handleGetAnimalUser)
	g.GET("/animals/:user_id", h.handleGetAllAnimalUserByUser)
	g.POST("/animals", h.handleCreateAnimalUser)
	g.PUT("/animal/:id", h.handleUpdateAnimalUser)

	// Favorites
	g.POST("/fav", h.handleAddFavoriteCage)
	g.GET("/fav/:user_id", h.handleGetFavoriteCageByUser)
	g.DELETE("/fav/:user_id/:cage_id", h.handleDeleteFavoriteCage)
}

// @Summary Create Animals
// @Description create animals
// @tags Users
// @Param   AnimalUserModel body []model.AnimalUser true "user's animal model"
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /user/animals [post]
// @Security BearerAuth
func (h *UsersHandler) handleCreateAnimalUser(c echo.Context) error {
	animals := []model.AnimalUser{}
	err := c.Bind(&animals)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "animals detail not correct", err)
	}

	err = h.usersServiceIn.CreateAnimalUser(animals)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "failed to add animals", err)
	}

	return c.JSON(http.StatusCreated, "add animals success")
}

// @Summary Update Animal
// @Description update animal
// @tags Users
// @Accept application/json
// @Produce application/json
// @Param id path string true "Animal User ID"
// @Param   AnimalUserModel body model.AnimalUser true "user's animal model"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/animal/{id} [put]
// @Security BearerAuth
func (h *UsersHandler) handleUpdateAnimalUser(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "animal information is not correct", err)
	}

	animal := model.AnimalUser{}
	err = c.Bind(&animal)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "animal detail is not correct", err)
	}

	err = h.usersServiceIn.UpdateAnimalUser(id, animal)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "failed to update animal", err)
	}

	return c.JSON(http.StatusOK, "updated animal successfully")
}

// @Summary Get Animals
// @Description get animals
// @tags Users
// @Produce application/json
// @Param user_id path string true "User ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/animals/{user_id} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAllAnimalUserByUser(c echo.Context) error {
	param_id := c.Param("user_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	animals, err := h.usersServiceIn.GetAllAnimalUser(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "animals not available", err)
	}

	return c.JSON(http.StatusOK, animals)
}

// @Summary Get Animal
// @Description get animal
// @tags Users
// @Produce application/json
// @Param id path string true "Animal ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/animal/{id} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAnimalUser(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "animal information is not correct", err)
	}

	animal, err := h.usersServiceIn.GetAnimalUser(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "animal not available", err)
	}

	return c.JSON(http.StatusOK, animal)
}

// @Summary Get Credit Card
// @Description get credit card
// @tags Users
// @Produce application/json
// @Param id path string true "User ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/card/{id} [get]
// @Security BearerAuth
func (h *UsersHandler) GetCreaditCard(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	card, err := h.usersServiceIn.GetCreditCard(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "credit card not available", err)
	}

	return c.JSON(http.StatusOK, card)
}

// @Summary Get Animal User By Animal Type
// @Description get animal of each user filter by animal type
// @tags Users
// @Produce application/json
// @Param user_id path string true "User ID"
// @Param animal_type path string true "Animal Type"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/animal/{user_id}/{animal_type} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAnimalUserByType(c echo.Context) error {
	param_id := c.Param("user_id")
	user_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	animal_type := c.Param("animal_type")

	animals, err := h.usersServiceIn.GetAnimalUserByType(user_id, animal_type)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "your animals not available", err)
	}

	return c.JSON(http.StatusOK, animals)
}

// @Summary Add Favorites Cages
// @Description add favorite cages
// @tags Users
// @Produce application/json
// @Param FavoritePayload body model.FavoriteCage true "model favorite"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/fav [post]
// @Security BearerAuth
func (h *UsersHandler) handleAddFavoriteCage(c echo.Context) error {
	fav := model.FavoriteCage{}
	err := c.Bind(&fav)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "favaorite information is not correct", err)
	}

	err = h.usersServiceIn.AddFavoriteCage(fav)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "failed to add favorite cage", err)
	}

	return c.JSON(http.StatusCreated, "add favorite success")
}

// @Summary delete Favorites Cages
// @Description delete favorite cages
// @tags Users
// @Produce application/json
// @Param user_id path string true "User ID"
// @Param cage_id path string true "Cage ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/fav/{user_id}/{cage_id} [delete]
// @Security BearerAuth
func (h *UsersHandler) handleDeleteFavoriteCage(c echo.Context) error {
	param_id := c.Param("user_id")
	user_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "cage information is not correct", err)
	}

	param_id = c.Param("cage_id")
	cage_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "cage information is not correct", err)
	}

	err = h.usersServiceIn.DelFavoriteCage(user_id, cage_id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "favorite cage is not available", err)
	}

	return c.JSON(http.StatusOK, "deleted favorite cage")
}

// @Summary Get Favorites Cages
// @Description get favorite cages
// @tags Users
// @Produce application/json
// @Param user_id path string true "User ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /user/fav/{user_id} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetFavoriteCageByUser(c echo.Context) error {
	param_id := c.Param("user_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	favorites, err := h.usersServiceIn.GetFavoriteCageByUser(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "favorite cage is not available", err)
	}

	return c.JSON(http.StatusOK, favorites)
}
