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

type HotelServiceRepositoryIn interface {
	CreateHotelService(ser model.HotelService) error
	UpdateHotelService(ser model.HotelService) error
	DeleteHotelService(id uint) error
	GetHotelService(id uint) (*model.HotelService, error)
}

type CageRoomRepositoryIn interface {
	CreateCageRoom(ser model.CageRoom) error
	UpdateCageRoom(ser model.CageRoom) error
	DeleteCageRoom(id uint) error
	GetCageRoom(id uint) (*model.CageRoom, error)
	GetAllCageRoom() ([]model.CageRoom, error)
}