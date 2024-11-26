package model

import "time"

type Profile struct {
	ID           uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID       uint    `gorm:"not null" json:"user_id" query:"user_id" validate:"required"`
	Role         string  `gorm:"type:varchar(191); not null" json:"role" query:"role" validate:"required"`
	Payment      string  `gorm:"type:varchar(191); not null" json:"payment" query:"payment"`
	PaypalEmail  string  `gorm:"type:varchar(191);" json:"paypal_email" query:"paypal_email"`
	Email        string  `gorm:"type:varchar(191);" json:"email" query:"email"`
	Tel          string  `gorm:"type:varchar(191);" json:"tel" query:"tel"`
	Name         string  `gorm:"type:varchar(191);" json:"name" query:"name" validate:"required"`
	Address      string  `gorm:"type:text;not null" json:"address" query:"address"`
	Image        string  `gorm:"type:text;" json:"image" query:"image"`
	ImageProfile string  `gorm:"type:text;" json:"image_profile" query:"image_profile"`
	Facility     string  `gorm:"type:text;" json:"facility" query:"facility"`
	Detail       string  `gorm:"type:text;" json:"detail" query:"detail"`
	Longitude    float64 `gorm:"type:float;not null" json:"longitude" query:"longitude" validate:"required"`
	Latitude     float64 `gorm:"type:float;not null" json:"latitude" query:"latitude" validate:"required"`
	CheckIn      string  `gorm:"type:varchar(191);" json:"check_in" query:"check_in" validate:"required"`
	CheckOut     string  `gorm:"type:varchar(191);" json:"check_out" query:"check_out" validate:"required"`
	OpenDay      string  `gorm:"type:text;" json:"open_day" query:"open_day"`
	AvgReview    float32 `gorm:"type:float;default:0" json:"avg_review" query:"avg_review"`

	// Hotel   Hotel   `gorm:"foreignKey:ProfileID"`
	Cages []CageRoom `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"cages" query:"cages" swaggerignore:"true"`

	// Clinic  Clinic  `gorm:"foreignKey:ProfileID"`
	ClinicServices   []ClinicService   `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"clinic_services" query:"clinic_services" swaggerignore:"true"`
	CareServices     []CareService     `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"care_services" query:"care_services" swaggerignore:"true"`
	ReservationTimes []ReservationTime `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"reservation_time" query:"reservation_time" swaggerignore:"true"`

	// Carrier Carrier `gorm:"foreignKey:ProfileID"`
	TransportCategorys []TransportCategory `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"transport_categorys" query:"transport_categorys" swaggerignore:"true"`

	// Seller
	Merchandises []Merchandise `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"merchandises" query:"merchandises" swaggerignore:"true"`
	Animals      []Animal      `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animals" query:"animals" swaggerignore:"true"`

	Chats []Chat `gorm:"foreignKey:ProfileID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"chats" query:"chats" swaggerignore:"true"`

	// no in database
	Distance      float64  `gorm:"-" swaggerignore:"true"`
	ImageArray    []string `gorm:"-" json:"image_array" query:"image_array"`
	FacilityArray []string `gorm:"-" json:"facility_array" query:"facility_array"`
	OpenDayArray  []string `gorm:"-" json:"open_day_array" query:"open_day_array"`
}

type ReservationTime struct {
	ProfileID         uint      `gorm:"not null" json:"profile_id" query:"profile_id" validate:"required"`
	Date              time.Time `gorm:"not null" json:"date" query:"date" validate:"required"`
	DayParting        string    `gorm:"varchar(191);not null" json:"day_parting" query:"day_parting"`                  // morning, afternoon
	ReservationStatus string    `gorm:"not null;default:'close'" json:"reservation_status" query:"reservation_status"` // open close
	OpenStatus        string    `gorm:"not null;default:'close'" json:"open_status" query:"open_status"`               // open close
}

type Chat struct {
	ID        uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID    uint `gorm:"not null" json:"user_id" query:"user_id"`
	ProfileID uint `gorm:"not null" json:"profile_id" query:"profile_id"`
	CreatedAt time.Time
	Msg       string `gorm:"type:text; not null" json:"msg" query:"msg"`
}
