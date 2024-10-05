package repository

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/types"
	"time"

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

// filter by using animal_type and cage_size
// calculate longtitude and latitude of selected location compare with longitude and latitude of hotel in profiles
func (r *CageRoomRepository) FilterCages(animalType string, location string, startTime time.Time, endTime time.Time) ([]*types.Cage, error) {
	var cages []*types.Cage
	// p := model.Profile{}
	// c := model.CageRoom{}

	// Query the database to find cages matching the criteria
	result := r.db.Where("animal_type = ? AND booking_time BETWEEN ? AND ?", animalType, location, startTime, endTime).Find(&cages)
	// r.db.Joins("CageRoom", r.db.Select("").Where("profile_id = profiles.id AND "))

	if result.Error != nil {
		return nil, result.Error
	}
	return cages, nil
}

// db.Joins("Account", DB.Select("id").Where("user_id = users.id AND name = ?", "someName").Model(&Account{}))