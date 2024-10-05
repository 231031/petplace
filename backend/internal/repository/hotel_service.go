package repository

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/types"

	"gorm.io/gorm"
)

// interact with the database
type HotelServiceRepository struct {
	db *gorm.DB
}

func NewHotelServiceRepository(db *gorm.DB) *HotelServiceRepository {
	return &HotelServiceRepository{db: db}
}

func (r *HotelServiceRepository) CreateHotelService(ser model.HotelService) error {
	result := r.db.Create(&ser)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *HotelServiceRepository) GetHotelService(id uint) (*model.HotelService, error) {
	ser := &model.HotelService{
		ServiceInfo: types.ServiceInfo{ID: id},
	}
	result := r.db.First(&ser)
	if result.Error != nil {
		return ser, fmt.Errorf("%s", result.Error.Error())
	}
	return ser, nil
}

func (r *HotelServiceRepository) UpdateHotelService(ser model.HotelService) error {
	result := r.db.Update("HotelService", ser)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}

func (r *HotelServiceRepository) DeleteHotelService(id uint) error {
	result := r.db.Delete(&model.HotelService{}, id)
	if result.Error != nil {
		return fmt.Errorf("%s", result.Error.Error())
	}
	return nil
}