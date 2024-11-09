package api

import (
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/utils"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type ProfileHandler struct {
	profileServiceIn service.ProfileServiceIn
}

func NewProfileHandler(profileServiceIn service.ProfileServiceIn) *ProfileHandler {
	return &ProfileHandler{profileServiceIn: profileServiceIn}
}

func (h *ProfileHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/create", h.handleCreateProfile)
}

// @Summary Create New Profile
// @Description create new profile
// @tags Profiles
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/profile/create [post]
func (h *ProfileHandler) handleCreateProfile(c echo.Context) error {
	profile := model.Profile{}
	err := c.Bind(&profile)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "Profile detail not correct", err)
	}

	err = h.profileServiceIn.CreateProfile(profile)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "Create profile not success", err)
	}

	return c.JSON(http.StatusCreated, "Create profile success")
}
