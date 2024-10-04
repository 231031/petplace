package repository

import (
	"gorm.io/gorm"
)

// interact with the database
type ProfileRepository struct {
	db *gorm.DB
}

func NewProfileRepository(db *gorm.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}