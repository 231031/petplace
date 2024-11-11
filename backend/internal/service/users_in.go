package service

import "petplace/internal/model"

type UsersServiceIn interface {
	SignUp(data model.Users) error
}