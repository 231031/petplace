package repository

import (
	"petplace/internal/model"
	"petplace/internal/types"
	"time"
)

type UserRepository interface {
	CreateUser(data model.User) (model.User, error)
	GetUserByID(id uint) (model.User, error)
	GetUserByEmail(email string) (model.User, error)
	UpdateUser(user model.User) error
}

type ProfileRepository interface {
	CreateProfile(profile model.Profile) (int, string, error)
	GetProfileByID(id uint) (model.Profile, error)
	GetProfileByUserID(userID uint, role string) (model.Profile, error)
	GetAllProfileByUserID(userID uint) ([]model.Profile, error)
	UpdateProfile(profile model.Profile) error
	CountCompleteBookByID(profile_id uint) (int, error)

	// care & clinic
	CreateCliniCareProfile(profile model.Profile, reservations []model.ReservationTime) (string, error)
	GetProfileRoleClinic() ([]model.Profile, error) // use in daily task
}

type ReservationTimeRepository interface {
	UpdateDailyReservationAndBook(previousDay, currentDate time.Time, reservations []model.ReservationTime) (string, error)
	UpdateDailyNewDate(previousDay time.Time, reservations []model.ReservationTime) error
}

type FavoriteCageRepository interface {
	AddFavoriteCage(fav model.FavoriteCage) error
	DelFavoriteCage(user_id uint, cage_id uint) error
	GetFavoriteCageByUser(user_id uint) ([]model.FavoriteCage, error)
}

type AnimalUserRepository interface {
	CreateAnimalUser(animals []model.AnimalUser) error
	UpdateAnimalUser(animals model.AnimalUser) error

	GetAllAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error)
	GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error)
	GetAnimalUser(id uint) (model.AnimalUser, error)
}

type AnimalHotelServiceRepository interface {
	CreateAnimalHotelService(animals []model.AnimalHotelService) error
	UpdateAnimalHotelService(animals model.AnimalHotelService) error
}

type HotelServiceRepository interface {
	CheckNotAvailableBooking(cage_id uint, startTime, endTime time.Time) (model.HotelService, error)
	BookHotelService(ser model.HotelService, animals []model.AnimalHotelService) (uint, error)
	UpdateHotelService(ser model.HotelService) error
	DeleteHotelService(id uint) error
	ReviewHotelService(review types.ReviewPayload, avgReview float32) error

	GetAllBookingHotelByStatus(status string) ([]model.HotelService, error)
	GetAllHotelServiceByHotel(profile_id uint, status string) ([]model.HotelService, error)
	GetStatusBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error)
	GetAllHotelServiceByUser(user_id uint) ([]model.HotelService, error)
	GetHotelService(id uint) (model.HotelService, error)
	GetReviewByHotel(profile_id uint) ([]model.HotelService, error)
}

type CageRoomRepository interface {
	CreateCageRoom(cage model.CageRoom) error
	UpdateCageRoom(cage model.CageRoom) error
	DeleteCageRoom(id uint) error
	GetCageRoom(id uint) (model.CageRoom, error)
	GetAllCageRoom(id uint) ([]model.CageRoom, error)
	FilterCages(animals []types.FilterInfo, startTime, endTime time.Time) ([]model.Profile, error)
	FilterCagesByHotel(animals []types.FilterInfo, startTime, endTime time.Time, profile_id uint, user_id uint) (model.Profile, error)

	GetSpecificCageRoomType(id uint, animal_type string, cage_type string) (model.CageRoom, error)
}
