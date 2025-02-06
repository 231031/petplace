package api

import (
	"net/http"
	"petplace/internal/model"
	"petplace/internal/service"
	"petplace/internal/utils"
	"strings"

	"github.com/labstack/echo/v4"
)

// handle requests and response requests
type ProfileHandler struct {
	profileService service.ProfileService
}

func NewProfileHandler(profileService service.ProfileService) *ProfileHandler {
	return &ProfileHandler{profileService: profileService}
}

func (h *ProfileHandler) RegisterRoutes(g *echo.Group) {
	g.POST("/create", h.handleCreateProfile)
	g.GET("/:id/:role", h.handleGetProfileByUserID)
	g.GET("/:id", h.handleGetAllProfileByUserID)
	g.PUT("/:id", h.handleUpdateProfile)

}

// @Summary Create New Profile
// @Description create new profile
// @tags Profiles
// @Param   Profile body model.Profile true "Profile model"
// @Accept application/json
// @Produce application/json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /profile/create [post]
// @Security BearerAuth
func (h *ProfileHandler) handleCreateProfile(c echo.Context) error {
	profile := model.Profile{}
	err := c.Bind(&profile)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "profile detail not correct", err)
	}

	var status int
	var msg string
	if strings.ToLower(profile.Role) == "clinic" {
		status, msg, err = h.profileService.CreateCliniCareProfile(profile)
	} else {
		status, msg, err = h.profileService.CreateProfile(profile)
	}

	if err != nil {
		return utils.HandleError(c, status, msg, err)
	}
	if status != http.StatusCreated {
		return utils.HandleError(c, status, msg, err)
	}

	return c.JSON(http.StatusCreated, msg)
}

// @Summary Update Profile
// @Description update profile
// @tags Profiles
// @Accept application/json
// @Produce application/json
// @Param id path string true "ID"
// @Param   ProfileModel body model.Profile true "profile model"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /profile/{id} [put]
// @Security BearerAuth
func (h *ProfileHandler) handleUpdateProfile(c echo.Context) error {
	param_id := c.Param("id")
	id, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	profile := model.Profile{}
	err = c.Bind(&profile)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "profile detail not correct", err)
	}

	err = h.profileService.UpdateProfile(id, profile)
	if err != nil {
		return utils.HandleError(c, http.StatusInternalServerError, "failed to udpate profile", err)
	}

	return c.JSON(http.StatusOK, "updated profile successfully")
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
// @Router /profile/{user_id}/{role} [get]
// @Security BearerAuth
func (h *ProfileHandler) handleGetProfileByUserID(c echo.Context) error {
	role := c.Param("role")
	param_id := c.Param("id")
	userID, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "get user id failed", err)
	}

	profile, token, err := h.profileService.GetProfileByUserID(userID, role)
	if profile.ID == 0 {
		return utils.HandleError(c, http.StatusBadRequest, "this profile is not found, create first", err)
	}

	response := map[string]interface{}{
		"profile": profile,
		"token":   token,
	}

	return c.JSON(http.StatusOK, response)
}

// @Summary Get Profile By User ID
// @Description get profile by user ID
// @tags Profiles
// @Produce application/json
// @Param user_id path string true "User ID"
// @Success 200
// @Failure 400
// @Failure 500
// @Router /profile/{user_id} [get]
// @Security BearerAuth
func (h *ProfileHandler) handleGetAllProfileByUserID(c echo.Context) error {
	param_id := c.Param("id")
	userID, err := utils.ConvertTypeToUint(param_id)
	if err != nil {
		return utils.HandleError(c, http.StatusBadRequest, "user information is not correct", err)
	}

	profiles, err := h.profileService.GetAllProfileByUserID(userID)
	if len(profiles) == 0 {
		return utils.HandleError(c, http.StatusBadRequest, "profile is not created, create first", err)
	}
	return c.JSON(http.StatusOK, profiles)
}
