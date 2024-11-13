package repository

import (
	"petplace/internal/model"
	"petplace/internal/types"
	"time"
)

type UserRepositoryIn interface {
	SignUp(data model.User) error
	GetUserByID(id uint) (model.User, error)
	GetUserByEmail(email string) (model.User, error)
	UpdateUser(user model.User) error
}

type ProfileRepositoryIn interface {
	CreateProfile(profile model.Profile) error
	GetProfileByID(id uint) (model.Profile, error)
	GetProfileByUserID(userID uint, role string) (model.Profile, error)
	UpdateProfile(profile model.Profile) error
	CountCompleteBookByID(profile_id uint) (int, error)
}

type AnimalUserRepositoryIn interface {
	CreateAnimalUser(animals []model.AnimalUser) error
	UpdateAnimalUser(animals model.AnimalUser) error

	GetAllAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error)
	GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error)
	GetAnimalUser(id uint) (model.AnimalUser, error)
}

type AnimalHotelServiceRepositoryIn interface {
	CreateAnimalHotelService(animals []model.AnimalHotelService) error
	UpdateAnimalHotelService(animals model.AnimalHotelService) error
}

type HotelServiceRepositoryIn interface {
	BookHotelService(ser model.HotelService, animals []model.AnimalHotelService) (uint, error)
	UpdateHotelService(ser model.HotelService) error
	DeleteHotelService(id uint) error
	ReviewHotelService(review types.ReviewPayload, avgReview float32) error

	GetAllBookingHotelByStatus(status string) ([]model.HotelService, error)
	GetAllHotelServiceByHotel(profile_id uint, status string) ([]model.HotelService, error)
	GetAllHotelServiceByUser(user_id uint, status string) ([]model.HotelService, error)
	GetHotelService(id uint) (model.HotelService, error)
}

type CageRoomRepositoryIn interface {
	CreateCageRoom(ser []model.CageRoom) error
	UpdateCageRoom(ser model.CageRoom) error
	DeleteCageRoom(id uint) error
	GetCageRoom(id uint) (model.CageRoom, error)
	GetAllCageRoom(id uint) ([]model.CageRoom, error)
	FilterCages(animals []types.FilterInfo, startTime, endTime time.Time) ([]model.Profile, error)
	FilterCagesByHotel(animals []types.FilterInfo, startTime, endTime time.Time, profile_id uint) (model.Profile, error)
	// FilterCages(animalType string, animalsize string, location string, startTime time.Time, endTime time.Time) ([]types.Cage, error)
}
