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
	g.GET("/:id/:role", h.handleGetProfileByUserID)
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
// @Security BearerAuth
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

// @Summary Get Profile By User ID and Role
// @Description get profile by user ID and role
// @tags Profiles
// @Produce application/json
// @Param user_id path string true "User ID"
// @Param role path string true "Role"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /api/profile/{user_id}/{role} [get]
// @Security BearerAuth
func (h *ProfileHandler) handleGetProfileByUserID(c echo.Context) error {
	role := c.Param("role")
	param_id := c.Param("id")
	userID, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "get user id failed", err)
	}

	profile, token, err := h.profileServiceIn.GetProfileByUserID(userID, role)
	if profile.ID == 0 {
		return utils.HandleError(c, http.StatusBadRequest, "this profile is not found, create first", err)
	}

	response := map[string]interface{}{
		"profile": profile,
		"token":   token,
	}

	return c.JSON(http.StatusOK, response)
}
