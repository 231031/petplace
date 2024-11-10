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

func (r ProfileRepository) GetProfileByUserID(userID uint, role string) (model.Profile, error) {
	profile := model.Profile{}
	result := r.db.Where("user_id = ? AND role = ?", userID, role).First(&profile)
	if result.Error != nil {
		return profile, fmt.Errorf("get profile failed: %v", result.Error.Error())
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

// not test
func (r ProfileRepository) CountCompleteBookByID(profile_id uint) (int, error) {
	var count int64
	result := r.db.
		Model(&model.Profile{}).
		Where("profiles.id = ?", profile_id).
		Select("profiles.id").
		Joins("JOIN cage_rooms ON profiles.id = cage_rooms.profile_id").
		Joins("JOIN hotel_services ON cage_rooms.id = hotel_services.cage_id").
		Where("hotel_services.status = ? AND hotel_services.review_rate > ?", "completed", 0.0).
		Group("profiles.id").
		Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(count), nil
}
