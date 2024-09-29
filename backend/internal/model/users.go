package model

type Users struct {
	ID       int    `gorm:"primaryKey; autoIncrement" json:"id" param:"id" query:"id"`
	Email    string `gorm:"type:varchar(191); unique; not null" json:"email" query:"email"`
	Password string `gorm:"not null" json:"password" query:"password"`
	// Role     string `gorm:"type:int;default:2;not null"`
}
