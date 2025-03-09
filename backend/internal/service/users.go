package service

import (
	"errors"
	"fmt"
	"log"
	"petplace/internal/auth"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"
	"strings"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type userService struct {
	UserRepository         repository.UserRepository
	AnimalUserRepository   repository.AnimalUserRepository
	FavoriteCageRepository repository.FavoriteCageRepository
	Validate               *validator.Validate
}

func NewUserService(
	userRepository repository.UserRepository,
	animalUserRepository repository.AnimalUserRepository,
	favoriteCageRepository repository.FavoriteCageRepository,
	validate *validator.Validate,
) UsersService {
	return &userService{
		UserRepository:         userRepository,
		AnimalUserRepository:   animalUserRepository,
		FavoriteCageRepository: favoriteCageRepository,
		Validate:               validate,
	}
}

var (
	errInvalidPayload = errors.New("invalid data")
)

func (s *userService) CreateUser(data model.User) (model.User, error) {
	err := s.Validate.Struct(data)
	if err != nil {
		return model.User{}, errInvalidPayload
	}

	user, err := s.UserRepository.CreateUser(data)
	if err != nil {
		log.Println(err)
		return user, err
	}
	return user, nil
}

func (s *userService) GetUserByEmail(email string) (model.User, error) {
	user, err := s.UserRepository.GetUserByEmail(email)
	if err != nil {
		log.Println(err)
		return user, err
	}
	return user, nil
}

func (s *userService) GetUserByID(id uint) (model.User, error) {
	user, err := s.UserRepository.GetUserByID(id)
	if err != nil {
		log.Println(err)
		return user, err
	}

	user.Password = ""
	user.Name = ""
	user.SecurityCode = ""
	user.Number = ""
	user.Expiry = ""
	return user, nil
}

func (s *userService) ChangeRoleToClient(id uint) (string, error) {
	user, err := s.GetUserByID(id)
	if err != nil {
		log.Println(err)
		return "", err
	}

	tokenUser, err := auth.GenerateJwt(user.ID, user.Email, "client")
	if err != nil {
		log.Println(err)
		return "", err
	}

	return tokenUser, nil
}

func (s *userService) UpdateUser(id uint, user model.User) error {
	userDb, err := s.UserRepository.GetUserByID(id)
	if err != nil {
		log.Println(err)
		return err
	}

	updateUser := utils.CopyNonZeroFields(&user, &userDb).(*model.User)

	err = s.UserRepository.UpdateUser(*updateUser)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (s *userService) GetCreditCard(id uint) (types.CardPayload, error) {
	card := types.CardPayload{}
	user, err := s.UserRepository.GetUserByID(id)
	if err != nil {
		log.Println(err)
		return card, err
	}

	card.Name = user.Name
	card.Number = user.Number
	card.Expiry = user.Expiry
	// card.SecurityCode = user.SecurityCode

	return card, nil
}

// Animal's User
func (s *userService) CreateAnimalUser(animals []model.AnimalUser) error {
	if len(animals) > 0 {
		for i := range animals {
			animals[i].Image = utils.MapStringArrayToText(animals[i].ImageArray)
			animals[i].AnimalType = strings.ToLower(animals[i].AnimalType)
		}
	}

	err := s.AnimalUserRepository.CreateAnimalUser(animals)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (s *userService) UpdateAnimalUser(id uint, animal model.AnimalUser) error {
	animal_db, err := s.AnimalUserRepository.GetAnimalUser(id)
	if err != nil {
		log.Println(err)
		return err
	}

	animal.Image = utils.MapStringArrayToText(animal.ImageArray)
	animal.AnimalType = strings.ToLower(animal.AnimalType)

	updateAn := utils.CopyNonZeroFields(&animal, &animal_db).(*model.AnimalUser)
	err = s.AnimalUserRepository.UpdateAnimalUser(*updateAn)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (s *userService) GetAllAnimalUser(user_id uint) ([]model.AnimalUser, error) {
	animals, err := s.AnimalUserRepository.GetAllAnimalUser(user_id)
	if err != nil {
		log.Println(err)
		return animals, err
	}

	if len(animals) > 0 {
		for i := range animals {
			animals[i].ImageArray = utils.MapTextToStringArray(animals[i].Image)
		}
	}

	return animals, nil
}

func (s *userService) GetAnimalUser(id uint) (model.AnimalUser, error) {
	animal, err := s.AnimalUserRepository.GetAnimalUser(id)
	if err != nil {
		log.Println(err)
		return animal, err
	}
	animal.ImageArray = utils.MapTextToStringArray(animal.Image)
	return animal, nil
}

func (s *userService) GetAnimalUserByType(user_id uint, animal_type string) ([]model.AnimalUser, error) {
	animal_type = strings.ToLower(animal_type)
	animals, err := s.AnimalUserRepository.GetAllAnimalUserByType(user_id, animal_type)
	if err != nil {
		log.Println(err)
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
func (s *userService) AddFavoriteCage(fav model.FavoriteCage) error {
	err := s.FavoriteCageRepository.AddFavoriteCage(fav)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (s *userService) DelFavoriteCage(user_id uint, cage_id uint) error {
	err := s.FavoriteCageRepository.DelFavoriteCage(user_id, cage_id)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (s *userService) GetFavoriteCageByUser(user_id uint, userLoc types.LocationParams) ([]model.FavoriteCage, error) {
	fav, err := s.FavoriteCageRepository.GetFavoriteCageByUser(user_id)
	if err != nil {
		log.Println(err)
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
