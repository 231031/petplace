package repository

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(data model.User) (model.User, error) {
	result := r.db.Create(&data)
	if result.Error != nil {
		return data, result.Error
	}
	return data, nil
}

func (r *userRepository) GetUserByEmail(email string) (model.User, error) {
	user := model.User{
		Email: email,
	}

	result := r.db.Preload("Profiles").Where("email = ?", email).First(&user)
	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

func (r *userRepository) GetUserByID(id uint) (model.User, error) {
	user := model.User{ID: id}
	result := r.db.First(&user)
	if result.Error != nil {
		return user, result.Error
	}
	return user, nil
}

func (r *userRepository) UpdateUser(user model.User) error {
	result := r.db.Model(&model.User{}).Where("id = ?", user.ID).Updates(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *userRepository) Close() error {
	conn, err := r.db.DB()
	if err != nil {
		return err
	}

	conn.Close()
	return nil
}
