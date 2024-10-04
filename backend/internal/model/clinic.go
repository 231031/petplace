package model

import "petplace/internal/types"

// type Clinic struct {
// 	types.ProfileInfo
// 	ServiceClinics []ServiceClinic `gorm:"foreignKey:ClinicID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"service_clinics" query:"service_clinics"`
// }

// service which available for client in each clinic
type ServiceClinic struct {
	ID          uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	// ClinicID    uint   `gorm:"not null" json:"clinic_id" query:"clinic_id"`
	ProfileID       uint           `gorm:"not null" json:"profile_id" query:"profile_id"`
	ServiceType string `gorm:"not null" json:"service_type" query:"service_type"`
	AnimalType    string         `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type"`
	Detail      string `gorm:"type:text;not null" json:"detail" query:"detail"`
	ClinicServices []ClinicService `gorm:"foreignKey:ServiceClinicID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"clinic_services" query:"clinic_services"`
}

// history
type ClinicService struct {
	types.ServiceInfo
	ServiceClinicID uint      `gorm:"not null" json:"service_clinic_id" query:"service_clinic_id"`
}