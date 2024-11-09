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
type UsersHandler struct {
	usersServiceIn service.UsersServiceIn
}

func NewUsersHandler(usersServiceIn service.UsersServiceIn) *UsersHandler {
	return &UsersHandler{usersServiceIn: usersServiceIn}
}

func (h *UsersHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/signup", h.handleSignUp)
	g.POST("/login", h.handleLogIn)

	// role : client
	g.POST("/animals", h.handleCreateAnimalUser)
	g.GET("/animals/:user_id", h.handleGetAllAnimalUserByUser)
	g.GET("/animal/:id", h.handleGetAnimalUser)
	g.PUT("/animal/:id", h.handleUpdateAnimalUser)
}

// @Summary Sign Up
// @Description sign up a user
// @tags Users
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/user/signup [post]
func (h *UsersHandler) handleSignUp(c echo.Context) error {
	u := &model.User{}
	err := c.Bind(u)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user detail not correct", err)
	}

	if u.Email == "" || u.Password == "" {
		return utils.HandleError(c, http.StatusBadRequest, "invalid email or password", err)
	}

	err = h.usersServiceIn.SignUp(*u)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "sign up failed", err)
	}
	return c.JSON(http.StatusCreated, "Sign up success")

}

// @Summary Log In
// @Description log in user
// @tags Users
// @Accept application/json
// @Produce application/json
// @Success 200
// @Failure 401
// @Failure 500
// @Router /api/user/login [post]
func (h *UsersHandler) handleLogIn(c echo.Context) error {
	payload := &types.LoginPayload{}
	err := c.Bind(payload)
	if err != nil {
		return err
	}

	token, err := h.usersServiceIn.LogIn(*payload)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "SignIn Success",
		"token":   token,
	})

}

// @Summary Create Animals
// @Description create animals
// @tags Users
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/user/animals [post]
// @Security BearerAuth
func (h *UsersHandler) handleCreateAnimalUser(c echo.Context) error {
	animals := []model.AnimalUser{}
	err := c.Bind(&animals)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Animals detail not correct", err)
	}

	err = h.usersServiceIn.CreateAnimalUser(animals)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Add animals not success", err)
	}

	return c.JSON(http.StatusCreated, "Add animals success")
}

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
		return utils.HandleError(c, http.StatusInternalServerError, "Animal not available", err)
	}

	return c.JSON(http.StatusOK, animal)
}
