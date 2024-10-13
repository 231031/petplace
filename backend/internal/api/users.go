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
	usersService service.UsersServiceIn
}

func NewUsersHandler(usersServiceIn service.UsersServiceIn) *UsersHandler {
	return &UsersHandler{usersService: usersServiceIn}
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
// @Accept  json
// @Produce  json
// @Success 201 
// @Failure 400 
// @Failure 500 
// @Router /api/users/signup [post]
func (h *UsersHandler) handleSignUp(c echo.Context) error {
	u := &model.User{}
	err := c.Bind(u)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	if u.Email == "" || u.Password == "" {
		return c.String(400, "Invalid username or password")
	}

	err = h.usersService.SignUp(*u)
	if err != nil {
		return c.String(400, err.Error())
	}
	return c.String(201, "SignUp Success")

}

// @Summary Log In
// @Description log in user
// @tags Users
// @Accept  json
// @Produce  json
// @Success 200 
// @Failure 401 
// @Failure 500 
// @Router /api/users/login [post]
func (h *UsersHandler) handleLogIn(c echo.Context) error {
	payload := &types.LoginPayload{}
	err := c.Bind(payload)
	if err != nil {
		return err
	}

	token, err := h.usersService.LogIn(*payload)
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
// @Accept  json
// @Produce  json
// @Success 201 
// @Failure 400 
// @Failure 500 
// @Router /api/animals [post]
// @Security BearerAuth
func (h *UsersHandler) handleCreateAnimalUser(c echo.Context) error {
	animals := []model.AnimalUser{}
	err := c.Bind(&animals)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Animals detail not correct", err)
	}

	err = h.usersService.CreateAnimalUser(animals)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Add animals not success", err)
	}
	
	return c.JSON(http.StatusOK, "Add animals success")
}

// @Summary Update Animal
// @Description update animal
// @tags Users
// @Accept  json
// @Produce  json
// @Param    id path int true "id"
// @Success 200 
// @Failure 400 
// @Failure 500 
// @Router /api/animal/:id [put]
// @Security BearerAuth
func (h *UsersHandler) handleUpdateAnimalUser(c echo.Context) error {
	return nil
}

// @Summary Get Animals
// @Description get animals
// @tags Users
// @Accept  json
// @Produce  json
// @Param    user_id path int true "user_id"
// @Success 200
// @Failure 400 
// @Failure 500 
// @Router /api/animals/:user_id [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAllAnimalUserByUser(c echo.Context) error {
	param_id := c.Param("user_id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get animals", err)
	}

	animals, err := h.usersService.GetAllAnimalUser(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Animals not available", err)
	}

	return c.JSON(http.StatusOK, animals)
}

// @Summary Get Animal
// @Description get animal
// @tags Users
// @Accept  json
// @Produce  json
// @Param    id path int true "id"
// @Success 200 
// @Failure 400 
// @Failure 500 
// @Router /api/animal/:id [get]
// @Security BearerAuth
func (h *UsersHandler) handleGetAnimalUser(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Cannot get animal", err)
	}

	animal, err := h.usersService.GetAnimalUser(id)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Animal not available", err)
	}

	return c.JSON(http.StatusOK, animal)
}


