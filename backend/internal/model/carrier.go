package model

import (
	"petplace/internal/types"
)

// type Carrier struct {
// 	types.ProfileInfo
// 	TransportCategorys []TransportCategory `gorm:"foreignKey:CarrierID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_categorys" query:"transport_categorys"`
// }

type TransportCategory struct {
	ID             uint            `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	// CarrierID    uint   `gorm:"not null" json:"carrier_id" query:"carrier_id"`
	ProfileID       uint           `gorm:"not null" json:"profile_id" query:"profile_id"`
	TransportType string `gorm:"not null" json:"transport_type" query:"transport_type"`
	AnimalType    string         `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type"`
	Rule string `gorm:"not null;type:text" json:"rule" query:"rule"`
	TransportServices []TransportService `gorm:"foreignKey:TransportCategoryID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_services" query:"transport_services"`
}

type TransportService struct {
	types.ServiceInfo
	TransportCategoryID uint      `gorm:"not null" json:"transport_category_id" query:"transport_category_id"`
	TransportStatus string `gorm:"not null; default:'pending'" json:"transport_status" query:"transport_status"`
}