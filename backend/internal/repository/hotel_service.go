package repository

import (
	"gorm.io/gorm"
)

// interact with the database
type HotelServiceRepository struct {
	db *gorm.DB
}

func NewHotelServiceRepository(db *gorm.DB) *HotelServiceRepository {
	return &HotelServiceRepository{db: db}
}