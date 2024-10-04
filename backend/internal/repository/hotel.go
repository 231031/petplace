package repository

import (
	"gorm.io/gorm"
)

// interact with the database
type HotelRepository struct {
	db *gorm.DB
}

func NewHotelRepository(db *gorm.DB) *HotelRepository {
	return &HotelRepository{db: db}
}