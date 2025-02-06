package repository

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type favoriteCageRepository struct {
	db *gorm.DB
}

func NewFavoriteCageRepository(db *gorm.DB) FavoriteCageRepository {
	return &favoriteCageRepository{db: db}
}

func (r *favoriteCageRepository) AddFavoriteCage(fav model.FavoriteCage) error {
	result := r.db.Create(&fav)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *favoriteCageRepository) DelFavoriteCage(user_id uint, cage_id uint) error {
	fav := model.FavoriteCage{UserID: user_id, CageID: cage_id}
	result := r.db.Where("user_id = ? AND cage_id = ?", user_id, cage_id).Delete(&fav)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *favoriteCageRepository) GetFavoriteCageByUser(user_id uint) ([]model.FavoriteCage, error) {
	favorites := []model.FavoriteCage{}
	result := r.db.Preload("CageRoom").Preload("CageRoom.Profile", func(db *gorm.DB) *gorm.DB {
		return db.Select("ID", "CheckIn", "CheckOut", "Name", "AvgReview", "Facility", "Image", "ImageProfile",
			"Longitude", "Latitude", "Address", "Email", "Tel")
	}).Where("user_id = ?", user_id).Find(&favorites)
	if result.Error != nil {
		return favorites, result.Error
	}
	return favorites, nil
}
