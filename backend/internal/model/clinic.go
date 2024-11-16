package model

import "petplace/internal/types"

// type Clinic struct {
// 	types.ProfileInfo
// 	ServiceClinics []ServiceClinic `gorm:"foreignKey:ClinicID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"service_clinics" query:"service_clinics"`
// }

// service which available for client in each clinic
type ServiceDetail struct {
	ID uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	// ClinicID    uint   `gorm:"not null" json:"clinic_id" query:"clinic_id"`
	ProfileID      uint            `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	ServiceType    string          `gorm:"not null" json:"service_type" query:"service_type" validate:"required"`
	AnimalType     string          `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type" validate:"required"`
	Detail         string          `gorm:"type:text;not null" json:"detail" query:"detail"`
	AnimalServices []AnimalService `gorm:"foreignKey:ServiceDetailID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_services" query:"animal_services" swaggerignore:"true"`
}

// history
type AnimalService struct {
	types.ServiceInfo
	AnimalUserID    uint `gorm:"not null" json:"animal_user_id" query:"animal_user_id"`
	ServiceDetailID uint `gorm:"not null" json:"service_detail_id" query:"service_detail_id"`
}

// ServiceClinic - ServiceDetail
// ClinicsService - AnimalService
