package model

import "time"

type Profile struct {
	ID          uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID      uint    `gorm:"not null" json:"user_id" query:"user_id"`
	Role        string  `gorm:"type:varchar(191); not null" json:"role" query:"role"`
	Payment     string  `gorm:"type:varchar(191); not null" json:"payment" query:"payment"`
	PaypalEmail string  `gorm:"type:varchar(191);" json:"paypal_email" query:"paypal_email"`
	Email       string  `gorm:"type:varchar(191);" json:"email" query:"email"`
	Tel         string  `gorm:"type:varchar(191);" json:"tel" query:"tel"`
	Name        string  `gorm:"type:varchar(191);" json:"name" query:"name"`
	Address     string  `gorm:"type:text;not null" json:"address" query:"address"`
	Image       string  `gorm:"type:varchar(191)" json:"image" query:"image"`
	Longitude   float64 `gorm:"type:float;not null" json:"longitude" query:"longitude"`
	Latitude    float64 `gorm:"type:float;not null" json:"latitude" query:"latitude"`

	// Hotel   Hotel   `gorm:"foreignKey:ProfileID"`
	Cages []CageRoom `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"cages" query:"cages"`

	// Clinic  Clinic  `gorm:"foreignKey:ProfileID"`
	ServiceDetails []ServiceDetail `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"service_details" query:"service_details"`

	// Carrier Carrier `gorm:"foreignKey:ProfileID"`
	TransportCategorys []TransportCategory `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_categorys" query:"transport_categorys"`

	// Seller
	Merchandises []Merchandise `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"merchandises" query:"merchandises"`
	Animals      []Animal      `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animals" query:"animals"`

	ChatSenders   []Chat `gorm:"foreignKey:SenderID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"sender_id" query:"sender_id"`
	ChatReceivers []Chat `gorm:"foreignKey:ReceiverID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"receiver_id" query:"receiver_id"`

	Distance float64 `gorm:"-"`
}

type Chat struct {
	ID         uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	SenderID   uint `gorm:"not null" json:"sender_id" query:"sender_id"`
	ReceiverID uint `gorm:"not null" json:"receiver_id" query:"receiver_id"`
	CreatedAt  time.Time
	Msg        string `gorm:"type:text; not null" json:"msg" query:"msg"`
}
