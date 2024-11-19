package types

import "time"

type ProfileInfo struct {
	ID        uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ProfileID uint    `gorm:"not null" json:"profile_id" query:"profile_id"`
	Name      string  `gorm:"type:varchar(191);not null" json:"name" query:"name"`
	Address   string  `gorm:"type:text;not null" json:"address" query:"address"`
	Image     string  `gorm:"type:varchar(191)" json:"image" query:"image"`
	Longitude float64 `gorm:"type:float;not null" json:"longitude" query:"longitude"`
	Latitude  float64 `gorm:"type:float;not null" json:"latitude" query:"latitude"`
}

type ServiceInfo struct {
	ID            uint      `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	StartTime     time.Time `gorm:"not null" json:"start_time" query:"start_time" validate:"required"`
	EndTime       time.Time `gorm:"not null" json:"end_time" query:"end_time" validate:"required"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Status        string  `gorm:"not null;default:'pending'" json:"status" query:"status"`
	PaymentStatus string  `gorm:"not null;default:'pending'" json:"payment_status" query:"payment_status"`
	Price         float32 `gorm:"type:float;not null" json:"price" query:"price"`
	Detail        string  `gorm:"type:text" json:"detail" query:"detail"`
	PaymentID     string  `gorm:"type:string" json:"payment_id" query:"payment_id"`
	PayoutID      string  `gorm:"type:string" json:"payout_id" query:"payout_id"`

	ReviewRate   float32 `gorm:"type:float;default:0" json:"review_rate" query:"review_rate"`
	ReviewDetail string  `gorm:"type:text;" json:"review_detail" query:"review_detail"`
}

type ProductInfo struct {
	ID uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	// SellerID  uint      `gorm:"not null" json:"seller_id" query:"seller_id"`
	ProfileID uint    `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	Name      string  `gorm:"type:varchar(191);not null" json:"name" query:"name" validate:"required"`
	Detail    string  `gorm:"type:varchar(191);not null" json:"detail" query:"detail"`
	Image     string  `gorm:"type:text;" json:"image" query:"image"`
	Price     float32 `gorm:"type:float;not null" json:"price" query:"price" validate:"required"`
}

type AnimalInfo struct {
	AnimalType string `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type" validate:"required"`
	Age        int    `gorm:"type:int;not null" json:"age" query:"age" validate:"required"`
	Weight     int    `gorm:"type:int;not null" json:"weight" query:"weight" validate:"required"`
	Breed      string `gorm:"type:varchar(191);not null" json:"breed" query:"breed"`
	Gender     string `gorm:"type:varchar(191);not null" json:"gender" query:"gender"`
	HairType   string `gorm:"type:varchar(191);not null" json:"hair_type" query:"hair_type"`
}
