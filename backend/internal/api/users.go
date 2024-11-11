package api

import (
	"petplace/internal/model"
	"petplace/internal/service"

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
	g.POST("/signup", h.SignUp)
	g.POST("/signin", h.SignIn)
}

// @Tags api v1
// @Description registration
// @Accept json
// @Success 200
// @Router /api/users/signup [post]
func (h *UsersHandler) SignUp(c echo.Context) error {
	u := &model.Users{}
	err := c.Bind(u)
	if err != nil {
		return err
	}

	err = h.usersServiceIn.CreateAnimalUser(animals)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Add animals not success", err)
	}
	return c.String(201, "SignUp Success")
	

	return c.JSON(http.StatusCreated, "Add animals success")
}
func (h *UsersHandler) SignIn(c echo.Context) error {

// @Summary Update Animal
// @Description update animal
// @tags Users
// @Accept application/json
// @Produce application/json
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/user/animal/{id} [put]
// @Security BearerAuth
func (h *UsersHandler) handleUpdateAnimalUser(c echo.Context) error {
	return nil
}

// @Summary Get Animals
// @Description get animals
// @tags Users
// @Produce application/json
// @Param user_id path string true "User ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/user/animals/{user_id} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAllAnimalUserByUser(c echo.Context) error {
	param_id := c.Param("user_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get animals", err)
	}

	animals, err := h.usersServiceIn.GetAllAnimalUser(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Animals not available", err)
	}

	return c.JSON(http.StatusOK, animals)
}

// @Summary Get Animal
// @Description get animal
// @tags Users
// @Produce application/json
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/user/animal/{id} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAnimalUser(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get animal", err)
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
// @Param id path string true "ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/user/card/{id} [get]
// @Security BearerAuth
func (h *UsersHandler) GetCreaditCard(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "cannot get user id", err)
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
// @Router /api/user/animal/{user_id}/{animal_type} [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAnimalUserByType(c echo.Context) error {
	param_id := c.Param("user_id")
	user_id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "cannot get user id", err)
	}

	animal_type := c.Param("animal_type")

	animals, err := h.usersServiceIn.GetAnimalUserByType(user_id, animal_type)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "your animals not available", err)
	}

	return c.JSON(http.StatusOK, animals)
}
