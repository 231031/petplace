package service

import (
	"petplace/internal/model"
	"petplace/internal/types"
)

type AuthServiceIn interface {
	SignUp(data model.User) error
	LogIn(payload types.LoginPayload) (any, string, error)
}

type UsersServiceIn interface {
	GetUserByID(id uint) (model.User, error)
	UpdateUser(id uint, user model.User) error
	GetCreditCard(id uint) (types.CardPayload, error)

	CreateAnimalUser(animals []model.AnimalUser) error
	UpdateAnimalUser(id uint, animal model.AnimalUser) error
	GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error)
	GetAnimalUser(id uint) (model.AnimalUser, error)
	GetAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error)
}

type ProfileServiceIn interface {
	CreateProfile(profile model.Profile) error
	GetProfileByID(id uint) (model.Profile, error)
	GetProfileByUserID(userID uint, role string) (model.Profile, string, error)
	UpdateProfile(id uint, profile model.Profile) error

	SortProfileByReviewRate(profiles []model.Profile) []model.Profile
	SortProfileByDistance(profiles []model.Profile, la float64, long float64) []model.Profile
	CountCompleteBookByID(profile_id uint) (int, error)
}

type BookingServiceIn interface {
	BookHotelService(payload types.BookingPayload) (int, error, error)
	AcceptRejectBookHotel(payload types.SelectStatusPayload) error
	ManageRefundBookHotel(payload types.RefundPayload) error
	ReviewHotelService(payload types.ReviewPayload) (int, error, error)
	UpdateHotelService(id uint, ser model.HotelService) error

	GetAllBookingHotelByStatus(status string) ([]model.HotelService, error)
	GetBookingHotel(id uint) (model.HotelService, error)
	GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error)
	GetAllBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error)
}

type CageRoomServiceIn interface {
	CreateCageRoom(cage []model.CageRoom) error
	UpdateCageRoom(id uint, ser model.CageRoom) error
	DeleteCageRoom(id uint) error

	GetAllCageRoom(profile_id uint) ([]model.CageRoom, error)
	GetCageRoom(id uint) (model.CageRoom, error)
	SearchCage(animals []types.FilterInfo, filter types.FilterSearchCage) ([]model.Profile, error)
	SearchCageByHotel(animals []types.FilterInfo, filter types.FilterSearchCage, profile_id uint) (model.Profile, error)
	// FilterCages(filter types.FilterSearchCage) ([]types.Cage, error)
}

type PaymentServiceIn interface {
	RequestPayment(payload types.BookingPayload, bookDel types.BookingDetail) (string, error)
	CreatePayout(cost float32, paypalEmail string) (string, error)
}
