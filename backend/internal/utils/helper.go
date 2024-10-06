package utils

import (
	"strconv"
)

func ConvertTypeToUint(str string) (*uint, error) {
	id_int, err := strconv.Atoi(str)
	if err != nil {
		return nil, err
	}
	profile_id := uint(id_int)
	return &profile_id, nil
}