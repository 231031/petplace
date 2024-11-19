package types

import (
	"time"
)

type LoginPayload struct {
	Email    string `json:"email" query:"email" validate:"required"`
	Password string `json:"password" query:"password" validate:"required"`
}

type BookingPayload struct {
	CageID    uint   `json:"cage_id" query:"cage_id" validate:"required"`
	Animals   []uint `json:"animals" query:"animals" validate:"required"`
	StartTime string `json:"start_time" query:"start_time" validate:"required"`
	EndTime   string `json:"end_time" query:"end_time" validate:"required"`
	Detail    string `json:"detail" query:"detail"`
	// payment information
	ClientID    uint        `json:"client_id" query:"client_id" validate:"required"`
	ClientName  string      `json:"client_name" query:"client_name" validate:"required"`
	ProfileID   uint        `json:"profile_id" query:"profile_id" validate:"required"`
	ProfileName string      `json:"profile_name" query:"profile_name" validate:"required"`
	CardDetail  CardPayload `json:"card_detail" query:"card_detail" validate:"required"`
}

type SelectStatusPayload struct {
	HotelServiceID uint   `json:"hotel_service_id" query:"hotel_service_id" validate:"required"`
	ProfileID      uint   `json:"profile_id" query:"profile_id" validate:"required"`
	ProfileName    string `json:"profile_name" query:"profile_name" validate:"required"`
	Status         string `json:"status" query:"status" validate:"required"`
}

type RefundPayload struct {
	HotelServiceID uint   `json:"hotel_service_id" query:"hotel_service_id" validate:"required"`
	ClientID       uint   `json:"client_id" query:"client_id" validate:"required"`
	PaypalEmail    string `gorm:"type:varchar(191);" json:"paypal_email" query:"paypal_email" validate:"required"`
}

type PaymentSource struct {
	Card CardPayload `json:"card" query:"card"`
}

type CardPayload struct {
	Name         string `json:"name" query:"name"`
	Number       string `json:"number"`
	Expiry       string `json:"expiry"`
	SecurityCode string `json:"security_code"`
	// BillingAddress *CardBillingAddress `json:"billing_address"`
}

type ReviewPayload struct {
	HotelServiceID uint    `json:"hotel_service_id" query:"hotel_service_id" validate:"required"`
	ProfileID      uint    `json:"profile_id" query:"profile_id" validate:"required"`
	ReviewRate     float32 `json:"review_rate" query:"review_rate" validate:"required"`
	ReviewDetail   string  `json:"review_detail" query:"review_detail"`
}

type BookingDetail struct {
	TotalPrice string `json:"total_price" query:"total_price"`
	Category   string `json:"catagory" query:"catagory"`
	Day        string `json:"day" query:"day"`
}

// type FilterSearchCage struct {
// 	AnimalType string `json:"animal_type" validate:"required"`
// 	Animalsize string `json:"animal_size" validate:"required"`
// 	Location   string `json:"location" validate:"required"`
// 	StartTime  string `json:"start_time" validate:"required"`
// 	EndTime    string `json:"end_time" validate:"required"`
// }

type FilterSearchCage struct {
	Longitude string `json:"longitude" query:"longitude" param:"longitude"`
	Latitude  string `json:"latitude" query:"latitude" param:"latitude"`
	StartTime string `json:"start_time" param:"start_time" query:"start_time" validate:"required"`
	EndTime   string `json:"end_time" param:"end_time" query:"end_time" validate:"required"`
	Sort      string `json:"sort" param:"sort" query:"sort"`
	// Animal []FilterInfo  `json:"animals" param:"animals" query:"animals"`
}

type FilterInfo struct {
	AnimalType string `json:"animal_type" query:"animal_type" param:"animal_type"`
	CageSize   string `json:"cage_size" query:"cage_size" param:"cage_size"`
}

type ProfileDistance struct {
	ProfileID uint64  `json:"profile_id" query:"profile_id"`
	Distance  float64 `json:"distance" query:"distance" param:"distance"`
}

type Cage struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	AnimalType  string    `json:"animal_type"`
	BookingTime time.Time `json:"booking_time"`
}

type UpdateHotelPayload struct {
    HotelID  uint    `json:"hotel_id" validate:"required"`
    Name     string  `json:"name" validate:"omitempty,min=2"`
    Address  string  `json:"address" validate:"omitempty,min=5"`
    Price    float32 `json:"price" validate:"omitempty,gt=0"`
    Services string  `json:"services" validate:"omitempty"`
    Rating   float32 `json:"rating" validate:"omitempty,gte=0,lte=5"`
}

