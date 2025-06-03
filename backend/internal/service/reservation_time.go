package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/utils"
	"time"

	"github.com/go-playground/validator/v10"
)

type reservationTimeService struct {
	ProfileService            ProfileService
	ReservationTimeRepository repository.ReservationTimeRepository
	Validate                  *validator.Validate
}

func NewReservationTimeService(
	profileService ProfileService,
	reservationTimeRepository repository.ReservationTimeRepository,
	validate *validator.Validate,
) ReservationTimeService {
	return &reservationTimeService{
		ProfileService:            profileService,
		ReservationTimeRepository: reservationTimeRepository,
		Validate:                  validate,
	}
}

func (s *reservationTimeService) UpdateDailyReservationAndBook(currentDay time.Time) (string, error) {

	// strErr, err := s.ReservationTimeRepository.UpdateDailyReservation(previousDay, currentDay, reservation)
	// if err != nil {
	// 	return strErr, err
	// }

	return "successfully updated daily task", nil
}

func (s *reservationTimeService) UpdateDailyNewDate(previousDay, newDay time.Time) (string, error) {
	profiles, err := s.ProfileService.GetProfileRoleClinic()
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

	err = s.ReservationTimeRepository.UpdateDailyNewDate(previousDay, reservations)
	if err != nil {
		return "falied to update new date daily", err
	}
	return "successfully updated new date daily task", nil
}
