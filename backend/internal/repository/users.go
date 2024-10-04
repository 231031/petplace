package repository

import (
	"fmt"
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (u *UserRepository) SignUp(data model.User) error {
	result := u.db.Create(&data)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (u *UserRepository) GetUserByEmail(email string) (*model.User, error) {
	user := &model.User{
		Email: email,
	}

	result := u.db.Where("email = ?", "jinzhu").First(&user)
	if result.Error != nil {
		return nil, fmt.Errorf("%s", result.Error.Error())
	}
	
	return user, nil
}