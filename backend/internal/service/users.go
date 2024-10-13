package service

import (
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type UserService struct {
	UserRepositoryIn repository.UserRepositoryIn
	AnimalUserRepositoryIn repository.AnimalUserRepositoryIn
	Validate *validator.Validate
}

func NewUserService(
		userRepositoryIn repository.UserRepositoryIn, 
		animalUserRepositoryIn repository.AnimalUserRepositoryIn, 
		validate *validator.Validate,
	) *UserService {
	return &UserService{
		UserRepositoryIn: userRepositoryIn, 
		AnimalUserRepositoryIn: animalUserRepositoryIn,
		Validate: validate,
	}
}

func (s *UserService) SignUp(data model.User) error {
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

func (s *UserService) LogIn(payload types.LoginPayload) (string, error) {
	return "nil", nil
}

func (s *UserService) CreateAnimalUser(animals []model.AnimalUser) error {
	err := s.AnimalUserRepositoryIn.CreateAnimalUser(animals)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateAnimalUser(id uint, animal model.AnimalUser) error {
	animal_db, err  := s.AnimalUserRepositoryIn.GetAnimalUser(id)
	if err != nil {
		return err
	}

	updateAn := utils.CopyNonZeroFields(&animal, &animal_db).(*model.AnimalUser)
	err = s.AnimalUserRepositoryIn.UpdateAnimalUser(*updateAn)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserService) GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error) {
	animals, err := s.AnimalUserRepositoryIn.GetAllAnimalUser(user_id)
	if err != nil {
		return animals, err
	}
	return animals, nil
}

func (s *UserService) GetAnimalUser(id uint) (model.AnimalUser, error) {
	animal, err := s.AnimalUserRepositoryIn.GetAnimalUser(id)
	if err != nil {
		return animal, err
	}
	return animal, nil
}