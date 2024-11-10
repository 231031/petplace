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

func (r *HotelServiceRepository) BookHotelService(ser model.HotelService, animals []model.AnimalHotelService) (uint, error) {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	res := tx.Create(&ser)
	if res.Error != nil {
		tx.Rollback()
		return 0, fmt.Errorf("%s", res.Error.Error())
	}

	for i := range animals {
		animals[i].HotelServiceID = ser.ID
	}

	if err := tx.Create(&animals).Error; err != nil {
		tx.Rollback()
		return 0, fmt.Errorf("failed to create AnimalHotelService records: %s", err.Error())
	}

	if tx.Commit().Error != nil {
		return 0, tx.Commit().Error
	}

	return ser.ID, nil

}

func (r *HotelServiceRepository) ReviewHotelService(review types.ReviewPayload, avgReview float32) error {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// udpate review hotel service
	// if err := tx.Save(&ser).Error; err != nil {
	// 	tx.Rollback()
	// 	return err
	// }

	// update avg review of profile
	// if err := tx.Save(&profile).Error; err != nil {
	// 	tx.Rollback()
	// 	return err
	// }

	if tx.Commit().Error != nil {
		return tx.Commit().Error
	}
	return nil
}

func (r *HotelServiceRepository) GetAllHotelServiceByHotel(profile_id uint, status string) ([]model.HotelService, error) {
	ser := []model.HotelService{}
	result := r.db.
		Preload("CageRoom").
		Where("profiles.id = ? AND hotel_services.status = ?", profile_id, status).
		Joins("JOIN cage_rooms ON cage_rooms.id = hotel_services.cage_id").
		Joins("JOIN profiles ON profiles.id = cage_rooms.profile_id").
		Find(&ser)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

func (r *HotelServiceRepository) GetAllHotelServiceByUser(user_id uint, status string) ([]model.HotelService, error) {
	ser := []model.HotelService{}
	result := r.db.
		Preload("AnimalHotelServices.AnimalUser").
		Preload("CageRoom").
		Where("animal_users.user_id = ? AND hotel_services.status = ?", user_id, status).
		Joins("JOIN animal_hotel_services ON animal_hotel_services.hotel_service_id = hotel_services.id").
		Joins("JOIN animal_users ON animal_hotel_services.animal_user_id = animal_users.id").
		Group("hotel_services.id").
		Find(&ser)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

func (r *HotelServiceRepository) GetHotelService(id uint) (model.HotelService, error) {
	ser := model.HotelService{}
	result := r.db.First(&ser, id)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

func (r *HotelServiceRepository) GetAllBookingHotelByStatus(status string) ([]model.HotelService, error) {
	ser := []model.HotelService{}
	result := r.db.
		Preload("CageRoom.Profile").
		Where("hotel_services.status = ?", status).
		Joins("JOIN cage_rooms ON cage_rooms.id = hotel_services.cage_id").
		Joins("JOIN profiles ON profiles.id = cage_rooms.profile_id").
		Find(&ser)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

func (r *HotelServiceRepository) UpdateHotelService(ser model.HotelService) error {
	result := r.db.Save(&ser)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *HotelServiceRepository) DeleteHotelService(id uint) error {
	result := r.db.Delete(&model.HotelService{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
