package model

import (
	"petplace/internal/types"
	"time"
)

// service which available for client in each clinic
type ClinicService struct {
	ID          uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ProfileID   uint   `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	ServiceName string `gorm:"not null" json:"service_name" query:"service_name" validate:"required"`
	Detail      string `gorm:"type:text;not null" json:"detail" query:"detail"`

	// reference keys
	ClinicSubServices []ClinicSubService `gorm:"foreignKey:ClinicServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"clinic_sub_services" query:"clinic_sub_services" swaggerignore:"true"`
}

type ClinicSubService struct {
	ID              uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ClinicServiceID uint   `gorm:"not null" json:"clinic_service_id" query:"clinic_service_id" validate:"required"`
	SubType         string `gorm:"not null" json:"sub_type" query:"sub_type" validate:"required"`
	Detail          string `gorm:"type:text;not null" json:"detail" query:"detail"`

	// reference keys
	ClinicSubPrices []ClinicSubPrice `gorm:"foreignKey:ClinicSubServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"clinic_sub_prices" query:"clinic_sub_prices" swaggerignore:"true"`
}

type ClinicSubPrice struct {
	ID                 uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ClinicSubServiceID uint `gorm:"not null" json:"clinic_sub_service_id" query:"clinic_sub_service_id" validate:"required"`
	types.PriceServiceInfo

	// reference keys
	AnimalBookClinics []AnimalBookClinic `gorm:"foreignKey:ClinicSubPriceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_book_clinics" query:"animal_book_clinics" swaggerignore:"true"`
}

// reservation service history
type AnimalBookService struct {
	ID                 uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	AnimalUserID       uint `gorm:"not null" json:"animal_user_id" query:"animal_user_id"`
	CareServicePriceID uint `gorm:"not null" json:"care_service_price_id" query:"care_service_price_id"`

	CreatedAt       time.Time
	UpdatedAt       time.Time
	Status          string    `gorm:"not null;default:'pending'" json:"status" query:"status"`
	SelectedDate    time.Time `gorm:"not null" json:"selected_date" query:"selected_date" validate:"required"`
	AppointmentDate time.Time `gorm:"" json:"appointment_date" query:"appointment_date"`
	DayParting      time.Time `gorm:"varchar(191);not null" json:"day_parting" query:"day_parting" validate:"required"` // morning, afternoon
	TotalPrice      float32   `gorm:"type:float;not null" json:"total_price" query:"total_price"`
	Detail          string    `gorm:"type:text" json:"detail" query:"detail"`
	types.ReviewInfo

	// reference key
	AnimalBookExtras  []AnimalBookExtra  `gorm:"foreignKey:AnimalBookServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_book_extras" query:"animal_book_extras" swaggerignore:"true"`
	AnimalBookClinics []AnimalBookClinic `gorm:"foreignKey:AnimalBookServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_book_clinics" query:"animal_book_clinics" swaggerignore:"true"`
}

type AnimalBookClinic struct {
	AnimalBookServiceID uint `gorm:"not null" json:"animal_book_service_id" query:"animal_book_service_id"`
	ClinicSubPriceID    uint `gorm:"not null" json:"clinic_sub_price_id" query:"clinic_sub_price_id"`
}

type AnimalBookExtra struct {
	AnimalBookServiceID uint `gorm:"not null" json:"animal_book_service_id" query:"animal_book_service_id"`
	CareExtraServiceID  uint `gorm:"not null" json:"care_extra_service_id" query:"care_extra_service_id"`
}
