package service

import (
	"petplace/internal/repository"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type SearchService struct {
	UserRepository repository.UserRepositoryIn
	Validate *validator.Validate
}

func NewSearchService(
	validate *validator.Validate,
	userRepositoryIn repository.UserRepositoryIn,
	// other repository interface
	) *SearchService {
	return &SearchService{UserRepository: userRepositoryIn, Validate: validate}
	// return &SearchService{UserRepository: userRepositoryIn}
}