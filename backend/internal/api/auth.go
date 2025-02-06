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
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/signup", h.handleSignUp)
	g.POST("/login", h.handleLogIn)
	g.POST("/google/callback", h.handleLoginGoogle)
}

// @Summary Sign Up
// @Description sign up a user
// @tags Authentication
// @Param   SignUpPayload body model.User true "Signup payload"
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /auth/signup [post]
func (h *AuthHandler) handleSignUp(c echo.Context) error {
	u := &model.User{}
	err := c.Bind(u)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user detail not correct", err)
	}

	if u.Email == "" || u.Password == "" {
		return utils.HandleError(c, http.StatusBadRequest, "invalid email or password", err)
	}

	err = h.authService.SignUp(*u)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "sign up failed", err)
	}
	return c.JSON(http.StatusCreated, "Sign up success")

}

// @Summary Log In
// @Description log in user
// @tags Authentication
// @Param   LoginPayload body types.LoginPayload true "Login payload"
// @Accept application/json
// @Produce application/json
// @Success 200
// @Failure 401
// @Failure 500
// @Router /auth/login [post]
func (h *AuthHandler) handleLogIn(c echo.Context) error {
	payload := &types.LoginPayload{}
	err := c.Bind(payload)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "login information is not correct", err)
	}

	user, token, err := h.authService.LogIn(*payload)
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

// @Summary Log In Google
// @Description log in google account
// @tags Authentication
// @Param   authCode body string true "Autharization-Code"
// @Accept application/json
// @Produce application/json
// @Success 200
// @Failure 401
// @Failure 500
// @Router /auth/google [post]
func (h *AuthHandler) handleLoginGoogle(c echo.Context) error {
	authCode := &types.AuthGooglePayload{}
	err := c.Bind(authCode)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "login information is not correct", err)
	}

	user, token, err := h.authService.LoginGoogle(authCode.AuthCode)
	if err != nil {
		return utils.HandleError(c, http.StatusUnauthorized, "login failed", err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "login Successfully",
		"token":   token,
		"user":    user,
	})
}

// @Summary Log In Google
// @Description log in google account
// @tags Authentication
// @Accept application/json
// @Produce application/json
// @Success 200
// @Failure 401
// @Failure 500
// @Router /auth/google/callback [get]
// func (h *AuthHandler) handleCallbackLoginGoogle(c echo.Context) error {
// 	authCode := c.QueryParam("code")
// 	if authCode == "" {
// 		return utils.HandleError(c, http.StatusBadRequest, "login information is not correct", fmt.Errorf("missing auth-code"))
// 	}

// 	fmt.Println("authCode", authCode)
// 	h.authService.LoginGoogle(authCode)
// 	return c.JSON(http.StatusOK, map[string]interface{}{
// 		"message": "login Successfully",
// 		// "token":   token,
// 		// "user":    user,
// 	})
// }
