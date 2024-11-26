package repository

import (
	"petplace/internal/model"
	"petplace/internal/types"
	"petplace/internal/utils"
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
	result := r.db.Preload("Profile", func(db *gorm.DB) *gorm.DB {
		return db.Select("ID", "CheckIn", "CheckOut")
	}).First(&cage)

	if result.Error != nil {
		return cage, result.Error
	}
	return cage, nil
}

func (r *CageRoomRepository) GetSpecificCageRoomType(id uint, animal_type string, cage_type string) (model.CageRoom, error) {
	cage := model.CageRoom{}
	result := r.db.Where("profile_id = ? AND animal_type = ? AND cage_type = ?", id, animal_type, cage_type).First(&cage)

	if result.Error != nil {
		return cage, result.Error
	}
	return cage, nil
}

func (r *CageRoomRepository) UpdateCageRoom(cage model.CageRoom) error {
	result := r.db.Model(&model.CageRoom{}).Where("id = ?", cage.ID).Updates(cage)
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
func (r *CageRoomRepository) FilterCages(animals []types.FilterInfo, startTime, endTime time.Time) ([]model.Profile, error) {
	profiles := []model.Profile{}

	animalPairs := utils.MapSearchAnimalPairs(animals)

	id, err := r.GetNotAvaliableCageRoom(animalPairs, startTime, endTime)
	if err != nil {
		return profiles, err
	}

	query := r.db.Model(&profiles).Where("role = ?", "hotel")
	if len(id) > 0 {
		query = query.Preload("Cages", func(db *gorm.DB) *gorm.DB {
			return db.Where("(animal_type, size) IN (?) AND id NOT IN (?)", animalPairs, id).Order("price ASC")
		})
	} else {
		query = query.Preload("Cages", func(db *gorm.DB) *gorm.DB {
			return db.Where("(animal_type, size) IN (?)", animalPairs).Order("price ASC")
		})
	}

	result_search := query.Group("profiles.id").
		Find(&profiles)

	if result_search.Error != nil {
		return profiles, result_search.Error
	}

	return profiles, nil
}

func (r *CageRoomRepository) FilterCagesByHotel(animals []types.FilterInfo, startTime, endTime time.Time, profile_id uint, user_id uint) (model.Profile, error) {
	profile := model.Profile{
		ID: profile_id,
	}
	animalPairs := utils.MapSearchAnimalPairs(animals)

	id, err := r.GetNotAvaliableCageRoom(animalPairs, startTime, endTime)
	if err != nil {
		return profile, err
	}

	query := r.db.First(&profile)
	if len(id) > 0 {
		query = query.Preload("Cages", func(db *gorm.DB) *gorm.DB {
			return db.Where("(animal_type, size) IN (?) AND id NOT IN (?)", animalPairs, id).Order("price ASC")
		})
	} else {
		query = query.Preload("Cages", func(db *gorm.DB) *gorm.DB {
			return db.Where("(animal_type, size) IN (?)", animalPairs).Order("price ASC")
		})
	}

	query = query.Preload("Cages.FavoriteCages")

	// .Preload("Cages.HotelServices", func(db *gorm.DB) *gorm.DB {
	// 	return db.Select("CageID", "ReviewDetail", "ReviewRate")
	// })

	result_search := query.Find(&profile)

	if result_search.Error != nil {
		return profile, result_search.Error
	}
	return profile, nil
}

func (r *CageRoomRepository) GetNotAvaliableCageRoom(animals [][]interface{}, startTime, endTime time.Time) ([]uint, error) {
	id := []uint{}
	services := []model.HotelService{}

	// start time between range of bookinh time and start time not equal to end time
	// end time between range of booking time and end time not equal to start time
	query_service := r.db.Model(&services)
	result := query_service.
		Select("hotel_services.cage_id, cage_rooms.quantity").
		Joins("JOIN cage_rooms ON cage_rooms.id = hotel_services.cage_id").
		Where("(animal_type, size) IN (?)", animals).
		Where("((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?)) AND status IN (?, ?)", startTime, startTime, endTime, endTime, "accepted", "pending").
		Group("hotel_services.cage_id").
		Having("COUNT(start_time) >= cage_rooms.quantity").
		Find(&services)

	if result.Error != nil {
		return id, result.Error
	}

	for _, service := range services {
		id = append(id, service.CageID)
	}
	return id, nil
}

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
