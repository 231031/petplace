package service

import (
	"petplace/internal/model"
	"petplace/internal/types"
)

type UsersServiceIn interface {
	SignUp(data model.User) error
	LogIn(payload types.LoginPayload) (string, error)
	CreateAnimalUser(animals []model.AnimalUser) error
	UpdateAnimalUser(id uint, animal model.AnimalUser) error
	GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error)
	GetAnimalUser(id uint) (model.AnimalUser, error)
}

type ProfileServiceIn interface {
	CreateProfile(profile model.Profile) error
	GetProfileByID(id uint) (model.Profile, error)
	UpdateProfile(id uint, profile model.Profile) error
}

type BookingServiceIn interface {
	BookHotelService(payload types.BookingHotelPayload) error
	UpdateHotelService(id uint, ser model.HotelService) error
	GetBookingHotel(id uint) (model.HotelService, error)
	GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error)
	GetAllBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error)
}

type CageRoomServiceIn interface {
	CreateCageRoom(cage []model.CageRoom) error
	GetAllCageRoom(profile_id uint) ([]model.CageRoom, error)
	GetCageRoom(id uint) (model.CageRoom, error)
	DeleteCageRoom(id uint) error
	FilterCages(filter types.FilterSearchCage) ([]types.Cage, error)
	// SearchCage(animals []types.FilterInfo, filter types.FilterSearchCage) ([]model.CageRoom, error)
}