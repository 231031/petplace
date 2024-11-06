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

	// users
	user := e.Group("/api/users")
	userRepository := repository.NewUsersRepository(db)
	userService := service.NewUsersService(userRepository, validate)
	userHandler := api.NewUsersHandler(userService)
	userHandler.RegisterRoutes(user)
	

}