package config

import (
	"os"
)

var SECRET_KEY string

// func LoadEnvVariables() {
// 	err := godotenv.Load("backend/.env")
// 	if err != nil {
// 		log.Fatalf("Error loading .env file: %v", err)
// 	}
// 	SECRET_KEY = os.Getenv("SECRET_KEY")
// }

func GetEnv(key string, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}
