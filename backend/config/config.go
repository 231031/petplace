package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var SECRET_KEY string

// LoadEnvVariables ฟังก์ชันสำหรับโหลดไฟล์ .env และตั้งค่าตัวแปรต่างๆ
func LoadEnvVariables() {
	err := godotenv.Load("backend/.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	SECRET_KEY = os.Getenv("SECRET_KEY")
}

func GetEnv(key string, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}
