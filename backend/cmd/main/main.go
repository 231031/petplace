package main

import (
	"fmt"
	"petplace/config"
	"petplace/internal/migration"
	"petplace/internal/routes"

	_ "petplace/cmd/main/docs"

	"github.com/labstack/echo/v4"
)

//		@title			Petplace API Version1
//		@version		1.0
//		@description	Petplace API Description
//		@host			localhost:5000
//		@BasePath		/api
//	 @schemes http
func main() {

	e := echo.New()

	db, err := config.ConnectDatabase()
	if err != nil {
		e.Logger.Fatalf("Failed to connect %s", err.Error())
	}
	fmt.Printf("connect database successfully\n")

	migration.Migrate(db)

	routes.CreateRoutes(e, db)

	// แสดง JWT token ที่สร้าง
	// config.LoadEnvVariables() // โหลดค่า .env เพื่อให้ SECRET_KEY ถูกใช้
	// token, err := auth.GenerateJwt(1, "user@example.com", "admin")
	// if err != nil {
	// 	fmt.Println("Error generating JWT:", err)
	// } else {
	// 	fmt.Println("Generated JWT Token:", token)
	// }

	e.Logger.Fatal(e.Start(":5000"))

}
