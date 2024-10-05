package repository

import (
	"fmt"
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type CageRoomRepository struct {
	db *gorm.DB
}

func NewCageRoomRepository(db *gorm.DB) *CageRoomRepository {
	return &CageRoomRepository{db: db}
}

func (r *CageRoomRepository) CreateCageRoom(cage model.CageRoom) error {
	result := r.db.Create(&cage)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *CageRoomRepository) GetAllCageRoom() ([]model.CageRoom, error) {
	cages := []model.CageRoom{}
	result := r.db.Find(&cages)

	if result.Error != nil {
		return nil, fmt.Errorf("%s", result.Error.Error())
	}
	return cages, nil
}

func (r *CageRoomRepository) GetCageRoom(id uint) (*model.CageRoom, error) {
	cage := &model.CageRoom{ID: id}
	result := r.db.First(cage)
	if result.Error != nil {
		return nil, fmt.Errorf("%s", result.Error.Error())
	}
	return cage, nil
}

func (r *CageRoomRepository) UpdateCageRoom(cage model.CageRoom) error {
	result := r.db.Update("CageRoom", cage)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *CageRoomRepository) DeleteCageRoom(id uint) error {
	result := r.db.Delete(&model.CageRoom{}, id)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}