package service

import (
	"fmt"
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/utils"
	"sort"

	"github.com/go-playground/validator/v10"
	"github.com/umahmood/haversine"
)

type ProfileService struct {
	ProfileRepositoryIn repository.ProfileRepositoryIn
	UserServiceIn       UsersServiceIn
	Validate            *validator.Validate
}

func NewProfileService(
	profileRepository repository.ProfileRepositoryIn,
	userService UsersServiceIn,
	validate *validator.Validate,
) *ProfileService {
	return &ProfileService{
		ProfileRepositoryIn: profileRepository,
		UserServiceIn:       userService,
		Validate:            validate,
	}
}

func (s *ProfileService) CreateProfile(profile model.Profile) error {
	err := s.Validate.Struct(profile)
	if err != nil {
		return err
	}

	profile.Image = utils.MapStringArrayToText(profile.ImageArray)
	profile.Facility = utils.MapStringArrayToText(profile.FacilityArray)
	err = s.ProfileRepositoryIn.CreateProfile(profile)
	if err != nil {
		return err
	}

	return nil
}

func (s *ProfileService) GetProfileByID(id uint) (model.Profile, error) {
	profile, err := s.ProfileRepositoryIn.GetProfileByID(id)
	if err != nil {
		return profile, err
	}

	profile.ImageArray = utils.MapTextToStringArray(profile.Image)
	profile.FacilityArray = utils.MapTextToStringArray(profile.Facility)
	return profile, nil
}

func (s *ProfileService) GetProfileByUserID(userID uint, role string) (model.Profile, string, error) {
	profile, err := s.ProfileRepositoryIn.GetProfileByUserID(userID, role)
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

func (s *ProfileService) UpdateProfile(id uint, profile model.Profile) error {
	if err := s.Validate.Struct(profile); err != nil {
		return err
	}

	existingProfile, err := s.ProfileRepositoryIn.GetProfileByID(id)
	if err != nil {
		return err
	}

	if existingProfile.Role != profile.Role {
		return fmt.Errorf("role mismatch: cannot update profile with role %s", profile.Role)
	}

	updateProfile := utils.CopyNonZeroFields(&profile, &existingProfile).(*model.Profile)
	err = s.ProfileRepositoryIn.UpdateProfile(*updateProfile)
	if err != nil {
		return err
	}
	return nil
}

func (s *ProfileService) SortProfileByDistance(profiles []model.Profile, la float64, long float64) []model.Profile {
	userLoc := haversine.Coord{Lat: la, Lon: long}

	for i := range profiles {
		profileLoc := haversine.Coord{Lat: profiles[i].Latitude, Lon: profiles[i].Longitude}
		_, km := haversine.Distance(profileLoc, userLoc)
		profiles[i].Distance = km
	}

	sort.SliceStable(profiles, func(i, j int) bool { return profiles[i].Distance < profiles[j].Distance })
	return profiles
}
