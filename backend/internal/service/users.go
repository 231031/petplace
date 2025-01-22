package service

import (
	"fmt"
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"
	"strings"

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

func (s *UserService) CreateUser(data model.User) (model.User, error) {
	user, err := s.UserRepositoryIn.CreateUser(data)
	if err != nil {
		return user, err
	}
	return user, nil
}

func (s *UserService) GetUserByEmail(email string) (model.User, error) {
	user, err := s.UserRepositoryIn.GetUserByEmail(email)
	if err != nil {
		return user, err
	}
	return user, nil
}

func (s *UserService) GetUserByID(id uint) (model.User, error) {
	user, err := s.UserRepositoryIn.GetUserByID(id)
	if err != nil {
		return user, err
	}

	user.Password = ""
	user.Name = ""
	user.SecurityCode = ""
	user.Number = ""
	user.Expiry = ""
	return user, nil
}

func (s *UserService) ChangeRoleToClient(id uint) (string, error) {
	user, err := s.GetUserByID(id)
	if err != nil {
		return "", err
	}

	tokenUser, err := auth.GenerateJwt(user.ID, user.Email, "client")
	if err != nil {
		return "", err
	}

	return tokenUser, nil
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
	// card.SecurityCode = user.SecurityCode

	return card, nil
}

// Animal's User
func (s *UserService) CreateAnimalUser(animals []model.AnimalUser) error {
	if len(animals) > 0 {
		for i := range animals {
			animals[i].Image = utils.MapStringArrayToText(animals[i].ImageArray)
			animals[i].AnimalType = strings.ToLower(animals[i].AnimalType)
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

	animal.Image = utils.MapStringArrayToText(animal.ImageArray)
	animal.AnimalType = strings.ToLower(animal.AnimalType)

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
	animal_type = strings.ToLower(animal_type)
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

func (s *UserService) GetFavoriteCageByUser(user_id uint, userLoc types.LocationParams) ([]model.FavoriteCage, error) {
	fav, err := s.FavoriteCageRepositoryIn.GetFavoriteCageByUser(user_id)
	if err != nil {
		return []model.FavoriteCage{}, nil
	}
	fmt.Println(userLoc)
	if len(fav) > 0 {
		for i := range fav {
			fav[i].CageRoom.ImageArray = utils.MapTextToStringArray(fav[i].CageRoom.Image)
			fav[i].CageRoom.FacilityArray = utils.MapTextToStringArray(fav[i].CageRoom.Facility)

			fav[i].CageRoom.Profile.ImageArray = utils.MapTextToStringArray(fav[i].CageRoom.Profile.Image)
			fav[i].CageRoom.Profile.FacilityArray = utils.MapTextToStringArray(fav[i].CageRoom.Profile.Facility)

			km, err := utils.CalculateDistance(userLoc, fav[i].CageRoom.Profile.Latitude, fav[i].CageRoom.Profile.Longitude)
			if err != nil {
				return fav, err
			}
			fav[i].CageRoom.Profile.Distance = km
		}
	}

	return fav, nil
}
