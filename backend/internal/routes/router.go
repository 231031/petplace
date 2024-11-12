package routes

import (
	"net/http"
	"petplace/internal/api"
	"petplace/internal/auth"
	"petplace/internal/repository"
	"petplace/internal/service"
	"petplace/internal/ticker"

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
	user.Use(auth.AuthMiddleware)
	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository, animalUserRepository, validate)
	userHandler := api.NewUsersHandler(userService)
	userHandler.RegisterRoutes(user)

	// Authentication
	authentication := baseRouter.Group("/auth")
	authService := service.NewAuthService(userRepository, validate)
	authHandler := api.NewAuthHandler(authService)
	authHandler.RegisterRoutes(authentication)

	// payment
	payment := baseRouter.Group("/payment")
	paymentService := service.NewPaymentService(validate)
	paymentHandler := api.NewPaymentHandler(paymentService)
	paymentHandler.RegisterRoutes(payment)

	// profile
	profile := baseRouter.Group("/profile")
	profile.Use(auth.AuthMiddleware)
	profileRepository := repository.NewProfileRepository(db)
	profileService := service.NewProfileService(profileRepository, userService, validate)
	profileHandler := api.NewProfileHandler(profileService)
	profileHandler.RegisterRoutes(profile)

	// CageRoom
	cage := baseRouter.Group("/cageroom")
	cageRoomRepository := repository.NewCageRoomRepository(db)
	cageRoomService := service.NewCageRoomService(profileService, cageRoomRepository, validate)
	cageRoomHandler := api.NewCageRoomHandler(cageRoomService)
	cageRoomHandler.RegisterRoutes(cage)

	// HotelService
	ser_hotel := baseRouter.Group("/hotel")
	ser_hotel.Use(auth.AuthMiddleware)
	hotelServiceRepository := repository.NewHotelServiceRepository(db)
	bookingService := service.NewBookingService(hotelServiceRepository, userService, profileService, cageRoomService, paymentService, validate)
	hotelHandler := api.NewHotelHandler(bookingService)
	hotelHandler.RegisterRoutes(ser_hotel)

	// TickerService
	tickerService := ticker.NewTickerService(bookingService)
	go tickerService.StartTickerService()

	// Protected route
	protected := baseRouter.Group("/protected")
	protected.Use(auth.AuthMiddleware)
	protected.GET("/data", func(c echo.Context) error {
		return c.String(http.StatusOK, "Protected data")
	})

}
