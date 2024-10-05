package service

import (
	"petplace/internal/model"
	"petplace/internal/types"
)

type UsersServiceIn interface {
	SignUp(data model.User) error
	LogIn(payload types.LoginPayload) (string, error)
}

type BookingServiceIn interface {
	BookHotelService() error
	UpdateAcceptStatus() error
	GetBookingHotel() (*types.BookingHotelPayload, error)
}