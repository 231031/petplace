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

func (s *AuthService) LogIn(payload types.LoginPayload) (any, string, error) {
	user, err := s.UserRepositoryIn.GetUserByEmail(payload.Email)
	if err != nil {
		return model.User{}, "", err
	}

	if user.Email == "" {
		return model.User{}, "", nil
	}

	matched := auth.ComparePassword(payload.Password, user.Password)
	if !matched {
		return model.User{}, "", nil
	}

	userToken, err := auth.GenerateJwt(user.ID, user.Email, "client")
	if err != nil {
		return model.User{}, "", err
	}

	// profiles, current role = client
	returnUser := map[string]interface{}{
		"id":        user.ID,
		"email":     user.Email,
		"firstname": user.FirstName,
		"surename":  user.Surename,
		"profile":   user.Profiles,
	}
	return returnUser, userToken, nil
}
