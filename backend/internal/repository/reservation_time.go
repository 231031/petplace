package repository

import (
	"fmt"
	"petplace/internal/model"
	"time"

	"gorm.io/gorm"
)

// interact with the database
type reservationTimeRepository struct {
	db *gorm.DB
}

func NewReservationTimeRepository(db *gorm.DB) ReservationTimeRepository {
	return &reservationTimeRepository{db: db}
}

func (r *reservationTimeRepository) UpdateDailyReservationAndBook(previousDay, currentDate time.Time, reservations []model.ReservationTime) (string, error) {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	//
	if tx.Commit().Error != nil {
		return "falied to update daily task", tx.Commit().Error
	}

	return "successfully updated daily task", nil
}

func (r *reservationTimeRepository) UpdateDailyNewDate(previousDay time.Time, reservations []model.ReservationTime) error {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	res := tx.Delete(&model.ReservationTime{}, "date = ?", previousDay)
	if res.Error != nil {
		tx.Rollback()
		fmt.Println("failed to create clinic & care profile")
		return res.Error
	}

	res = tx.Create(&reservations)
	if res.Error != nil {
		tx.Rollback()
		fmt.Println("failed to create clinic & care profile")
		return res.Error
	}
	return nil
}
