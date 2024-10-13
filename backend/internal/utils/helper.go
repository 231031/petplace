package utils

import (
	"fmt"
	"reflect"
	"strconv"

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

	// if dataVal.Kind() != reflect.Ptr || dataDbVal.Kind() != reflect.Ptr {
	// 	panic("CopyNonZeroFields requires both arguments to be pointers")
	// }

	// dataVal = dataVal.Elem()
	// dataDbVal = dataDbVal.Elem()
	// fmt.Println(dataDbVal.Field(1))

// for i := 0; i < dataVal.NumField(); i++ {

// 	if isZeroValue(field) {
// 		dbField := dataDbVal.FieldByName(fieldName)
// 		if dbField.IsValid() && dbField.CanSet() {
// 			field.Set(dbField)
// 		}
// 	}
// }
