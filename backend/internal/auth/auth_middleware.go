package auth

import (
	"fmt"
	"net/http"
	"os"
	"petplace/internal/utils"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

// Authentication
// AuthMiddleware check token from Authorization header
func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return echo.NewHTTPError(http.StatusUnauthorized, "Missing Authorization header") //dont have Authorization header
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid Authorization header format")
		}

		secretKey := []byte(os.Getenv("SECRET_KEY"))

		// ใช้ JWT package เพื่อ parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			fmt.Println(err.Error())
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid or expired token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if ok && token.Valid {
			c.Set("role", claims["role"])
			return next(c)
		}

		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid or expired token")
	}
}

func AuthurizationMiddleware(expectedClaims []string, next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userRole := c.Get("role")
		permit := HasPermissions(userRole.(string), expectedClaims)
		if !permit {
			return echo.NewHTTPError(http.StatusUnauthorized, "this role is not allowed to be granted")
		} else {
			return next(c)
		}
	}
}

func HasPermissions(userRole string, expectedClaims []string) bool {
	if len(expectedClaims) == 0 {
		return false
	}

	if !utils.Contains(expectedClaims, userRole) {
		return false
	}
	return true
}
