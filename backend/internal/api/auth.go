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
type AuthHandler struct {
	authServiceIn service.AuthServiceIn
}

func NewAuthHandler(authServiceIn service.AuthServiceIn) *AuthHandler {
	return &AuthHandler{authServiceIn: authServiceIn}
}

func (h *AuthHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/signup", h.handleSignUp)
	g.POST("/login", h.handleLogIn)
}

// @Summary Sign Up
// @Description sign up a user
// @tags Authentication
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/auth/signup [post]
func (h *AuthHandler) handleSignUp(c echo.Context) error {
	u := &model.User{}
	err := c.Bind(u)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user detail not correct", err)
	}

	if u.Email == "" || u.Password == "" {
		return utils.HandleError(c, http.StatusBadRequest, "invalid email or password", err)
	}

	err = h.authServiceIn.SignUp(*u)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "sign up failed", err)
	}
	return c.JSON(http.StatusCreated, "Sign up success")

}

// @Summary Log In
// @Description log in user
// @tags Authentication
// @Accept application/json
// @Produce application/json
// @Success 200
// @Failure 401
// @Failure 500
// @Router /api/auth/login [post]
func (h *AuthHandler) handleLogIn(c echo.Context) error {
	payload := &types.LoginPayload{}
	err := c.Bind(payload)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "login information is not correct", err)
	}

	user, token, err := h.authServiceIn.LogIn(*payload)
	if err != nil {
		return utils.HandleError(c, http.StatusUnauthorized, "email or password is not correct", err)
	}

	if token == "" {
		return utils.HandleError(c, http.StatusUnauthorized, "email or password is not correct", err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "login Successfully",
		"token":   token,
		"user":    user,
	})

}
