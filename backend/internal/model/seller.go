package model

import (
	"petplace/internal/types"
	"time"
)

// type Seller struct {
// 	types.ProfileInfo
// 	Merchandises []Merchandise `gorm:"foreignKey:SellerID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"merchandises" query:"merchandises"`
// 	Animals []Animal `gorm:"foreignKey:SellerID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"animals" query:"animals"`
// }

type Merchandise struct {
	types.ProductInfo
	Quantity int `gorm:"type:int;not null" json:"quantity" query:"quantity"`
	ProductMerchadises []ProductMerchadise `gorm:"foreignKey:MerchandiseID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"product_merchandises" query:"product_merchandises"`
}
type Animal struct {
	types.ProductInfo
	types.AnimalInfo
	ProductAnimals []ProductAnimal `gorm:"foreignKey:AnimalID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"product_animals" query:"product_animals"`
}

type Order struct {
	ID     uint `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	UserID uint `gorm:"not null" json:"user_id" query:"user_id"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	PaymentStatus string   `gorm:"not null;default:'pending'" json:"payment_status" query:"payment_status"`
	TransportStatus string `gorm:"not null; default:'pending'" json:"transport_status" query:"transport_status"`
	Price         int            `gorm:"type:int;not null" json:"price" query:"price"`
	ProductMerchadises []ProductMerchadise `gorm:"foreignKey:OrderID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"product_merchandises" query:"product_merchandises"`
	ProductAnimals []ProductAnimal `gorm:"foreignKey:OrderID;references:ID;constraint:OnUpdate:CASCADE;not null" json:"product_animals" query:"product_animals"`
}

type ProductMerchadise struct {
	OrderID uint `gorm:"primaryKey; not null" json:"order_id" query:"order_id"`
	MerchandiseID uint `gorm:"primaryKey; not null" json:"merchandise_id" query:"merchandise_id"`
	Quantity int `gorm:"type:int;not null" json:"quantity" query:"quantity"`
}

type ProductAnimal struct {
	OrderID uint `gorm:"primaryKey; not null" json:"order_id" query:"order_id"`
	AnimalID uint `gorm:"primaryKey; not null" json:"animal_id" query:"animal_id"`
}