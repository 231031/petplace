package types

import "time"

// type ProfileInfo struct {
// 	ID        uint    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
// 	ProfileID uint    `gorm:"not null" json:"profile_id" query:"profile_id"`
// 	Name      string  `gorm:"type:varchar(191);not null" json:"name" query:"name"`
// 	Address   string  `gorm:"type:text;not null" json:"address" query:"address"`
// 	Image     string  `gorm:"type:varchar(191)" json:"image" query:"image"`
// 	Longitude float64 `gorm:"type:float;not null" json:"longitude" query:"longitude"`
// 	Latitude  float64 `gorm:"type:float;not null" json:"latitude" query:"latitude"`
// }

type ServiceInfo struct {
	ID            uint      `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	StartTime     time.Time `gorm:"not null" json:"start_time" query:"start_time"`
	EndTime       time.Time `gorm:"not null" json:"end_time" query:"end_time"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Status        string `gorm:"not null;default:'pending'" json:"status" query:"status"`
	PaymentStatus string `gorm:"not null;default:'pending'" json:"payment_status" query:"payment_status"`
	Price         int    `gorm:"type:int;not null" json:"price" query:"price"`
	Detail        string `gorm:"type:text" json:"detail" query:"detail"`
}

type ProductInfo struct {
	ID uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	// SellerID  uint      `gorm:"not null" json:"seller_id" query:"seller_id"`
	ProfileID uint   `gorm:"not null" json:"profile_id" query:"profile_id"`
	Name      string `gorm:"type:varchar(191);not null" json:"name" query:"name"`
	Detail    string `gorm:"type:varchar(191);not null" json:"detail" query:"detail"`
	Image     string `gorm:"type:varchar(191);" json:"image" query:"image"`
	Price     int    `gorm:"type:int;not null" json:"price" query:"price"`
}

type AnimalInfo struct {
	AnimalType    string         `gorm:"type:varchar(191);not null" json:"animal_type" query:"animal_type"`
	Age    int    `gorm:"type:int;not null" json:"age" query:"age"`
	Weight int    `gorm:"type:int;not null" json:"weight" query:"weight"`
	Breed  string `gorm:"type:varchar(191);not null" json:"breed" query:"breed"`
}
