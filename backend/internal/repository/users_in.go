package repository

import "petplace/internal/model"

type UsersRepositoryIn interface {
	SignUp(data model.Users) error
}