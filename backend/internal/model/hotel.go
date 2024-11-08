package model

import (
	"petplace/internal/types"
)

// type Hotel struct {
// 	types.ProfileInfo
// 	Cages     []CageRoom `gorm:"foreignKey:HotelID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"cages" query:"cages"`
// }

type CageRoom struct {
	ID uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	// HotelID       uint           `gorm:"not null" json:"hotel_id" query:"hotel_id"`
	ProfileID     uint           `gorm:"not null" json:"profile_id" query:"profile_id"`
	Quantity      int            `gorm:"type:int;not null" json:"quantity" query:"quantity"`
	Price         float32        `gorm:"type:float;not null" json:"price" query:"price"`
	Size          string         `gorm:"type:varchar(191);not null" json:"size" query:"size"`
	SizeDetail    string         `gorm:"type:text;not null" json:"size_detail" query:"size_detail"`
	AnimalType    string         `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type"`
	Max           int            `gorm:"type:int;not null" json:"max" query:"max"`
	Image         string         `gorm:"type:varchar(191)" json:"image" query:"image"`
	CageType      string         `gorm:"type:varchar(191);not null" json:"cage_type" query:"cage_type"`
	Facility      string         `gorm:"type:text;" json:"facility" query:"facility"`
	HotelServices []HotelService `gorm:"foreignKey:CageID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"hotel_services" query:"hotel_services"`
}

type HotelService struct {
	types.ServiceInfo
	CageID              uint                 `gorm:"not null" json:"cage_id" query:"cage_id"`
	AnimalHotelServices []AnimalHotelService `gorm:"foreignKey:HotelServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_hotel_services" query:"animal_hotel_services"`
	CageRoom            CageRoom             `gorm:"foreignKey:CageID;references:ID" json:"cage_room"`
}

type AnimalHotelService struct {
	AnimalUserID   uint       `gorm:"primaryKey;not null" json:"animal_user_id" query:"animal_user_id"`
	AnimalUser     AnimalUser `gorm:"foreignKey:AnimalUserID;references:ID" json:"animal_user"`
	HotelServiceID uint       `gorm:"primaryKey;not null" json:"hotel_service_id" query:"hotel_service_id"`
}
