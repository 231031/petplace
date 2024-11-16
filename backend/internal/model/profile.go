package model

import "time"

type Profile struct {
	ID          uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID      uint    `gorm:"not null" json:"user_id" query:"user_id" validate:"required"`
	Role        string  `gorm:"type:varchar(191); not null" json:"role" query:"role" validate:"required"`
	Payment     string  `gorm:"type:varchar(191); not null" json:"payment" query:"payment"`
	PaypalEmail string  `gorm:"type:varchar(191);" json:"paypal_email" query:"paypal_email"`
	Email       string  `gorm:"type:varchar(191);" json:"email" query:"email"`
	Tel         string  `gorm:"type:varchar(191);" json:"tel" query:"tel"`
	Name        string  `gorm:"type:varchar(191);" json:"name" query:"name" validate:"required"`
	Address     string  `gorm:"type:text;not null" json:"address" query:"address"`
	Image       string  `gorm:"type:text;" json:"image" query:"image"`
	Facility    string  `gorm:"type:text;" json:"facility" query:"facility"`
	Longitude   float64 `gorm:"type:float;not null" json:"longitude" query:"longitude" validate:"required"`
	Latitude    float64 `gorm:"type:float;not null" json:"latitude" query:"latitude" validate:"required"`
	CheckIn     string  `gorm:"type:varchar(191);" json:"check_in" query:"check_in" validate:"required"`
	CheckOut    string  `gorm:"type:varchar(191);" json:"check_out" query:"check_out" validate:"required"`
	AvgReview   float32 `gorm:"type:float;default:0" json:"avg_review" query:"avg_review"`

	// Hotel   Hotel   `gorm:"foreignKey:ProfileID"`
	Cages []CageRoom `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"cages" query:"cages" swaggerignore:"true"`

	// Clinic  Clinic  `gorm:"foreignKey:ProfileID"`
	ServiceDetails []ServiceDetail `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"service_details" query:"service_details" swaggerignore:"true"`

	// Carrier Carrier `gorm:"foreignKey:ProfileID"`
	TransportCategorys []TransportCategory `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_categorys" query:"transport_categorys" swaggerignore:"true"`

	// Seller
	Merchandises []Merchandise `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"merchandises" query:"merchandises" swaggerignore:"true"`
	Animals      []Animal      `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animals" query:"animals" swaggerignore:"true"`

	ChatSenders   []Chat `gorm:"foreignKey:SenderID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"sender_id" query:"sender_id" swaggerignore:"true"`
	ChatReceivers []Chat `gorm:"foreignKey:ReceiverID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"receiver_id" query:"receiver_id" swaggerignore:"true"`

	// no in database
	Distance      float64  `gorm:"-" swaggerignore:"true"`
	ImageArray    []string `gorm:"-" json:"image_array" query:"image_array"`
	FacilityArray []string `gorm:"-" json:"facility_array" query:"facility_array"`
}

type Chat struct {
	ID         uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	SenderID   uint `gorm:"not null" json:"sender_id" query:"sender_id"`
	ReceiverID uint `gorm:"not null" json:"receiver_id" query:"receiver_id"`
	CreatedAt  time.Time
	Msg        string `gorm:"type:text; not null" json:"msg" query:"msg"`
}
