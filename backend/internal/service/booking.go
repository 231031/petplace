package service

import (
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type BookingService struct {
	HotelServiceRepository repository.HotelServiceRepositoryIn
	CageRoomRepository repository.CageRoomRepositoryIn
	Validate *validator.Validate
}

func NewBookingService(
		hotelSerRepositoryIn repository.HotelServiceRepositoryIn, 
		cageRoomRepositoryIn repository.CageRoomRepositoryIn,
		validate *validator.Validate,
	) *BookingService {

	return &BookingService{
		HotelServiceRepository: hotelSerRepositoryIn, 
		CageRoomRepository: cageRoomRepositoryIn,
		Validate: validate,
	}
}

func (b *BookingService) BookHotelService() error {
	return nil
}

func (b *BookingService) UpdateAcceptStatus() error {
	return nil
}

func (b *BookingService) GetBookingHotel() (*types.BookingHotelPayload, error) {
	return nil, nil
}