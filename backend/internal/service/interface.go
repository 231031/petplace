package service

import (
	"petplace/internal/model"
	"petplace/internal/types"
	"time"
)

type AuthServiceIn interface {
	SignUp(data model.User) error
	LogIn(payload types.LoginPayload) (any, string, error)
	LoginGoogle(authCode string) (any, string, error)
}

type UsersServiceIn interface {
	CreateUser(data model.User) (model.User, error)
	GetUserByEmail(email string) (model.User, error)
	GetUserByID(id uint) (model.User, error)
	UpdateUser(id uint, user model.User) error
	GetCreditCard(id uint) (types.CardPayload, error)
	ChangeRoleToClient(id uint) (string, error)

	CreateAnimalUser(animals []model.AnimalUser) error
	UpdateAnimalUser(id uint, animal model.AnimalUser) error
	GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error)
	GetAnimalUser(id uint) (model.AnimalUser, error)
	GetAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error)

	AddFavoriteCage(fav model.FavoriteCage) error
	DelFavoriteCage(user_id uint, cage_id uint) error
	GetFavoriteCageByUser(user_id uint, userLoc types.LocationParams) ([]model.FavoriteCage, error)
}

type ProfileServiceIn interface {
	CreateProfile(profile model.Profile) (int, string, error)
	GetProfileByID(id uint) (model.Profile, error)
	GetProfileByUserID(userID uint, role string) (model.Profile, string, error)
	GetAllProfileByUserID(userID uint) ([]model.Profile, error)
	UpdateProfile(id uint, profile model.Profile) error

	SortProfileByReviewRate(profiles []model.Profile) []model.Profile
	SortProfileByDistance(profiles []model.Profile) []model.Profile
	CountCompleteBookByID(profile_id uint) (int, error)

	// clinic & care
	CreateCliniCareProfile(profile model.Profile) (int, string, error)
	GetProfileRoleClinic() ([]model.Profile, error) // use in daily task ticker service
}

type ReservationTimeServiceIn interface {
	UpdateDailyNewDate(previousDay, newDay time.Time) (string, error)
	UpdateDailyReservationAndBook(currentDay time.Time) (string, error)
}

type BookingServiceIn interface {
	CheckAvailableBooking(payload types.BookAgainPayload) (bool, error, error)
	BookHotelService(payload types.BookingPayload) (int, error, error)
	AcceptRejectBookHotel(payload types.SelectStatusPayload) error
	ManageRefundBookHotel(payload types.RefundPayload) error
	ReviewHotelService(payload types.ReviewPayload) (int, error, error)
	UpdateHotelService(id uint, ser model.HotelService) error

	GetAllBookingHotelByStatus(status string) ([]model.HotelService, error)
	GetBookingHotel(id uint) (model.HotelService, error)
	GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error)
	GetStatusBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error)
	GetAllHotelServiceByUser(user_id uint) ([]model.HotelService, error)
	GetReviewByHotel(profile_id uint) ([]model.HotelService, error)
}

type CageRoomServiceIn interface {
	CreateCageRoom(cage model.CageRoom) (int, string, error)
	UpdateCageRoom(id uint, ser model.CageRoom) error
	DeleteCageRoom(id uint) error

	GetAllCageRoom(profile_id uint) ([]model.CageRoom, error)
	GetCageRoom(id uint) (model.CageRoom, error)
	SearchCage(animals []types.FilterInfo, filter types.FilterSearchCage) ([]model.Profile, error)
	SearchCageByHotel(animals []types.FilterInfo, filter types.FilterSearchCage, profile_id uint, user_id uint) (model.Profile, error)

	GetAllAnimalCageType(id uint) ([]types.CageAnimalType, error)
}

type PaymentServiceIn interface {
	RequestPayment(payload types.BookingPayload, bookDel types.BookingDetail) (string, error)
	CreatePayout(cost float32, paypalEmail string) (string, error)
}
