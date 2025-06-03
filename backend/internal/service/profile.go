package service

import (
	"errors"
	"fmt"
	"net/http"
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/utils"
	"sort"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type profileService struct {
	ProfileRepository repository.ProfileRepository
	UserServiceIn     UsersService
	Validate          *validator.Validate
}

func NewProfileService(
	profileRepository repository.ProfileRepository,
	userService UsersService,
	validate *validator.Validate,
) ProfileService {
	return &profileService{
		ProfileRepository: profileRepository,
		UserServiceIn:     userService,
		Validate:          validate,
	}
}

func (s *profileService) CreateProfile(profile model.Profile) (int, string, error) {
	err := s.Validate.Struct(profile)
	if err != nil {
		return http.StatusBadRequest, "profile detail is not correct", err
	}

	_, err = s.ProfileRepository.GetProfileByUserID(profile.UserID, profile.Role)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		profile.Role = strings.ToLower(profile.Role)
		profile.Image = utils.MapStringArrayToText(profile.ImageArray)
		profile.Facility = utils.MapStringArrayToText(profile.FacilityArray)
		status, msg, err := s.ProfileRepository.CreateProfile(profile)
		if err != nil {
			return http.StatusInternalServerError, msg, err
		}

		return status, msg, nil
	}
	return http.StatusBadRequest, "profile already exists", nil
}

func (s *profileService) GetProfileByID(id uint) (model.Profile, error) {
	profile, err := s.ProfileRepository.GetProfileByID(id)
	if err != nil {
		return profile, err
	}

	profile.ImageArray = utils.MapTextToStringArray(profile.Image)
	profile.FacilityArray = utils.MapTextToStringArray(profile.Facility)
	return profile, nil
}

func (s *profileService) GetProfileByUserID(userID uint, role string) (model.Profile, string, error) {
	profile, err := s.ProfileRepository.GetProfileByUserID(userID, role)
	if err != nil {
		return profile, "", err
	}

	if profile.ID == 0 {
		return profile, "", nil
	}

	profile.ImageArray = utils.MapTextToStringArray(profile.Image)
	profile.FacilityArray = utils.MapTextToStringArray(profile.Facility)
	if profile.Email == "" {
		user, err := s.UserServiceIn.GetUserByID(userID)
		if err != nil {
			return profile, "", err
		}
		profile.Email = user.Email
	}

	// generate new token
	tokenProfile, err := auth.GenerateJwt(profile.ID, profile.Email, profile.Role)
	if err != nil {
		return profile, "", err
	}

	return profile, tokenProfile, nil
}

func (s *profileService) GetAllProfileByUserID(userID uint) ([]model.Profile, error) {
	profiles, err := s.ProfileRepository.GetAllProfileByUserID(userID)
	if err != nil {
		return profiles, err
	}

	return profiles, nil
}

func (s *profileService) UpdateProfile(id uint, profile model.Profile) error {
	if err := s.Validate.Struct(profile); err != nil {
		return err
	}

	existingProfile, err := s.ProfileRepository.GetProfileByID(id)
	if err != nil {
		return err
	}

	if existingProfile.Role != profile.Role {
		return fmt.Errorf("role mismatch: cannot update profile with role %s", profile.Role)
	}

	profile.Image = utils.MapStringArrayToText(profile.ImageArray)
	profile.Facility = utils.MapStringArrayToText(profile.FacilityArray)

	updateProfile := utils.CopyNonZeroFields(&profile, &existingProfile).(*model.Profile)
	err = s.ProfileRepository.UpdateProfile(*updateProfile)
	if err != nil {
		return err
	}
	return nil
}

func (s *profileService) SortProfileByDistance(profiles []model.Profile) []model.Profile {
	sort.SliceStable(profiles, func(i, j int) bool { return profiles[i].Distance < profiles[j].Distance })
	return profiles
}

// high to low
func (s *profileService) SortProfileByReviewRate(profiles []model.Profile) []model.Profile {
	sort.SliceStable(profiles, func(i, j int) bool { return profiles[i].AvgReview > profiles[j].AvgReview })
	return profiles
}

func (s *profileService) CountCompleteBookByID(profile_id uint) (int, error) {
	count, err := s.ProfileRepository.CountCompleteBookByID(profile_id)
	if err != nil {
		return 0, err
	}

	return count, nil
}

// care & clinic
func (s *profileService) CreateCliniCareProfile(profile model.Profile) (int, string, error) {
	err := s.Validate.Struct(profile)
	if err != nil {
		return http.StatusBadRequest, "profile detail is not correct", err
	}

	profile.Image = utils.MapStringArrayToText(profile.ImageArray)
	profile.OpenDay = utils.MapStringArrayToText(profile.OpenDayArray)

	// reservation information
	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		return http.StatusInternalServerError, "failed to load time zone", err
	}
	currentTime := time.Now().In(location)
	currentDay := time.Date(
		currentTime.Year(),
		currentTime.Month(),
		currentTime.Day(),
		0, 0, 0, 0, location,
	)

	reservations := []model.ReservationTime{}
	for i := 0; i < 30; i++ {
		date := currentDay.AddDate(0, 0, i+1)
		status := utils.CheckOpenDay(profile.OpenDayArray, date)

		fmt.Println(date.String())
		fmt.Println(status)

		morning := model.ReservationTime{
			Date:              date,
			OpenStatus:        status,
			ReservationStatus: status,
			DayParting:        "morning",
		}
		noon := morning
		noon.DayParting = "afternoon"
		reservations = append(reservations, morning, noon)
	}

	strErr, err := s.ProfileRepository.CreateCliniCareProfile(profile, reservations)
	if err != nil {
		return http.StatusInternalServerError, strErr, err
	}

	return http.StatusCreated, strErr, nil
}

func (s *profileService) GetProfileRoleClinic() ([]model.Profile, error) {
	profiles, err := s.ProfileRepository.GetProfileRoleClinic()
	if err != nil {
		return profiles, err
	}
	return profiles, nil
}
