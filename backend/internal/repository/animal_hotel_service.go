package repository

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type AnimalHotelServiceRepository struct {
	db *gorm.DB
}

func AnimalNewHotelServiceRepository(db *gorm.DB) *AnimalHotelServiceRepository {
	return &AnimalHotelServiceRepository{db: db}
}

func (r *AnimalHotelServiceRepository) CreateAnimalHotelService(animals []model.AnimalHotelService) error {
	result := r.db.Create(&animals)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *AnimalHotelServiceRepository) UpdateAnimalHotelService(ser model.AnimalHotelService) error {
	result := r.db.Save(&ser)
	if result.Error != nil {
		return result.Error
	}
	return nil
}