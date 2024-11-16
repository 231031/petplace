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
	UserRepositoryIn         repository.UserRepositoryIn
	AnimalUserRepositoryIn   repository.AnimalUserRepositoryIn
	FavoriteCageRepositoryIn repository.FavoriteCageRepositoryIn
	Validate                 *validator.Validate
}

func NewUserService(
	userRepositoryIn repository.UserRepositoryIn,
	animalUserRepositoryIn repository.AnimalUserRepositoryIn,
	favoriteCageRepositoryIn repository.FavoriteCageRepositoryIn,
	validate *validator.Validate,
) *UserService {
	return &UserService{
		UserRepositoryIn:         userRepositoryIn,
		AnimalUserRepositoryIn:   animalUserRepositoryIn,
		FavoriteCageRepositoryIn: favoriteCageRepositoryIn,
		Validate:                 validate,
	}
}

func (s *UserService) GetUserByID(id uint) (model.User, error) {
	user, err := s.UserRepositoryIn.GetUserByID(id)
	if err != nil {
		return user, err
	}

	user.Password = ""
	return user, nil
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

// Animal's User
func (s *UserService) CreateAnimalUser(animals []model.AnimalUser) error {
	if len(animals) > 0 {
		for i := range animals {
			animals[i].Image = utils.MapStringArrayToText(animals[i].ImageArray)
		}
	}

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

	if len(animal.ImageArray) > 0 {
		updateImage := utils.MapStringArrayToText(animal.ImageArray)
		animal.Image = updateImage
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

	if len(animals) > 0 {
		for i := range animals {
			animals[i].ImageArray = utils.MapTextToStringArray(animals[i].Image)
		}
	}

	return animals, nil
}

func (s *UserService) GetAnimalUser(id uint) (model.AnimalUser, error) {
	animal, err := s.AnimalUserRepositoryIn.GetAnimalUser(id)
	if err != nil {
		return animal, err
	}
	animal.ImageArray = utils.MapTextToStringArray(animal.Image)
	return animal, nil
}

func (s *UserService) GetAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error) {
	animals, err := s.AnimalUserRepositoryIn.GetAllAnimalUserByType(user_id, animal_type)
	if err != nil {
		return animals, err
	}

	if len(animals) > 0 {
		for i := range animals {
			animals[i].ImageArray = utils.MapTextToStringArray(animals[i].Image)
		}
	}
	return animals, nil
}

// Favorite Cage
func (s *UserService) AddFavoriteCage(fav model.FavoriteCage) error {
	err := s.FavoriteCageRepositoryIn.AddFavoriteCage(fav)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserService) DelFavoriteCage(user_id uint, cage_id uint) error {
	err := s.FavoriteCageRepositoryIn.DelFavoriteCage(user_id, cage_id)
	if err != nil {
		return err
	}
	return nil
}

func (s *UserService) GetFavoriteCageByUser(user_id uint) ([]model.FavoriteCage, error) {
	fav, err := s.FavoriteCageRepositoryIn.GetFavoriteCageByUser(user_id)
	if err != nil {
		return []model.FavoriteCage{}, nil
	}
	return fav, nil
}
