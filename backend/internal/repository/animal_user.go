package repository

import (
	"gorm.io/gorm"
)

// interact with the database
type AnimalUserRepository struct {
	db *gorm.DB
}

func NewAnimalUserRepository(db *gorm.DB) *AnimalUserRepository {
	return &AnimalUserRepository{db: db}
}