package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var SECRET_KEY string

func LoadEnvVariables() {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	SECRET_KEY = os.Getenv("SECRET_KEY")
}
