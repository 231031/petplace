package service

import (
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type UsersService struct {
	UsersRepository repository.UserRepositoryIn
	Validate *validator.Validate
}

func NewUsersService(userRepositoryIn repository.UserRepositoryIn, validate *validator.Validate) *UsersService {
	return &UsersService{UsersRepository: userRepositoryIn, Validate: validate}
	// return &UsersService{UsersRepository: userRepositoryIn}
}

func (u *UsersService) SignUp(data model.User) error {
	hashed, err := auth.HashPassword(data.Password)
	if err != nil {
		return err
	}

	data.Password = hashed
	res := u.UsersRepository.SignUp(data)
	if res != nil {
		return res
	}
	return nil
}

func (u *UsersService) LogIn(payload types.LoginPayload) (string, error) {
	return "nil", nil
}