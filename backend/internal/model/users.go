package model

import "petplace/internal/types"

type User struct {
	ID          uint   `gorm:"primaryKey;autoIncrement;" json:"id" param:"id" query:"id"`
	Email       string `gorm:"type:varchar(191);unique;not null" json:"email" query:"email" validate:"required"`
	PaypalEmail string `gorm:"type:varchar(191);unique;" json:"paypal_email" query:"paypal_email"`
	Password    string `gorm:"type:varchar(191);not null" json:"password" query:"password" validate:"required"`
	FirstName   string `gorm:"type:varchar(191);not null" json:"first_name" query:"first_name" validate:"required"`
	Surename    string `gorm:"type:varchar(191);not null" json:"surename" query:"surename" validate:"required"`
	Age         int    `gorm:"type:int;not null" json:"age" query:"age"`
	CitizenID   string `gorm:"type:varchar(191);not null" json:"citizen_id" query:"citizen_id"`

	// credit card
	Name         string `gorm:"type:varchar(191);" json:"name" query:"name"`
	Number       string `gorm:"type:varchar(191);" json:"number" query:"number"`
	Expiry       string `gorm:"type:varchar(191);" json:"expiry" query:"name"`
	SecurityCode string `gorm:"type:varchar(191);" json:"security_code" query:"security_code"`

	Profiles      []Profile      `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"profiles" query:"profiles" swaggerignore:"true"`
	FavoriteCages []FavoriteCage `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"user_id" query:"user_id" swaggerignore:"true"`
	Animals       []AnimalUser   `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animals" query:"animals" swaggerignore:"true"`
	Orders        []Order        `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"orders" query:"orders" swaggerignore:"true"`
}

type AnimalUser struct {
	ID     uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID uint `gorm:"not null" json:"user_id" query:"user_id" validate:"required"`
	types.AnimalInfo
	Name  string `gorm:"type:varchar(191);not null" json:"name" query:"name" validate:"required"`
	Image string `gorm:"type:text;not null" json:"image" query:"image"`

	AnimalUserVaccines  []AnimalUserVaccine  `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_ser_vaccines" query:"animal_ser_vaccines" swaggerignore:"true"`
	AnimalServices      []AnimalService      `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_services" query:"animal_services" swaggerignore:"true"`
	TransportServices   []TransportService   `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_services" query:"transport_services" swaggerignore:"true"`
	AnimalHotelServices []AnimalHotelService `gorm:"foreignKey:AnimalUserID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animal_hotel_services" query:"animal_hotel_services" swaggerignore:"true"`

	// no in database
	ImageArray []string `gorm:"-" json:"image_array" query:"image_array"`
}

type AnimalUserVaccine struct {
	ID           uint   `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	AnimalUserID uint   `gorm:"not null" json:"animal_user_id" query:"animal_user_id"`
	Image        string `gorm:"type:varchar(191);not null" json:"image" query:"image"`

	// no in database
	ImageArray []string `gorm:"-" json:"image_array" query:"image_array"`
}
