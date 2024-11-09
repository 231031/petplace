package service

import (
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type AuthService struct {
	UserRepositoryIn repository.UserRepositoryIn
	Validate         *validator.Validate
}

func NewAuthService(
	userRepositoryIn repository.UserRepositoryIn,
	validate *validator.Validate,
) *AuthService {
	return &AuthService{
		UserRepositoryIn: userRepositoryIn,
		Validate:         validate,
	}
}

func (s *AuthService) SignUp(data model.User) error {
	hashed, err := auth.HashPassword(data.Password)
	if err != nil {
		return err
	}

	data.Password = hashed
	res := s.UserRepositoryIn.SignUp(data)
	if res != nil {
		return res
	}
	return nil
}

func (s *AuthService) LogIn(payload types.LoginPayload) (string, error) {
	return "nil", nil
}
