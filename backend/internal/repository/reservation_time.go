package repository

import (
	"gorm.io/gorm"
)

// interact with the database
type ReservationTimeRepository struct {
	db *gorm.DB
}

func NewReservationTimeRepository(db *gorm.DB) *ReservationTimeRepository {
	return &ReservationTimeRepository{db: db}
}

func (repo *ReservationTimeRepository) UpdateDailyReservation() error {
	return nil
}
