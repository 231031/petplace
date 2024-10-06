package routes

import (
	"petplace/internal/api"
	"petplace/internal/repository"
	"petplace/internal/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func CreateRoutes(e *echo.Echo, db *gorm.DB) {

	validate := validator.New()

	// create new repository
	animalUserRepository := repository.NewAnimalUserRepository(db)
	cageRoomRepository := repository.NewCageRoomRepository(db)

	// users
	user := e.Group("/api/users")
	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository, animalUserRepository, validate)
	userHandler := api.NewUsersHandler(userService)
	userHandler.RegisterRoutes(user)

	ser_hotel := e.Group("/api/service/hotel")
	hotelServiceRepository := repository.NewHotelServiceRepository(db)
	bookingService := service.NewBookingService(hotelServiceRepository, cageRoomRepository, validate)
	hotelHandler := api.NewHotelHandler(bookingService)
	hotelHandler.RegisterRoutes(ser_hotel)

}
