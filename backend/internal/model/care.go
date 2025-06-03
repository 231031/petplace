package model

import "petplace/internal/types"

type CareService struct {
	ID          uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ProfileID   uint   `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	ServiceName string `gorm:"not null" json:"service_name" query:"service_name" validate:"required"`
	Detail      string `gorm:"type:text;not null" json:"detail" query:"detail"`

	// reference key
	CareServicePrices []CareServicePrice `gorm:"foreignKey:CareServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"care_services" query:"care_services" swaggerignore:"true"`
	CareExtraServices []CareExtraService `gorm:"foreignKey:CareServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"care_extra_services" query:"care_extra_services" swaggerignore:"true"`
}

type CareServicePrice struct {
	ID            uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	CareServiceID uint `gorm:"not null" json:"care_service_id" query:"care_service_id" validate:"required"`
	types.PriceServiceInfo

	// reference key
	AnimalBookServices []AnimalBookService `gorm:"foreignKey:CareServicePriceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_book_services" query:"animal_book_services" swaggerignore:"true"`
}

type CareExtraService struct {
	ID            uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	CareServiceID uint    `gorm:"not null" json:"care_service_id" query:"care_service_id" validate:"required"`
	ExtraName     string  `gorm:"not null" json:"extra_name" query:"extra_name" validate:"required"`
	Price         float32 `gorm:"type:float;not null" json:"price" query:"price" validate:"required"`

	// reference key
	AnimalBookExtras []AnimalBookExtra `gorm:"foreignKey:CareExtraServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"care_extra_service_id" query:"care_extra_service_id" swaggerignore:"true"`
}
