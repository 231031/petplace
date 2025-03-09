package utils

import (
	"bytes"
	"fmt"
	"petplace/internal/types"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/umahmood/haversine"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
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
	if err != nil {
		fmt.Println(err.Error())
	}
	return c.JSON(status, msg)
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

func BinaryConvertor(number int, bits int) []int {
	result := make([]int, 0)
	for number > 0 {
		result = append(result, number%2)
		number /= 2
	}
	for i := len(result) - 1; len(result) != bits; i++ {
		result = append(result, 0)
	}
	return result
}

func CheckOpenDay(openDay []string, date time.Time) string {
	weekDay := strings.ToLower(date.Weekday().String())

	// fmt.Println(weekDay)
	// if weekDay == "monday" || weekDay == "tuesday" || weekDay == "friday" {

	// }
	sort.Strings(openDay)
	index := sort.SearchStrings(openDay, weekDay)
	if index >= len(openDay) {
		return "close"
	}

	if openDay[index] == weekDay {
		return "open"
	}
	return "close"
}

func CalculateDistance(userLoc types.LocationParams, profileLa float64, profileLong float64) (float64, error) {
	userLong, err := strconv.ParseFloat(userLoc.Longitude, 64)
	if err != nil {
		return 0, err
	}

	userLa, err := strconv.ParseFloat(userLoc.Latitude, 64)
	if err != nil {
		return 0, err
	}

	fmt.Println("profile ", profileLa, profileLong)
	userHa := haversine.Coord{Lat: userLa, Lon: userLong}
	profileHa := haversine.Coord{Lat: profileLa, Lon: profileLong}
	_, km := haversine.Distance(profileHa, userHa)

	return km, nil
}

func Contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func CheckInputDate(startTime, endTime time.Time) (error, error) {
	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		return fmt.Errorf("failed to get current time in location"), err
	}

	currentTime := time.Now().In(location)
	nextDay := time.Date(
		currentTime.Year(),
		currentTime.Month(),
		currentTime.Day()+1,
		0, 0, 0, 0, location,
	)

	if (startTime.In(location)).Before(nextDay) {
		return fmt.Errorf("failed to reserve past day and current day"), nil
	}

	if (endTime).Before(startTime) {
		return fmt.Errorf("end time must be after start time"), nil
	}

	return nil, nil
}

func ConnectTestDB() (*gorm.DB, error) {
	dsn := "admin:12345@tcp(localhost:3307)/petplace?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn))
	if err != nil {
		return nil, err
	}

	return db, nil
}
