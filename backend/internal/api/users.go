package api

import (
	"petplace/internal/model"
	"petplace/internal/service"

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

	if u.Email == "" || u.Password == "" {
		return c.String(400, "Invalid username or password")
	}

	err = h.usersService.SignUp(*u)
	if err != nil {
		return c.String(400, err.Error())
	}
	return c.String(201, "SignUp Success")
	

}
func (h *UsersHandler) SignIn(c echo.Context) error {

	return c.String(200, "SignIn Success")
	
}