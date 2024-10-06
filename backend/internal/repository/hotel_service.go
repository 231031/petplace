package repository

import (
	"fmt"
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type HotelServiceRepository struct {
	db *gorm.DB
}

func NewHotelServiceRepository(db *gorm.DB) *HotelServiceRepository {
	return &HotelServiceRepository{db: db}
}

func (r *HotelServiceRepository) BookHotelService(ser model.HotelService, animals []model.AnimalHotelService) error {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
		  tx.Rollback()
		}
	}()

	err := tx.Create(&ser)
	if err.Error != nil {
		tx.Rollback()
		return fmt.Errorf("%s", err.Error.Error())
	}

	for i := range animals {
		animals[i].HotelServiceID = ser.ID
	}

	if err := tx.Create(&animals).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to create AnimalHotelService records: %s", err.Error())
	}

	return tx.Commit().Error

}

func (r *HotelServiceRepository) GetAllHotelService(profile_id uint, status string) (*[]model.HotelService, error) {
	ser := &[]model.HotelService{}
	result := r.db.
				Joins("JOIN cage_rooms ON cage_rooms.id = hotel_services.cage_id").
				Joins("JOIN profiles ON profiles.id = cage_rooms.profile_id").
				Where("profiles.id = ? AND hotel_services.status = ?", profile_id, status).
				Find(ser)
	if result.Error != nil {
		return nil, fmt.Errorf("%s", result.Error.Error())
	}
	return ser, nil
}

func (r *HotelServiceRepository) GetHotelService(id uint) (*model.HotelService, error) {
	ser := &model.HotelService{}
	result := r.db.First(ser, id)
	if result.Error != nil {
		return nil, fmt.Errorf("%s", result.Error.Error())
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