package repository

import (
	"fmt"
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type AnimalUserRepository struct {
	db *gorm.DB
}

func NewAnimalUserRepository(db *gorm.DB) *AnimalUserRepository {
	return &AnimalUserRepository{db: db}
}

func (r *AnimalUserRepository) CreateAnimalUser(animals []model.AnimalUser) error {
	result := r.db.Create(&animals)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *AnimalUserRepository) UpdateAnimalUser(ser model.AnimalUser) error {
	result := r.db.Update("AnimalUser", ser)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}