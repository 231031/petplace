package repository

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type animalHotelServiceRepository struct {
	db *gorm.DB
}

func AnimalNewHotelServiceRepository(db *gorm.DB) AnimalHotelServiceRepository {
	return &animalHotelServiceRepository{db: db}
}

func (r *animalHotelServiceRepository) CreateAnimalHotelService(animals []model.AnimalHotelService) error {
	result := r.db.Create(&animals)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *animalHotelServiceRepository) UpdateAnimalHotelService(ser model.AnimalHotelService) error {
	result := r.db.Save(&ser)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
