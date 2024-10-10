package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type CageService struct {
	CageRoomRepositoryIn repository.CageRoomRepositoryIn
	Validate *validator.Validate
}

func NewCageService(
		cageRoomRepositoryIn repository.CageRoomRepositoryIn, 
		validate *validator.Validate,
	) *CageService {
	return &CageService{
		CageRoomRepositoryIn: cageRoomRepositoryIn,
		Validate: validate,
	}
}

func (s *CageService) CreateCageRoom(cage model.CageRoom) error {
	err := s.CageRoomRepositoryIn.CreateCageRoom(cage)
	if err != nil {
		return err
	}
	return nil
}

func (s *CageService) GetAllCageRoom(profile_id uint) ([]model.CageRoom, error) {
	cages, err := s.CageRoomRepositoryIn.GetAllCageRoom(profile_id)
	if err != nil {
		return cages, err
	}
	return cages, nil
}

func (s *CageService) GetCageRoom(id uint) (model.CageRoom, error) {
	cage, err := s.CageRoomRepositoryIn.GetCageRoom(id)
	if err != nil {
		return cage, err
	}
	return cage, nil
}