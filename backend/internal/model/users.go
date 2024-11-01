package model

import "petplace/internal/types"

type User struct {
	ID        uint         `gorm:"primaryKey;autoIncrement;" json:"id" param:"id" query:"id"`
	Email     string       `gorm:"type:varchar(191);unique;not null" json:"email" query:"email"`
	Password  string       `gorm:"type:varchar(191);not null" json:"password" query:"password"`
	Name      string       `gorm:"type:varchar(191);not null" json:"name" query:"name"`
	Surename  string       `gorm:"type:varchar(191);not null" json:"surename" query:"surename"`
	Age       int          `gorm:"type:int;not null" json:"age" query:"age"`
	CitizenID string       `gorm:"type:varchar(191);not null" json:"citizen_id" query:"citizen_id"`
	Profiles  []Profile    `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"profiles" query:"profiles"`
	Animals   []AnimalUser `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animals" query:"animals"`
	Orders    []Order      `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"orders" query:"orders"`
}

type AnimalUser struct {
	ID     uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID uint `gorm:"not null" json:"user_id" query:"user_id"`
	types.AnimalInfo
	Name                string               `gorm:"type:varchar(191);not null" json:"name" query:"name"`
	Image               string               `gorm:"type:varchar(191);not null" json:"image" query:"image"`
	AnimalUserVaccines  []AnimalUserVaccine  `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_ser_vaccines" query:"animal_ser_vaccines"`
	AnimalServices      []AnimalService      `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_services" query:"animal_services"`
	TransportServices   []TransportService   `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_services" query:"transport_services"`
	AnimalHotelServices []AnimalHotelService `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_hotel_services" query:"animal_hotel_services"`
}

type AnimalUserVaccine struct {
	ID           uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	AnimalUserID uint   `gorm:"not null" json:"animal_user_id" query:"animal_user_id"`
	Image        string `gorm:"type:varchar(191);not null" json:"image" query:"image"`
}
