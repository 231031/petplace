package service

import (
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/types"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type AuthService struct {
	UsersServiceIn UsersServiceIn
	Validate       *validator.Validate
}

func NewAuthService(
	usersServiceIn UsersServiceIn,
	validate *validator.Validate,
) *AuthService {
	return &AuthService{
		UsersServiceIn: usersServiceIn,
		Validate:       validate,
	}
}

func (s *AuthService) SignUp(user model.User) error {
	hashed, err := auth.HashPassword(user.Password)
	if err != nil {
		return err
	}

	user.Password = hashed
	res := s.UsersServiceIn.CreateUser(user)
	if res != nil {
		return res
	}
	return nil
}

func (s *AuthService) LogIn(payload types.LoginPayload) (any, string, error) {
	user, err := s.UsersServiceIn.GetUserByEmail(payload.Email)
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
		"id":            user.ID,
		"email":         user.Email,
		"firstname":     user.FirstName,
		"surename":      user.Surename,
		"profile":       user.Profiles,
		"image_profile": user.ImageProfile,
	}
	return returnUser, userToken, nil
}
