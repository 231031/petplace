package main

import (
	"fmt"
	"net/http"
	"petplace/config"
	"petplace/internal/migration"
	"petplace/internal/routes"

	_ "petplace/cmd/main/docs"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

//	@title			Petplace API Version1
//	@version		1.0
//	@description	Petplace API Description
//	@host			localhost:5000
//	@BasePath		/api
//
// @securityDefinitions.apiKey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
//
//	@schemes http
func main() {

	e := echo.New()

	// Configure CORS
	// front_url := os.Getenv("FRONT_URL")
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	db, err := config.ConnectDatabase()
	if err != nil {
		e.Logger.Fatalf("Failed to connect %s", err.Error())
	}
	fmt.Printf("connect database successfully\n")
	migration.Migrate(db)

	routes.CreateRoutes(e, db)
	e.Logger.Fatal(e.Start(":50001"))

}
