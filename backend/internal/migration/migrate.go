package migration

import (
	"petplace/internal/model"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	// & reserved clinic & care services
	db.AutoMigrate(&model.ReservationTime{})
	db.AutoMigrate(&model.AnimalBookExtra{}) // history service
	db.AutoMigrate(&model.AnimalBookClinic{})
	db.AutoMigrate(&model.AnimalBookService{})

	// supply clinic
	db.AutoMigrate(&model.ClinicSubPrice{})
	db.AutoMigrate(&model.ClinicSubService{})
	db.AutoMigrate(&model.ClinicService{})

	// & care
	db.AutoMigrate(&model.CareExtraService{})
	db.AutoMigrate(&model.CareServicePrice{})
	db.AutoMigrate(&model.CareService{})

	// supply hotel
	db.AutoMigrate(&model.FavoriteCage{})
	db.AutoMigrate(&model.AnimalHotelService{})
	db.AutoMigrate(&model.HotelService{})
	db.AutoMigrate(&model.CageRoom{})

	// seller
	db.AutoMigrate(&model.ProductAnimal{})
	db.AutoMigrate(&model.ProductMerchadise{})
	db.AutoMigrate(&model.Order{})
	db.AutoMigrate(&model.Animal{})
	db.AutoMigrate(&model.Merchandise{})

	// transportation
	db.AutoMigrate(&model.TransportService{})
	db.AutoMigrate(&model.TransportCategory{})

	// chat
	db.AutoMigrate(&model.Chat{})

	// profile
	db.AutoMigrate(&model.Profile{})
	db.AutoMigrate(&model.AnimalUserVaccine{})
	db.AutoMigrate(&model.AnimalUser{})
	db.AutoMigrate(&model.User{})

	// create foreignkeys
	// uncomment to create foreign keys then comment again

	// FavoriteCage
	// db.Migrator().CreateConstraint(&model.CageRoom{}, "FavoriteCages")
	// db.Migrator().CreateConstraint(&model.User{}, "FavoriteCages")

	// profile
	// db.Migrator().CreateConstraint(&model.User{}, "Profiles")
	// db.Migrator().CreateConstraint(&model.User{}, "Animals")
	// db.Migrator().CreateConstraint(&model.AnimalUser{}, "AnimalUserVaccines")

	// chat
	// db.Migrator().CreateConstraint(&model.Profile{}, "ChatSenders")
	// db.Migrator().CreateConstraint(&model.Profile{}, "ChatReceivers")

	// supply hotel
	// db.Migrator().CreateConstraint(&model.Profile{}, "Cages")
	// db.Migrator().CreateConstraint(&model.CageRoom{}, "HotelServices")
	// db.Migrator().CreateConstraint(&model.HotelService{}, "AnimalHotelServices")
	// db.Migrator().CreateConstraint(&model.AnimalUser{}, "AnimalHotelServices")

	// clinic & care
	// db.Migrator().CreateConstraint(&model.AnimalUser{}, "AnimalBookServices")
	// db.Migrator().CreateConstraint(&model.Profile{}, "ClinicServices")
	// db.Migrator().CreateConstraint(&model.Profile{}, "CareServices")
	// db.Migrator().CreateConstraint(&model.Profile{}, "ReservationTimes")

	// supply clinic
	// db.Migrator().CreateConstraint(&model.ClinicService{}, "ClinicSubServices")
	// db.Migrator().CreateConstraint(&model.ClinicSubService{}, "ClinicSubPrices")
	// db.Migrator().CreateConstraint(&model.ClinicSubPrice{}, "AnimalBookClinics")

	// & care
	// db.Migrator().CreateConstraint(&model.CareService{}, "CareServicePrices")
	// db.Migrator().CreateConstraint(&model.CareService{}, "CareExtraServices")
	// db.Migrator().CreateConstraint(&model.CareServicePrice{}, "AnimalBookServices")
	// db.Migrator().CreateConstraint(&model.CareExtraService{}, "AnimalBookExtras")

	// reservation clinic & care
	// db.Migrator().CreateConstraint(&model.AnimalBookService{}, "AnimalBookExtras")
	// db.Migrator().CreateConstraint(&model.AnimalBookService{}, "AnimalBookClinics")

	// transportation
	// db.Migrator().CreateConstraint(&model.Profile{}, "TransportCategorys")
	// db.Migrator().CreateConstraint(&model.AnimalUser{}, "TransportServices")
	// db.Migrator().CreateConstraint(&model.TransportCategory{}, "TransportServices")

	// seller
	// db.Migrator().CreateConstraint(&model.Profile{}, "Merchandises")
	// db.Migrator().CreateConstraint(&model.Profile{}, "Animals")
	// db.Migrator().CreateConstraint(&model.User{}, "Orders")
	// db.Migrator().CreateConstraint(&model.Order{}, "ProductMerchadises")
	// db.Migrator().CreateConstraint(&model.Order{}, "ProductAnimals")
	// db.Migrator().CreateConstraint(&model.Animal{}, "ProductAnimals")
	// db.Migrator().CreateConstraint(&model.Merchandise{}, "ProductMerchadises")

	return nil
}

// db.AutoMigrate(&model.Clinic{})
// db.AutoMigrate(&model.Seller{})
// db.AutoMigrate(&model.Hotel{})
// db.AutoMigrate(&model.Carrier{})

// db.Migrator().CreateConstraint(&model.AnimalUser{}, "HotelServices")

// db.Migrator().CreateConstraint(&model.Profile{}, "Hotel")
// db.Migrator().CreateConstraint(&model.Profile{}, "Clinic")
// db.Migrator().CreateConstraint(&model.Profile{}, "Carrier")

// db.Migrator().CreateConstraint(&model.Hotel{}, "Cages")
// db.Migrator().CreateConstraint(&model.Clinic{}, "ServiceClinics")
// db.Migrator().CreateConstraint(&model.Carrier{}, "TransportCategorys")
// db.Migrator().CreateConstraint(&model.Seller{}, "Merchandises")
// db.Migrator().CreateConstraint(&model.Seller{}, "Animals")

// db.Migrator().CreateConstraint(&model.HotelService{}, "CageRoom")

// db.Migrator().CreateConstraint(&model.Profile{}, "ServiceDetails")
// db.Migrator().CreateConstraint(&model.AnimalUser{}, "AnimalServices")
// db.Migrator().CreateConstraint(&model.ServiceDetail{}, "AnimalServices")
