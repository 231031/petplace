package service

import (
	"petplace/internal/repository"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type ClientService struct {
	AnimalUserRepository repository.AnimalUserRepositoryIn
	Validate *validator.Validate
}

func NewClientService(
		animalUserRepositoryIn repository.AnimalUserRepositoryIn, 
		validate *validator.Validate,
	) *ClientService {
	return &ClientService{
		AnimalUserRepository: animalUserRepositoryIn,
		Validate: validate,
	}
}