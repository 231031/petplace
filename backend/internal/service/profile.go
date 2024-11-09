package service

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/repository"
	"sort"

	"github.com/go-playground/validator/v10"
	"github.com/umahmood/haversine"
)

type ProfileService struct {
	ProfileRepositoryIn repository.ProfileRepositoryIn
	Validate            *validator.Validate
}

func NewProfileService(
	profileRepository repository.ProfileRepositoryIn,
	validate *validator.Validate,
) *ProfileService {
	return &ProfileService{
		ProfileRepositoryIn: profileRepository,
		Validate:            validate,
	}
}

func (s *ProfileService) CreateProfile(profile model.Profile) error {
	err := s.Validate.Struct(profile)
	if err != nil {
		return err
	}
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

	// generate new token
	return profile, "", nil
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

	return s.ProfileRepositoryIn.UpdateProfile(profile)
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
