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
	BookHotelService(payload types.BookingHotelPayload) error
	UpdateAcceptStatus() error
	GetBookingHotel(id uint) (model.HotelService, error)
	GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error)
	GetAllBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error)
}

type CageRoomServiceIn interface {
	CreateCageRoom(cage model.CageRoom) error
	GetAllCageRoom(profile_id uint) ([]model.CageRoom, error)
	GetCageRoom(id uint) (model.CageRoom, error)
}