package repository

import (
	"fmt"
	"testing"
	"time"

	"petplace/internal/model"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func TestUpdateDailyNewDate(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	// Mock the 'SELECT VERSION()' query issued by GORM
	mock.ExpectQuery("SELECT VERSION()").WillReturnRows(sqlmock.NewRows([]string{"VERSION()"}).AddRow("test-version"))

	// Create a GORM DB instance from the mock
	gormDB, err := gorm.Open(mysql.New(mysql.Config{
		Conn: db,
	}), &gorm.Config{})
	require.NoError(t, err)

	// Create an instance of the repository
	repo := NewReservationTimeRepository(gormDB)

	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("failed to load time zone")
		return
	}
	currentTime := time.Now().In(location)
	// currentDay := time.Date(
	// 	currentTime.Year(),
	// 	currentTime.Month(),
	// 	currentTime.Day(),
	// 	0, 0, 0, 0, location,
	// )
	previousDay := time.Date(
		currentTime.Year(),
		currentTime.Month(),
		(currentTime.Day())-1,
		0, 0, 0, 0, location,
	)
	newDay := previousDay.AddDate(0, 0, 30)
	reservations := []model.ReservationTime{
		{ProfileID: 1, ReservationStatus: "open", OpenStatus: "open", Date: previousDay},
		{ProfileID: 2, ReservationStatus: "close", OpenStatus: "close", Date: previousDay},
	}

	// Prepare the expected SQL query and its arguments
	query := `
		UPDATE reservation_times SET reservation_status = CASE
			WHEN profile_id = ? THEN ?
			WHEN profile_id = ? THEN ?
		END, open_status = CASE
			WHEN profile_id = ? THEN ?
			WHEN profile_id = ? THEN ?
		END, date = CASE
			WHEN date = ? THEN ?
		END WHERE profile_id IN (?, ?) AND date = ? AND reservation_status = ?;`

	mock.ExpectExec(query).
		WithArgs(
			reservations[0].ProfileID, reservations[0].ReservationStatus,
			reservations[1].ProfileID, reservations[1].ReservationStatus,
			reservations[0].ProfileID, reservations[0].OpenStatus,
			reservations[1].ProfileID, reservations[1].OpenStatus,
			previousDay, newDay,
			reservations[0].ProfileID, reservations[1].ProfileID,
			previousDay, "open",
		).
		WillReturnResult(sqlmock.NewResult(1, 1))

	// Call the function
	err = repo.UpdateDailyNewDate(previousDay, reservations)

	// Assert no error occurred
	assert.NoError(t, err)

	// Ensure all expectations were met
	require.NoError(t, mock.ExpectationsWereMet())
}
