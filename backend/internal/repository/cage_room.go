package repository

import (
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

func (r *CageRoomRepository) CreateCageRoom(cage []model.CageRoom) error {
	result := r.db.Create(&cage)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *CageRoomRepository) GetAllCageRoom(id uint) ([]model.CageRoom, error) {
	cages := []model.CageRoom{}
	result := r.db.Where("profile_id = ?", id).Find(&cages)
	if result.Error != nil {
		return cages, result.Error
	}
	return cages, nil
}

func (r *CageRoomRepository) GetCageRoom(id uint) (model.CageRoom, error) {
	cage := model.CageRoom{ID: id}
	result := r.db.First(&cage)
	if result.Error != nil {
		return cage, result.Error
	}
	return cage, nil
}

func (r *CageRoomRepository) UpdateCageRoom(cage model.CageRoom) error {
	result := r.db.Save(&cage)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *CageRoomRepository) DeleteCageRoom(id uint) error {
	result := r.db.Delete(&model.CageRoom{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// filter by using animal_type and cage_size
// calculate longtitude and latitude of selected location compare with longitude and latitude of hotel in profiles

func (r *CageRoomRepository) FilterCages(animalType, animalSize, location string, startTime, endTime time.Time) ([]types.Cage, error) {
	var cages []types.Cage
	query := r.db.Model(&types.Cage{})

	// Combine animalType and animalSize check
	if animalType != "" && animalSize != "" {
		query = query.Where("animal_type = ? AND animal_size = ?", animalType, animalSize)
	}

	// Check for location if needed
	if location != "" {
		query = query.Where("location = ?", location)
	}

	// Check the booking time range
	query = query.Where("booking_time BETWEEN ? AND ?", startTime, endTime)

	// Execute the query
	result := query.Find(&cages)

	if result.Error != nil {
		return nil, result.Error
	}
	return cages, nil
}

// func (r *CageRoomRepository) FilterCages(animals []types.FilterInfo, startTime , endTime time.Time) ([]model.CageRoom, error) {
// 	cages := []model.CageRoom{}
// 	// cages_id := []uint{}
// 	query := r.db.Model(&cages)

// 	// all in cage_rooms not have in hotel_services filter by animal_type and size
// 	// otherwise check booking time with quantity before
// 	// if booking time overlaps each other count and check with quantity of each cage

// 	query = query.Select("cage_rooms.id, cage_rooms.quantity")
// 	if len(animals) > 0 {
// 		for i, animal := range animals {
// 			if i == 0 {
// 				query = query.Where("animal_type = ? AND size = ?", animal.AnimalType, animal.CageSize)
// 			} else {
// 				query = query.Or("animal_type = ? AND size = ?", animal.AnimalType, animal.CageSize)
// 			}
// 		}
// 	}

// 	result := query.Joins("JOIN hotel_services ON cage_rooms.id = hotel_services.cage_id").
// 				Where("(start_time <= ? AND end_time >= ?) OR (start_time <= ? AND end_time >= ?)", startTime, startTime, endTime, endTime).
// 				Group("cage_rooms.id").
// 				Having("COUNT(start_time) < cage_rooms.quantity").
// 				Find(&cages)
// 	if result.Error != nil {
// 		return cages, result.Error
// 	}
// 	// fmt.Println(cages_id)

// 	// cages, err := r.GetAllCageRoomByIds(cages_id)
// 	// if err != nil {
// 	// 	return cages, err
// 	// }
// 	fmt.Println(cages)

// 	return cages, nil
// }

// func (r *CageRoomRepository) GetAllCageRoomByIds(ids []uint) ([]model.CageRoom, error) {
// 	cages := []model.CageRoom{}
// 	result := r.db.Preload("Profile").
// 				Where("id IN (?)", ids).
// 				Find(&cages)
				
// 	if result.Error != nil {
// 		return cages, result.Error
// 	}

// 	return cages,nil
// }