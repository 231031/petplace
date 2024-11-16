package repository

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

// interact with the database
type FavoriteCageRepository struct {
	db *gorm.DB
}

func NewFavoriteCageRepository(db *gorm.DB) *FavoriteCageRepository {
	return &FavoriteCageRepository{db: db}
}

func (r *FavoriteCageRepository) AddFavoriteCage(fav model.FavoriteCage) error {
	result := r.db.Create(&fav)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *FavoriteCageRepository) DelFavoriteCage(user_id uint, cage_id uint) error {
	fav := model.FavoriteCage{UserID: user_id, CageID: cage_id}
	result := r.db.Where("user_id = ? AND cage_id = ?", user_id, cage_id).Delete(&fav)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *FavoriteCageRepository) GetFavoriteCageByUser(user_id uint) ([]model.FavoriteCage, error) {
	favorites := []model.FavoriteCage{}
	result := r.db.Where("user_id = ?", user_id).Find(&favorites)
	if result.Error != nil {
		return favorites, result.Error
	}
	return favorites, nil
}
