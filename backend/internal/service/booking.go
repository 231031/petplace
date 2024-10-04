package service

import (
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type BookingService struct {
	UsersRepository repository.UserRepositoryIn
	Validate *validator.Validate
}

func NewBookingService(userRepositoryIn repository.UserRepositoryIn, validate *validator.Validate) *UsersService {
	return &UsersService{UsersRepository: userRepositoryIn, Validate: validate}
	// return &UsersService{UsersRepository: userRepositoryIn}
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