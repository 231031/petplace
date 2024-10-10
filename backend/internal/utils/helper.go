package utils

import (
	"fmt"
	"strconv"

	"github.com/labstack/echo/v4"
)

func ConvertTypeToUint(str string) (*uint, error) {
	id_int, err := strconv.Atoi(str)
	if err != nil {
		return nil, err
	}
	profile_id := uint(id_int)
	return &profile_id, nil
}

func HandleError(c echo.Context, status int, msg string, err error) error {
	fmt.Println(err.Error())
	return c.String(status, msg)
}