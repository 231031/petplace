package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/utils"
	"time"

	"github.com/go-playground/validator/v10"
)

type ReservationTimeService struct {
	ProfileServiceIn            ProfileServiceIn
	ReservationTimeRepositoryIn repository.ReservationTimeRepositoryIn
	Validate                    *validator.Validate
}

func NewReservationTimeService(
	profileServiceIn ProfileServiceIn,
	reservationTimeRepositoryIn repository.ReservationTimeRepositoryIn,
	validate *validator.Validate,
) *ReservationTimeService {
	return &ReservationTimeService{
		ProfileServiceIn:            profileServiceIn,
		ReservationTimeRepositoryIn: reservationTimeRepositoryIn,
		Validate:                    validate,
	}
}

func (s *ReservationTimeService) UpdateDailyReservationAndBook(currentDay time.Time) (string, error) {

	// strErr, err := s.ReservationTimeRepositoryIn.UpdateDailyReservation(previousDay, currentDay, reservation)
	// if err != nil {
	// 	return strErr, err
	// }

	return "successfully updated daily task", nil
}

func (s *ReservationTimeService) UpdateDailyNewDate(previousDay, newDay time.Time) (string, error) {
	profiles, err := s.ProfileServiceIn.GetProfileRoleClinic()
	if err != nil {
		return "falied to get profiles", err
	}

	reservations := []model.ReservationTime{}
	for i := range profiles {
		status := utils.CheckOpenDay(profiles[i].OpenDayArray, newDay)
		newMorning := model.ReservationTime{
			ProfileID:         profiles[i].ID,
			ReservationStatus: status,
			OpenStatus:        status,
			Date:              newDay,
			DayParting:        "morning",
		}
		newNoon := newMorning
		newNoon.DayParting = "afternoon"
		reservations = append(reservations, newMorning, newNoon)
	}

	err = s.ReservationTimeRepositoryIn.UpdateDailyNewDate(previousDay, reservations)
	if err != nil {
		return "falied to update new date daily", err
	}
	return "successfully updated new date daily task", nil
}
