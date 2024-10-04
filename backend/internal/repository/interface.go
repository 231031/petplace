package repository

import (
	"petplace/internal/model"
)

type UserRepositoryIn interface {
	SignUp(data model.User) error
	GetUserByEmail(email string) (*model.User, error)
}

type AnimalUserRepositoryIn interface {}
type ProfileRepositoryIn interface {}
type HotelRepositoryIn interface {}
type HotelServiceRepositoryIn interface {}
type CageRoomRepositoryIn interface {}