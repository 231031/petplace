package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"time"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type CageRoomService struct {
	CageRoomRepositoryIn repository.CageRoomRepositoryIn
	Validate             *validator.Validate
}

func NewCageRoomService(
	cageRoomRepositoryIn repository.CageRoomRepositoryIn,
	validate *validator.Validate,
) *CageRoomService {
	return &CageRoomService{
		CageRoomRepositoryIn: cageRoomRepositoryIn,
		Validate:             validate,
	}
}

func (s *CageRoomService) CreateCageRoom(cages []model.CageRoom) error {
	err := s.CageRoomRepositoryIn.CreateCageRoom(cages)
	if err != nil {
		return err
	}
	return nil
}

func (s *CageRoomService) GetAllCageRoom(profile_id uint) ([]model.CageRoom, error) {
	cages, err := s.CageRoomRepositoryIn.GetAllCageRoom(profile_id)
	if err != nil {
		return cages, err
	}
	return cages, nil
}

func (s *CageRoomService) GetCageRoom(id uint) (model.CageRoom, error) {
	cage, err := s.CageRoomRepositoryIn.GetCageRoom(id)
	if err != nil {
		return cage, err
	}
	return cage, nil
}

func (s *CageRoomService) DeleteCageRoom(id uint) error {
	err := s.CageRoomRepositoryIn.DeleteCageRoom(id)
	if err != nil {
		return err
	}
	return nil
}

// s = instance of SearchCageService
// FilterCages - method to filter cages by animal type, location, and booking time
// func (s *CageRoomService) FilterCages(filter types.FilterSearchCage) ([]types.Cage, error) {
// 	//filter cages by FilterSearch_cage

// 	//if not valid return error
// 	if err := s.Validate.Struct(filter); err != nil {
// 		return nil, err
// 	}

// 	// Convert booking times to time.Time for comparison
// 	startTime, err := time.Parse(time.RFC3339, filter.StartTime)
// 	if err != nil {
// 		return nil, err
// 	}

// 	endTime, err := time.Parse(time.RFC3339, filter.EndTime)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Call to repository to fetch filtered results ใช้ดึงข้อมูล
// 	cages, err := s.CageRoomRepositoryIn.FilterCages(filter.AnimalType, filter.Animalsize, filter.Location, startTime, endTime)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return cages, nil
// }

func (s *CageRoomService) SearchCage(animals []types.FilterInfo, filter types.FilterSearchCage) ([]model.Profile, error) {
	// long, err := strconv.ParseFloat(filter.Longitude, 64)
	// if err != nil {
	// 	return nil, err
	// }

	// la, err := strconv.ParseFloat(filter.Latitude, 64)
	// if err != nil {
	// 	return nil, err
	// }

	if err := s.Validate.Struct(filter); err != nil {
		return nil, err
	}

	startTime, err := time.Parse(time.RFC3339, filter.StartTime)
	if err != nil {
		return nil, err
	}

	endTime, err := time.Parse(time.RFC3339, filter.EndTime)
	if err != nil {
		return nil, err
	}

	profiles, err := s.CageRoomRepositoryIn.FilterCages(animals, startTime, endTime)
	if err != nil {
		return profiles, err
	}

	// check sort by
	// calculate about location

	return profiles, nil
}
