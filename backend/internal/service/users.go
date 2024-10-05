package service

import (
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type UserService struct {
	UserRepositoryIn repository.UserRepositoryIn
	AnimalUserRepository repository.AnimalUserRepositoryIn
	Validate *validator.Validate
}

func NewUserService(
		userRepositoryIn repository.UserRepositoryIn, 
		animalUserRepositoryIn repository.AnimalUserRepositoryIn, 
		validate *validator.Validate,
	) *UserService {
	return &UserService{
		UserRepositoryIn: userRepositoryIn, 
		AnimalUserRepository: animalUserRepositoryIn,
		Validate: validate,
	}
}

func (u *UserService) SignUp(data model.User) error {
	hashed, err := auth.HashPassword(data.Password)
	if err != nil {
		return err
	}

	data.Password = hashed
	res := u.UserRepositoryIn.SignUp(data)
	if res != nil {
		return res
	}
	return nil
}

func (u *UserService) LogIn(payload types.LoginPayload) (string, error) {
	return "nil", nil
}