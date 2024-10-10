package service

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/copier"
)

// implement bussiness logic
type BookingService struct {
	HotelServiceRepositoryIn repository.HotelServiceRepositoryIn
	CageRoomRepositoryIn repository.CageRoomRepositoryIn
	Validate *validator.Validate
}

func NewBookingService(
		hotelSerRepositoryIn repository.HotelServiceRepositoryIn,
		cageRoomRepositoryIn repository.CageRoomRepositoryIn,  
		validate *validator.Validate,
	) *BookingService {

	return &BookingService{
		HotelServiceRepositoryIn: hotelSerRepositoryIn, 
		CageRoomRepositoryIn: cageRoomRepositoryIn,
		Validate: validate,
	}
}

// role : Hotel
func (s *BookingService) BookHotelService(payload types.BookingHotelPayload) error {
	if len(payload.Animals) == 0 {
		return fmt.Errorf("no animals provided in booking payload")
	}

	ser := model.HotelService{}
	if err := copier.Copy(&ser, &payload); err != nil {
		return fmt.Errorf("failed to copy booking payload to hotel service: %v", err)
	}
	
	animals := make([]model.AnimalHotelService, len(payload.Animals))
	for i, animalID := range payload.Animals {
		animals[i] = model.AnimalHotelService{
			AnimalUserID:  animalID,
			HotelServiceID: 0,
		}
	}

	// calculate price of this service
	cage, err := s.CageRoomRepositoryIn.GetCageRoom(ser.CageID)
	if err != nil {
		return err
	}
	if ser.EndTime.Before(ser.StartTime) {
		return fmt.Errorf("end time must be after start time")
	}
	
	duration := ser.EndTime.Sub(ser.StartTime)
	days := int(duration.Hours() / 24)
	price := cage.Price * days
	ser.Price = price

	err = s.HotelServiceRepositoryIn.BookHotelService(ser, animals)
	if err != nil {
		return err
	}
	return nil
}

func (s *BookingService) UpdateAcceptStatus() error {
	return nil
}

// role : hotel
func (s *BookingService) GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetAllHotelServiceByHotel(profile_id, status)
	if err != nil {
		return ser, err
	}

	return ser, nil
}

func (s *BookingService) GetBookingHotel(id uint) (model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetHotelService(id)
	if err != nil {
		return ser, err
	}

	return ser, nil
}

// role : client
func (s *BookingService) GetAllBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetAllHotelServiceByUser(user_id, status)
	if err != nil {
		return ser, err
	}

	return ser, nil
}