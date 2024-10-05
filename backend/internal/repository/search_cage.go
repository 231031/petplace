package repository

import (
	"petplace/internal/types"
	"time"

	"gorm.io/gorm"
)

// UserRepositoryIn interface
type Search_RepositoryIn interface {
	FilterCages(animalType string, location string, startTime time.Time, endTime time.Time) ([]*types.Cage, error)
}

// UserRepository implementation
type Search_Repository struct {
	db *gorm.DB
}

// Implementing FilterCages in UserRepository
func (u *UserRepository) FilterCages(animalType string, location string, startTime time.Time, endTime time.Time) ([]*types.Cage, error) {
	var cages []*types.Cage
	// Query the database to find cages matching the criteria
	result := u.db.Where("animal_type = ? AND location = ? AND booking_time BETWEEN ? AND ?", animalType, location, startTime, endTime).Find(&cages)
	if result.Error != nil {
		return nil, result.Error
	}
	return cages, nil
}
