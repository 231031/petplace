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

func (r *AnimalUserRepository) UpdateAnimalUser(animal model.AnimalUser) error {
	result := r.db.Save(&animal)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *AnimalUserRepository) GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error) {
	animals := []model.AnimalUser{}
	result := r.db.Where("user_id = ?", user_id).Find(&animals)
	if result.Error != nil {
		return animals, result.Error
	}
	return animals, nil
}

func (r *AnimalUserRepository) GetAnimalUser(id uint) (model.AnimalUser, error) {
	animal := model.AnimalUser{ID: id}
	result := r.db.First(&animal)
	if result.Error != nil {
		return animal, result.Error
	}
	return animal, nil
}

func (r *AnimalUserRepository) GetAllAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error) {
	animals := []model.AnimalUser{}
	result := r.db.Where("user_id = ? AND animal_type = ?", user_id, animal_type).Find(&animals)
	if result.Error != nil {
		return animals, result.Error
	}
	return animals, nil
}
