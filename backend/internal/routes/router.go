package routes

import (
	"petplace/internal/api"
	"petplace/internal/repository"
	"petplace/internal/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
	"gorm.io/gorm"
)


func CreateRoutes(e *echo.Echo, db *gorm.DB) {

	validate := validator.New()
	e.GET("/swagger/*any", echoSwagger.WrapHandler)
	
	baseRouter := e.Group("/api")
	
	// create new repository
	animalUserRepository := repository.NewAnimalUserRepository(db)

	// User
	user := baseRouter.Group("/user")
	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository, animalUserRepository, validate)
	userHandler := api.NewUsersHandler(userService)
	userHandler.RegisterRoutes(user)

	// CageRoom
	cage := baseRouter.Group("/cageroom")
	cageRoomRepository := repository.NewCageRoomRepository(db)
	cageRoomService := service.NewCageRoomService(cageRoomRepository, validate)
	cageRoomHandler := api.NewCageRoomHandler(cageRoomService)
	cageRoomHandler.RegisterRoutes(cage)


	// HotelService
	ser_hotel := baseRouter.Group("/service/hotel")
	hotelServiceRepository := repository.NewHotelServiceRepository(db)
	bookingService := service.NewBookingService(hotelServiceRepository, cageRoomService, validate)
	hotelHandler := api.NewHotelHandler(bookingService)
	hotelHandler.RegisterRoutes(ser_hotel)

	// search
	search := baseRouter.Group("/search")
	searchHandler := api.NewSearchHandler(cageRoomService)
	searchHandler.RegisterRoutes(search)

}
