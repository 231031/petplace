package main

import (
	"fmt"
	"petplace/config"
	"petplace/internal/migration"
	"petplace/internal/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	db, err := config.ConnectDatabase()
	if err != nil {
		e.Logger.Fatalf("Failed to connect %s", err.Error())
	}
	fmt.Printf("connect database successfully\n")

	migration.Migrate(db)

	routes.CreateRoutes(e, db)
	e.Logger.Fatal(e.Start(":5000"))
}