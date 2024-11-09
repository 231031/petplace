package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type UserService struct {
	UserRepositoryIn       repository.UserRepositoryIn
	AnimalUserRepositoryIn repository.AnimalUserRepositoryIn
	Validate               *validator.Validate
}

func NewUserService(
	userRepositoryIn repository.UserRepositoryIn,
	animalUserRepositoryIn repository.AnimalUserRepositoryIn,
	validate *validator.Validate,
) *UserService {
	return &UserService{
		UserRepositoryIn:       userRepositoryIn,
		AnimalUserRepositoryIn: animalUserRepositoryIn,
		Validate:               validate,
	}
}

func (s *UserService) UpdateUser(id uint, user model.User) error {
	userDb, err := s.UserRepositoryIn.GetUserByID(id)
	if err != nil {
		return err
	}

	updateUser := utils.CopyNonZeroFields(&user, &userDb).(*model.User)
	err = s.UserRepositoryIn.UpdateUser(*updateUser)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserService) GetCreditCard(id uint) (types.CardPayload, error) {
	card := types.CardPayload{}
	user, err := s.UserRepositoryIn.GetUserByID(id)
	if err != nil {
		return card, err
	}

	card.Name = user.Name
	card.Number = user.Number
	card.Expiry = user.Expiry
	card.SecurityCode = user.SecurityCode

	return card, nil
}

func (s *UserService) CreateAnimalUser(animals []model.AnimalUser) error {
	err := s.AnimalUserRepositoryIn.CreateAnimalUser(animals)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateAnimalUser(id uint, animal model.AnimalUser) error {
	animal_db, err := s.AnimalUserRepositoryIn.GetAnimalUser(id)
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
