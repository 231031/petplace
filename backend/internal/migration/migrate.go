package migration

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	// AutoMigrate all models
	db.AutoMigrate(&model.ReservationTime{})
	db.AutoMigrate(&model.AnimalBookExtra{}) // history service
	db.AutoMigrate(&model.AnimalBookClinic{})
	db.AutoMigrate(&model.AnimalBookService{})

	db.AutoMigrate(&model.ClinicSubPrice{})
	db.AutoMigrate(&model.ClinicSubService{})
	db.AutoMigrate(&model.ClinicService{})

	db.AutoMigrate(&model.CareExtraService{})
	db.AutoMigrate(&model.CareServicePrice{})
	db.AutoMigrate(&model.CareService{})

	db.AutoMigrate(&model.FavoriteCage{})
	db.AutoMigrate(&model.AnimalHotelService{})
	db.AutoMigrate(&model.HotelService{})
	db.AutoMigrate(&model.CageRoom{})

	db.AutoMigrate(&model.ProductAnimal{})
	db.AutoMigrate(&model.ProductMerchadise{})
	db.AutoMigrate(&model.Order{})
	db.AutoMigrate(&model.Animal{})
	db.AutoMigrate(&model.Merchandise{})

	db.AutoMigrate(&model.TransportService{})
	db.AutoMigrate(&model.TransportCategory{})

	db.AutoMigrate(&model.Chat{})

	db.AutoMigrate(&model.Profile{})
	db.AutoMigrate(&model.AnimalUserVaccine{})
	db.AutoMigrate(&model.AnimalUser{})
	db.AutoMigrate(&model.User{})

	// Check and create foreign keys if they don't exist
	createForeignKeyIfNotExists(db, &model.CageRoom{}, "FavoriteCages")
	createForeignKeyIfNotExists(db, &model.User{}, "FavoriteCages")

	createForeignKeyIfNotExists(db, &model.User{}, "Profiles")
	createForeignKeyIfNotExists(db, &model.User{}, "Animals")
	createForeignKeyIfNotExists(db, &model.AnimalUser{}, "AnimalUserVaccines")

	createForeignKeyIfNotExists(db, &model.User{}, "Chats")
	createForeignKeyIfNotExists(db, &model.Profile{}, "Chats")

	createForeignKeyIfNotExists(db, &model.Profile{}, "Cages")
	createForeignKeyIfNotExists(db, &model.CageRoom{}, "HotelServices")
	createForeignKeyIfNotExists(db, &model.HotelService{}, "AnimalHotelServices")
	createForeignKeyIfNotExists(db, &model.AnimalUser{}, "AnimalHotelServices")

	createForeignKeyIfNotExists(db, &model.AnimalUser{}, "AnimalBookServices")
	createForeignKeyIfNotExists(db, &model.Profile{}, "ClinicServices")
	createForeignKeyIfNotExists(db, &model.Profile{}, "CareServices")
	createForeignKeyIfNotExists(db, &model.Profile{}, "ReservationTimes")

	createForeignKeyIfNotExists(db, &model.ClinicService{}, "ClinicSubServices")
	createForeignKeyIfNotExists(db, &model.ClinicSubService{}, "ClinicSubPrices")
	createForeignKeyIfNotExists(db, &model.ClinicSubPrice{}, "AnimalBookClinics")

	createForeignKeyIfNotExists(db, &model.CareService{}, "CareServicePrices")
	createForeignKeyIfNotExists(db, &model.CareService{}, "CareExtraServices")
	createForeignKeyIfNotExists(db, &model.CareServicePrice{}, "AnimalBookServices")
	createForeignKeyIfNotExists(db, &model.CareExtraService{}, "AnimalBookExtras")

	createForeignKeyIfNotExists(db, &model.AnimalBookService{}, "AnimalBookExtras")
	createForeignKeyIfNotExists(db, &model.AnimalBookService{}, "AnimalBookClinics")

	createForeignKeyIfNotExists(db, &model.Profile{}, "TransportCategorys")
	createForeignKeyIfNotExists(db, &model.AnimalUser{}, "TransportServices")
	createForeignKeyIfNotExists(db, &model.TransportCategory{}, "TransportServices")

	createForeignKeyIfNotExists(db, &model.Profile{}, "Merchandises")
	createForeignKeyIfNotExists(db, &model.Profile{}, "Animals")
	createForeignKeyIfNotExists(db, &model.User{}, "Orders")
	createForeignKeyIfNotExists(db, &model.Order{}, "ProductMerchadises")
	createForeignKeyIfNotExists(db, &model.Order{}, "ProductAnimals")
	createForeignKeyIfNotExists(db, &model.Animal{}, "ProductAnimals")
	createForeignKeyIfNotExists(db, &model.Merchandise{}, "ProductMerchadises")

	return nil
}

// Helper function to create a foreign key constraint if it doesn't already exist
func createForeignKeyIfNotExists(db *gorm.DB, model interface{}, constraintName string) {
	if !db.Migrator().HasConstraint(model, constraintName) {
		db.Migrator().CreateConstraint(model, constraintName)
	}
}
