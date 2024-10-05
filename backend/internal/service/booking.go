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

func (s *BookingService) BookHotelService(payload types.BookingHotelPayload) error {
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
		return fmt.Errorf("%s", err.Error())
	}

	duration := ser.EndTime.Sub(ser.StartTime)
	days := int(duration.Hours() / 24)
	price := cage.Price * days
	ser.Price = price

	err = s.HotelServiceRepositoryIn.BookHotelService(ser, animals)
	if err != nil {
		return fmt.Errorf("%s", err.Error())
	}
	return nil
}

func (s *BookingService) UpdateAcceptStatus() error {
	return nil
}

func (s *BookingService) GetBookingHotel() (*types.BookingHotelPayload, error) {
	return nil, nil
}