package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type UsersService struct {
	UsersRepository repository.UsersRepositoryIn
	Validate *validator.Validate
}

func NewUsersService(userRepositoryIn repository.UsersRepositoryIn, validate *validator.Validate) *UsersService {
	return &UsersService{UsersRepository: userRepositoryIn, Validate: validate}
	// return &UsersService{UsersRepository: userRepositoryIn}
}

func (u *UsersService) SignUp(data model.Users) error {
	res := u.UsersRepository.SignUp(data)
	if res != nil {
		return res
	}
	return nil
}