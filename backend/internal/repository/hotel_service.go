package repository

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/types"
	"time"

	"gorm.io/gorm"
)

// interact with the database
type hotelServiceRepository struct {
	db *gorm.DB
}

func NewHotelServiceRepository(db *gorm.DB) HotelServiceRepository {
	return &hotelServiceRepository{db: db}
}

func (r *hotelServiceRepository) BookHotelService(ser model.HotelService, animals []model.AnimalHotelService) (uint, error) {
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

func (r *hotelServiceRepository) ReviewHotelService(review types.ReviewPayload, avgReview float32) error {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	profile := model.Profile{
		ID: review.ProfileID,
	}
	result := tx.Model(&profile).Update("avg_review", avgReview)
	if result.Error != nil {
		tx.Rollback()
		return result.Error
	}

	// udpate review hotel service
	ser := model.HotelService{
		ServiceInfo: types.ServiceInfo{
			ID: review.HotelServiceID,
		},
	}

	result = tx.Model(&ser).Updates(model.HotelService{ServiceInfo: types.ServiceInfo{
		ReviewRate:   review.ReviewRate,
		ReviewDetail: review.ReviewDetail,
		ReviewImage:  review.ReviewImage,
		HideName:     review.HideName,
	}})
	if result.Error != nil {
		tx.Rollback()
		return result.Error
	}

	if tx.Commit().Error != nil {
		return tx.Commit().Error
	}
	return nil
}

func (r *hotelServiceRepository) GetAllHotelServiceByHotel(profile_id uint, status string) ([]model.HotelService, error) {
	ser := []model.HotelService{}
	result := r.db.Preload("AnimalHotelServices.AnimalUser.User", func(db *gorm.DB) *gorm.DB {
		return db.Select("users.id", "FirstName", "Surename", "tel")
	}).
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

func (r *hotelServiceRepository) GetStatusBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error) {
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

func (r *hotelServiceRepository) GetAllHotelServiceByUser(user_id uint) ([]model.HotelService, error) {
	ser := []model.HotelService{}
	result := r.db.Preload("AnimalHotelServices.AnimalUser.User", func(db *gorm.DB) *gorm.DB {
		return db.Select("users.id", "FirstName", "Surename", "tel")
	}).
		Preload("CageRoom").
		Where("animal_users.user_id = ?", user_id).
		Joins("JOIN animal_hotel_services ON animal_hotel_services.hotel_service_id = hotel_services.id").
		Joins("JOIN animal_users ON animal_hotel_services.animal_user_id = animal_users.id").
		Group("hotel_services.id").
		Find(&ser)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

func (r *hotelServiceRepository) GetReviewByHotel(profile_id uint) ([]model.HotelService, error) {
	ser := []model.HotelService{}

	result := r.db.Preload("AnimalHotelServices.AnimalUser.User", func(db *gorm.DB) *gorm.DB {
		return db.Select("users.id", "FirstName", "Surename", "tel")
	}).
		Preload("CageRoom").
		Where("profile_id = ? AND hotel_services.status = ? AND review_rate > ?", profile_id, "completed", 0).
		Joins("JOIN cage_rooms ON cage_rooms.id = hotel_services.cage_id").
		Joins("JOIN profiles ON profiles.id = cage_rooms.profile_id").
		Select("hotel_services.id", "ReviewDetail", "ReviewRate", "CageID", "ReviewImage", "HideName").
		Find(&ser)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

func (r *hotelServiceRepository) GetHotelService(id uint) (model.HotelService, error) {
	ser := model.HotelService{}
	result := r.db.Preload("AnimalHotelServices.AnimalUser.User", func(db *gorm.DB) *gorm.DB {
		return db.Select("users.id", "FirstName", "Surename", "tel")
	}).Preload("CageRoom.Profile", func(db *gorm.DB) *gorm.DB {
		return db.Select("profiles.id", "name")
	}).First(&ser, id)
	if result.Error != nil {
		return ser, result.Error
	}
	return ser, nil
}

// task
func (r *hotelServiceRepository) GetAllBookingHotelByStatus(status string) ([]model.HotelService, error) {
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

func (r *hotelServiceRepository) UpdateHotelService(ser model.HotelService) error {
	result := r.db.Model(&model.HotelService{}).Where("id = ?", ser.ID).Updates(ser)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *hotelServiceRepository) DeleteHotelService(id uint) error {
	result := r.db.Delete(&model.HotelService{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// func (r *hotelServiceRepository) UpdateHotelProfile(profile model.Profile) error {
// 	result := r.db.Save(&profile)
// 	if result.Error != nil {
// 		return result.Error
// 	}
// 	return nil
// }

func (r *hotelServiceRepository) CheckNotAvailableBooking(cage_id uint, startTime, endTime time.Time) (model.HotelService, error) {
	service := model.HotelService{}

	query_service := r.db.Model(&service)
	result := query_service.
		Select("hotel_services.cage_id, cage_rooms.quantity").
		Joins("JOIN cage_rooms ON cage_rooms.id = hotel_services.cage_id").
		Where("cage_rooms.id = ?", cage_id).
		Where("((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?)) AND status IN (?, ?)", startTime, startTime, endTime, endTime, "accepted", "pending").
		Group("hotel_services.cage_id").
		Having("COUNT(start_time) >= cage_rooms.quantity").
		First(&service)

	if result.Error != nil {
		return service, result.Error
	}

	return service, nil
}

// func (r *hotelServiceRepository) UpdateHotel(hotel model.Hotel) error {
// 	db := r.db.Model(&model.Hotel{}).Where("id = ?", hotel.ID)
// 	if err := db.Updates(hotel).Error; err != nil {
// 		return err
// 	}
// 	return nil
// }
