package auth_test

import (
	"petplace/internal/auth"
	"testing"

	"github.com/joho/godotenv"
)

func TestGenerateJwt(t *testing.T) {
	// ระบุ path ให้ถูกต้อง เช่น backend/.env
	err := godotenv.Load("../../.env")
	if err != nil {
		t.Fatalf("Error loading .env file: %v", err)
	}

	// สร้าง JWT Token
	token, err := auth.GenerateJwt(1, "user@example.com", "admin")
	if err != nil {
		t.Fatalf("error loading .env file: %v", err)

	}

	if token == "" {
		t.Fatal("Generated token is empty")
	}

	t.Log("Generated Token:", token)
}
