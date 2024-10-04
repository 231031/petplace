package repository

import (
	"gorm.io/gorm"
)

// interact with the database
type CageRoomRepository struct {
	db *gorm.DB
}

func NewCageRoomRepository(db *gorm.DB) *CageRoomRepository {
	return &CageRoomRepository{db: db}
}