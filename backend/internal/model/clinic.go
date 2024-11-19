package model

import (
	"petplace/internal/types"
	"time"
)

// ServiceClinic - ServiceDetail
// ClinicsService - AnimalService

// service which available for client in each clinic
type ServiceDetail struct {
	ID          uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	ProfileID   uint   `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	ServiceType string `gorm:"not null" json:"service_type" query:"service_type" validate:"required"`
	Detail      string `gorm:"type:text;not null" json:"detail" query:"detail"`

	// reference keys
	CareServices        []CareService        `gorm:"foreignKey:ServiceDetailID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"care_services" query:"care_services" swaggerignore:"true"`
	VaccineServices     []VaccineService     `gorm:"foreignKey:ServiceDetailID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"vaccince_services" query:"vaccince_services" swaggerignore:"true"`
	NeuteringServices   []NeuteringService   `gorm:"foreignKey:ServiceDetailID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"neutering_services" query:"neutering_services" swaggerignore:"true"`
	HealthCheckServices []HealthCheckService `gorm:"foreignKey:ServiceDetailID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"health_check_services" query:"health_check_services" swaggerignore:"true"`

	// AnimalType     string          `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type" validate:"required"` manual delete
	// AnimalServices []AnimalService `gorm:"foreignKey:ServiceDetailID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_services" query:"animal_services" swaggerignore:"true"`
}

type VaccineService struct {
	types.PriceServiceInfo
	Vaccince string `gorm:"not null" json:"service_type" query:"service_type" validate:"required"`
}

type NeuteringService struct {
	types.PriceServiceInfo
	Neutering string `gorm:"not null" json:"neutering" query:"neutering" validate:"required"`
}

type HealthCheckService struct {
	types.PriceServiceInfo
}

// reservation service history
type AnimalService struct {
	types.ServiceInfo
	AnimalUserID    uint      `gorm:"not null" json:"animal_user_id" query:"animal_user_id"`
	SelectedDate    time.Time `gorm:"not null" json:"selected_date" query:"selected_date" validate:"required"`
	AppointmentDate time.Time `gorm:"" json:"appointment_date" query:"appointment_date"`
	DayParting      time.Time `gorm:"varchar(191);not null" json:"day_parting" query:"day_parting"` // morning, afternoon

	// reference key
	AnimalExtraServices []AnimalExtraService `gorm:"foreignKey:AnimalServiceID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_extra_services" query:"animal_extra_services" swaggerignore:"true"`

	// foreign key from releated service

	// delete
	// ServiceDetailID uint `gorm:"not null" json:"service_detail_id" query:"service_detail_id"` munual delete
}

type AnimalExtraService struct {
	AnimalServiceID uint `gorm:"not null" json:"animal_service_id" query:"animal_service_id"`
	ExtraServiceID  uint `gorm:"not null" json:"extra_service_id" query:"extra_service_id"`
}
