package service

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/repository"

	"github.com/go-playground/validator/v10"
)

type ProfileService struct {
	ProfileRepository repository.ProfileRepositoryIn
	Validate          validator.Validate
}

func NewProfileService(
	profileRepository repository.ProfileRepositoryIn,
	validate validator.Validate,
) *ProfileService {
	return &ProfileService{
		ProfileRepository: profileRepository,
		Validate:          validate,
	}
}

func (s ProfileService) CreateProfile(profile model.Profile) error {
	err := s.Validate.Struct(profile)
	if err != nil {
		return err
	}
	err = s.ProfileRepository.CreateProfile(profile)
	if err != nil {
		return err
	}

	return nil
}

func (s ProfileService) GetProfileByID(id uint) (model.Profile, error) {

	profile, err := s.ProfileRepository.GetProfileByID(id)
	if err != nil {
		return profile, err
	}

	return profile, nil
}

func (s ProfileService) UpdateProfile(id uint, profile model.Profile) error {
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

	return s.ProfileRepository.UpdateProfile(profile)
}