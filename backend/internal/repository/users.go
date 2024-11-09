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

func (r *UserRepository) SignUp(data model.User) error {
	result := r.db.Create(&data)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *UserRepository) GetUserByEmail(email string) (model.User, error) {
	user := model.User{
		Email: email,
	}

	result := r.db.Where("email = ?", "jinzhu").First(&user)
	if result.Error != nil {
		return user, fmt.Errorf("%s", result.Error.Error())
	}

	return user, nil
}

func (r *UserRepository) GetUserByID(id uint) (model.User, error) {
	user := model.User{ID: id}
	result := r.db.First(&user)
	if result.Error != nil {
		return user, result.Error
	}
	return user, nil
}

func (r *UserRepository) UpdateUser(user model.User) error {
	result := r.db.Save(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
