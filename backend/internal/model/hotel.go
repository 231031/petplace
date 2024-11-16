package model

import (
	"petplace/internal/types"
)

// type Hotel struct {
// 	types.ProfileInfo
// 	Cages     []CageRoom `gorm:"foreignKey:HotelID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"cages" query:"cages"`
// }

type CageRoom struct {
	ID          uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ProfileID   uint    `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	Quantity    int     `gorm:"type:int;not null" json:"quantity" query:"quantity" validate:"required"`
	CageType    string  `gorm:"type:varchar(191);not null" json:"cage_type" query:"cage_type" validate:"required"`
	Price       float32 `gorm:"type:float;not null" json:"price" query:"price" validate:"required"`
	Detail      string  `gorm:"type:text;" json:"detail" query:"detail"`
	Image       string  `gorm:"type:text" json:"image" query:"image"`
	Facility    string  `gorm:"type:text;" json:"facility" query:"facility"`
	AnimalType  string  `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type"`
	MaxCapacity int     `gorm:"type:int;not null" json:"max_capacity" query:"max_capacity" validate:"required"`

	// size
	Length float32 `gorm:"type:float;not null" json:"lenth" query:"lenth" validate:"required"`
	Width  float32 `gorm:"type:float;not null" json:"width" query:"width" validate:"required"`
	Height float32 `gorm:"type:float;not null" json:"height" query:"height" validate:"required"`
	Size   string  `gorm:"type:varchar(191);not null" json:"size" query:"size"`

	HotelServices []HotelService `gorm:"foreignKey:CageID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"hotel_services" query:"hotel_services" swaggerignore:"true"`
	FavoriteCages []FavoriteCage `gorm:"foreignKey:CageID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"favorite_cages" swaggerignore:"true"`
	Profile       Profile        `gorm:"foreignKey:ProfileID;references:ID" json:"profile" swaggerignore:"true"`

	// no in database
	ImageArray    []string `gorm:"-" json:"image_array" query:"image_array"`
	FacilityArray []string `gorm:"-" json:"facility_array" query:"facility_array"`
}

type HotelService struct {
	types.ServiceInfo
	CageID              uint                 `gorm:"not null" json:"cage_id" query:"cage_id"`
	AnimalHotelServices []AnimalHotelService `gorm:"foreignKey:HotelServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_hotel_services" query:"animal_hotel_services" swaggerignore:"true"`
	CageRoom            CageRoom             `gorm:"foreignKey:CageID;references:ID" json:"cage_room" swaggerignore:"true"`
}

type AnimalHotelService struct {
	AnimalUserID   uint       `gorm:"primaryKey;not null" json:"animal_user_id" query:"animal_user_id"`
	AnimalUser     AnimalUser `gorm:"foreignKey:AnimalUserID;references:ID" json:"animal_user" swaggerignore:"true"`
	HotelServiceID uint       `gorm:"primaryKey;not null" json:"hotel_service_id" query:"hotel_service_id"`
}

type FavoriteCage struct {
	UserID uint `gorm:"primaryKey;not null" json:"user_id" query:"user_id" validate:"required"`
	CageID uint `gorm:"primaryKey;not null" json:"cage_id" query:"cage_id" validate:"required"`
}
