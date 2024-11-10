package utils

import (
	"bytes"
	"fmt"
	"petplace/internal/types"
	"reflect"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

func ConvertTypeToUint(str string) (uint, error) {
	id_int, err := strconv.Atoi(str)
	if err != nil {
		return 0, err
	}
	profile_id := uint(id_int)
	return profile_id, nil
}

func HandleError(c echo.Context, status int, msg string, err error) error {
	fmt.Println(err.Error())
	return c.String(status, msg)
}

func CopyNonZeroFields(data interface{}, data_db interface{}) interface{} {
	dataVal := reflect.ValueOf(data).Elem()
	dataDbVal := reflect.ValueOf(data_db).Elem()

	dataType := reflect.TypeOf(data).Elem()
	fields := reflect.VisibleFields(dataType)

	for _, field := range fields {
		fieldName := field.Name
		fieldVal := dataVal.FieldByName(fieldName)
		dbFieldVal := dataDbVal.FieldByName(fieldName)

		if fieldVal.IsZero() && dbFieldVal.IsValid() && fieldVal.CanSet() {
			fieldVal.Set(dbFieldVal)
		}
	}

	return data
}

func MapSearchAnimalPairs(animals []types.FilterInfo) [][]interface{} {
	animalPairs := [][]interface{}{}
	for _, animal := range animals {
		animalPairs = append(animalPairs, []interface{}{animal.AnimalType, animal.CageSize})
	}
	return animalPairs
}

func MapCageSize(max_capacity int) string {
	if max_capacity >= 1 && max_capacity <= 2 {
		return "s"
	} else if max_capacity >= 3 && max_capacity <= 4 {
		return "m"
	} else if max_capacity >= 5 && max_capacity <= 6 {
		return "l"
	}

	return "xl"
}

func MapStringArrayToText(stringArray []string) string {
	var stringText bytes.Buffer

	if len(stringArray) > 0 {
		for i := range stringArray {
			if i == len(stringArray)-1 {
				str := stringArray[i]
				stringText.WriteString(str)
				break
			}
			str := stringArray[i] + ","
			stringText.WriteString(str)
		}
		return stringText.String()
	}
	return ""
}

func MapTextToStringArray(text string) []string {
	if text == "" {
		return []string{}
	}
	return strings.Split(text, ",")
}
