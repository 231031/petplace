package main

import (
	"fmt"
	"petplace/config"
	"petplace/internal/migration"
	"petplace/internal/routes"

	_ "petplace/cmd/main/docs"

	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func main() {
	e := echo.New()
	e.GET("/swagger/*", echoSwagger.WrapHandler)
	
	db, err := config.ConnectDatabase()
	if err != nil {
		e.Logger.Fatalf("Failed to connect %s", err.Error())
	}
	fmt.Printf("connect database successfully\n")

	migration.Migrate(db)

	routes.CreateRoutes(e, db)
	e.Logger.Fatal(e.Start(":5000"))
}