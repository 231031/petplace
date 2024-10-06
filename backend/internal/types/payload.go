package types

import "time"

type LoginPayload struct {
	Email    string `json:"email" query:"email"`
	Password string `json:"password" query:"password"`
}

type BookingHotelPayload struct {
	ServiceInfo
	CageID  uint   `json:"cage_id" query:"cage_id"`
	Animals []uint `json:"animals" query:"animals"`
}

type FilterSearch_cage struct {
	AnimalType string `json:"animal_type" validate:"required"`
	Animalsize string `json:"animal_size" validate:"required"`
	Location   string `json:"location" validate:"required"`
	StartTime  string `json:"start_time" validate:"required"`
	EndTime    string `json:"end_time" validate:"required"`
}

type Cage struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	AnimalType  string    `json:"animal_type"`
	BookingTime time.Time `json:"booking_time"`
}
