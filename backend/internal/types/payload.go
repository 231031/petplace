package types

import (
	"time"
)

type LoginPayload struct {
	Email    string `json:"email" query:"email"`
	Password string `json:"password" query:"password"`
}

type BookingHotelPayload struct {
	ServiceInfo
	CageID  uint   `json:"cage_id" query:"cage_id"`
	Animals []uint `json:"animals" query:"animals"`
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
	StartTime string `json:"start_time" param:"start_time" query:"start_time"`
	EndTime   string `json:"end_time" param:"end_time" query:"end_time"`
	Sort      string `json:"sort" param:"sort" query:"sort"`
	// Animal []FilterInfo  `json:"animals" param:"animals" query:"animals"`
}

type FilterInfo struct {
	AnimalType string `json:"animal_type" query:"animal_type" param:"animal_type"`
	CageSize   string `json:"cage_size" query:"cage_size" param:"cage_size"`
}

type Cage struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	AnimalType  string    `json:"animal_type"`
	BookingTime time.Time `json:"booking_time"`
}
