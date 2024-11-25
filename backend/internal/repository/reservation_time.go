package repository

import (
	"petplace/internal/model"
	"time"

	"gorm.io/gorm"
)

// interact with the database
type ReservationTimeRepository struct {
	db *gorm.DB
}

func NewReservationTimeRepository(db *gorm.DB) *ReservationTimeRepository {
	return &ReservationTimeRepository{db: db}
}

func (r *ReservationTimeRepository) UpdateDailyReservationAndBook(previousDay, currentDate time.Time, reservations []model.ReservationTime) (string, error) {
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

func (r *ReservationTimeRepository) UpdateDailyNewDate(previousDay time.Time, reservations []model.ReservationTime) error {
	query := "UPDATE reservation_times SET reservation_status = CASE "
	var updateVal []interface{}

	for _, reservation := range reservations {
		query += " WHEN profile_id = ? THEN ? "
		updateVal = append(updateVal, reservation.ProfileID, reservation.ReservationStatus)
	}

	query += " END, open_status = CASE "

	for _, reservation := range reservations {
		query += " WHEN profile_id = ? THEN ? "
		updateVal = append(updateVal, reservation.ProfileID, reservation.OpenStatus)
	}

	query += "END, date = CASE "
	query += "WHEN date = ? THEN ? "
	updateVal = append(updateVal, previousDay, reservations[0].Date)

	query += "END WHERE profile_id IN ("

	for i, reservation := range reservations {
		query += "?"
		if i < len(reservations) {
			query += ","
		}
		updateVal = append(updateVal, reservation.ProfileID)
	}
	query += ") AND date = ? AND reservation_status = ?;"
	updateVal = append(updateVal, previousDay, "open")

	res := r.db.Exec(query, updateVal...)
	if res.Error != nil {
		return res.Error
	}

	return nil
}
