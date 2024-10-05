package service

import (
	"petplace/internal/repository"
	"petplace/internal/types"
	"time"

	"github.com/go-playground/validator/v10"
)

type SearchCageService struct {
	cageRoomRepository repository.CageRoomRepositoryIn
	Validate           *validator.Validate
}

func NewSearchCageService(validate *validator.Validate, cageRoomRepositoryIn repository.CageRoomRepositoryIn) *SearchCageService {
	return &SearchCageService{cageRoomRepository: cageRoomRepositoryIn, Validate: validate}
}

// FilterCages - method to filter cages by animal type, location, and booking time
func (s *SearchCageService) FilterCages(filter types.FilterSearch_cage) ([]*types.Cage, error) {
	// Validate input
	if err := s.Validate.Struct(filter); err != nil {
		return nil, err
	}

	// Convert booking times to time.Time for comparison
	startTime, err := time.Parse(time.RFC3339, filter.StartTime)
	if err != nil {
		return nil, err
	}

	endTime, err := time.Parse(time.RFC3339, filter.EndTime)
	if err != nil {
		return nil, err
	}

	// Call to repository to fetch filtered results
	cages, err := s.cageRoomRepository.FilterCages(filter.AnimalType, filter.Location, startTime, endTime)
	if err != nil {
		return nil, err
	}

	return cages, nil
}
