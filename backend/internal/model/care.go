package model

import "petplace/internal/types"

type CareService struct {
	types.PriceServiceInfo
	CareType string `gorm:"not null" json:"care_type" query:"care_type" validate:"required"`
}

type ExtraService struct {
	types.PriceServiceInfo
	ExtraType string `gorm:"not null" json:"extra_type" query:"extra_type" validate:"required"`

	// reference key
	AnimalExtraServices []AnimalExtraService `gorm:"foreignKey:ExtraServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_extra_services" query:"animal_extra_services" swaggerignore:"true"`
}
