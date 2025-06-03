package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func ComparePassword(password string, hashed string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
	return err == nil
}

func GenerateJwt(id uint, email string, role string) (string, error) {

	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		return "", fmt.Errorf("secret key not found in environment variables")
	}

	claims := jwt.MapClaims{
		"id":    id,
		"email": email,
		"role":  role,
		"exp":   time.Now().Add(time.Hour * 3).Unix(),
	}

	// create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}
