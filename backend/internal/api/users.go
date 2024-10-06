package api

import (
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/types"

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
}

// @Tags Users
// @Description User registration
// @Accept json
// @Produce json
// @Param user body model.User true "User object"
// @Success 201 {string} string "SignUp Success"
// @Failure 400 {string} string "Invalid username or password"
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

// @Tags Users
// @Description User login
// @Accept json
// @Produce json
// @Param payload body types.LoginPayload true "Login Payload"
// @Success 200 {object} map[string]string
// @Failure 400 {string} string "Invalid login credentials"
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
