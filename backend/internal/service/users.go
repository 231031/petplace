package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"
<<<<<<< HEAD
	"petplace/internal/types"
	"petplace/internal/utils"
=======
>>>>>>> 4a2a754b140ef680d96b2fd477467c14e672eff4

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
<<<<<<< HEAD
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

	// newImage := ""
	// if len(animal.ImageArray) > 0 {
	// 	newImage = utils.MapStringArrayToText(animal.ImageArray)
	// }
	// animal.Image = animal.Image + "," + newImage

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
=======
type UsersService struct {
	UsersRepository repository.UsersRepositoryIn
	Validate *validator.Validate
}

func NewUsersService(userRepositoryIn repository.UsersRepositoryIn, validate *validator.Validate) *UsersService {
	return &UsersService{UsersRepository: userRepositoryIn, Validate: validate}
	// return &UsersService{UsersRepository: userRepositoryIn}
}

func (u *UsersService) SignUp(data model.Users) error {
	res := u.UsersRepository.SignUp(data)
	if res != nil {
		return res
	}
	return nil
}
>>>>>>> 4a2a754b140ef680d96b2fd477467c14e672eff4
