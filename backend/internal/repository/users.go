package repository

import (
	"fmt"
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type UsersRepository struct {
	db *gorm.DB
}

func NewUsersRepository(db *gorm.DB) *UsersRepository {
	return &UsersRepository{db: db}
}

func (u *UsersRepository) SignUp(data model.Users) error {
	result := u.db.Create(&data)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}