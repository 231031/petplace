package repository

import (
	"fmt"
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type ProfileRepository struct {
	db *gorm.DB
}

func NewProfileRepository(db *gorm.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (r ProfileRepository) CreateProfile(profile model.Profile) error {
	result := r.db.Create(&profile)
	if result.Error != nil {
		return fmt.Errorf("error creating profile: %s", result.Error.Error())
	}
	return nil
}

func (r ProfileRepository) GetProfileByID(id uint) (model.Profile, error) {
	profile := model.Profile{}
	result := r.db.Preload("Cages").
		// Preload("ServiceClinics").
		// Preload("TransportCategorys").
		// Preload("Merchandises").
		// Preload("Animals").
		// Preload("ChatSenders").
		// Preload("ChatReceivers").
		First(&profile, id)
	if result.Error != nil {
		return profile, fmt.Errorf("error finding profile with id %d: %s", id, result.Error.Error())
	}
	return profile, nil
}

func (r ProfileRepository) UpdateProfile(profile model.Profile) error {
	result := r.db.Save(&profile)
	if result.Error != nil {
		return fmt.Errorf("error updating profile: %s", result.Error.Error())
	}
	return nil
}
