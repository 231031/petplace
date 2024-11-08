package auth

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go" // ใช้ package สำหรับจัดการ JWT
	"github.com/labstack/echo/v4"
)

// AuthMiddleware check token from Authorization header
func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// รับ Authorization header
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return echo.NewHTTPError(http.StatusUnauthorized, "Missing Authorization header") //dont have Authorization header
		}

		// checkว่า header เริ่มต้นด้วย Bearer หรือไม่
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid Authorization header format")
		}

		secretKey := []byte("your-secret-key")

		// ใช้ JWT package เพื่อ parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// ตรวจสอบว่า algorithm เป็น HMAC SHA256
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			// ถ้ามีข้อผิดพลาดในการ parse หรือ token ไม่ถูกต้อง
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid or expired token")
		}

		// token ถูกต้อง, ให้ข้ามไปยัง handler ต่อไป
		return next(c)
	}
}
