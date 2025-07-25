package service

import (
	"errors"
	"net/http"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/umahmood/haversine"
	"gorm.io/gorm"
)

// implement bussiness logic
type cageRoomService struct {
	ProfileService     ProfileService
	CageRoomRepository repository.CageRoomRepository
	Validate           *validator.Validate
}

func NewCageRoomService(
	profileService ProfileService,
	cageRoomRepository repository.CageRoomRepository,
	validate *validator.Validate,
) CageRoomService {
	return &cageRoomService{
		ProfileService:     profileService,
		CageRoomRepository: cageRoomRepository,
		Validate:           validate,
	}
}

func (s *cageRoomService) CreateCageRoom(cage model.CageRoom) (int, string, error) {
	cage.AnimalType = strings.ToLower(cage.AnimalType)
	_, err := s.CageRoomRepository.GetSpecificCageRoomType(cage.ProfileID, cage.AnimalType, cage.CageType)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		cage.Size = utils.MapCageSize(cage.MaxCapacity)
		cage.Image = utils.MapStringArrayToText(cage.ImageArray)
		cage.Facility = utils.MapStringArrayToText(cage.FacilityArray)

		err = s.CageRoomRepository.CreateCageRoom(cage)
		if err != nil {
			return http.StatusInternalServerError, "falied to create cage", err
		}
		return http.StatusCreated, "successfully added cage", nil
	}

	return http.StatusBadRequest, "this type of cage already exists", nil
}

func (s *cageRoomService) GetAllCageRoom(profile_id uint) ([]model.CageRoom, error) {
	cages, err := s.CageRoomRepository.GetAllCageRoom(profile_id)
	if err != nil {
		return cages, err
	}

	if len(cages) > 0 {
		for i := range cages {
			cages[i].ImageArray = utils.MapTextToStringArray(cages[i].Image)
			cages[i].FacilityArray = utils.MapTextToStringArray(cages[i].Facility)
		}
	}

	return cages, nil
}

func (s *cageRoomService) GetCageRoom(id uint) (model.CageRoom, error) {
	cage, err := s.CageRoomRepository.GetCageRoom(id)
	if err != nil {
		return cage, err
	}

	cage.ImageArray = utils.MapTextToStringArray(cage.Image)
	cage.FacilityArray = utils.MapTextToStringArray(cage.Facility)
	return cage, nil
}

func (s *cageRoomService) GetAllAnimalCageType(id uint) ([]types.CageAnimalType, error) {
	var animalCageTypes []types.CageAnimalType
	cages, err := s.GetAllCageRoom(id)
	if err != nil {
		return animalCageTypes, err
	}

	animalCageTypesMap := make(map[string]*types.CageAnimalType)
	for _, c := range cages {
		if _, exists := animalCageTypesMap[c.AnimalType]; !exists {
			animalCageTypesMap[c.AnimalType] = &types.CageAnimalType{
				AnimalType: c.AnimalType,
				Cage:       []types.CageSpecific{},
			}
		}
		animalCageTypesMap[c.AnimalType].Cage = append(animalCageTypesMap[c.AnimalType].Cage, types.CageSpecific{
			CageID:   c.ID,
			CageType: c.CageType,
		})

	}
	for _, value := range animalCageTypesMap {
		animalCageTypes = append(animalCageTypes, *value)
	}
	return animalCageTypes, nil

}

func (s *cageRoomService) UpdateCageRoom(id uint, cage model.CageRoom) error {
	cageDb, err := s.GetCageRoom(id)
	if err != nil {
		return err
	}

	if cage.AnimalType != "" {
		cage.AnimalType = strings.ToLower(cage.AnimalType)
	}

	if len(cage.ImageArray) > 0 {
		updateImage := utils.MapStringArrayToText(cage.ImageArray)
		cage.Image = updateImage
	} else {
		cage.Image = ""
	}

	if len(cage.FacilityArray) > 0 {
		updateFacility := utils.MapStringArrayToText(cage.FacilityArray)
		cage.Facility = updateFacility
	} else {
		cage.Facility = ""
	}

	if cage.MaxCapacity > 0 {
		cage.Size = utils.MapCageSize(cage.MaxCapacity)
	}

	updateCage := utils.CopyNonZeroFields(&cage, &cageDb).(*model.CageRoom)
	err = s.CageRoomRepository.UpdateCageRoom(*updateCage)
	if err != nil {
		return err
	}

	return nil
}

func (s *cageRoomService) DeleteCageRoom(id uint) error {
	err := s.CageRoomRepository.DeleteCageRoom(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *cageRoomService) SearchCage(animals []types.FilterInfo, filter types.FilterSearchCage) ([]model.Profile, error) {
	profiles := []model.Profile{}

	if err := s.Validate.Struct(filter); err != nil {
		return profiles, err
	}

	startDate, err := time.Parse("2006-01-02", filter.StartTime)
	if err != nil {
		return profiles, err
	}

	endDate, err := time.Parse("2006-01-02", filter.EndTime)
	if err != nil {
		return profiles, err
	}

	userLoc := types.LocationParams{Latitude: filter.Latitude, Longitude: filter.Longitude}
	profilesBe, err := s.CageRoomRepository.FilterCages(animals, startDate, endDate)
	for i := range profilesBe {
		if len(profilesBe[i].Cages) > 0 {
			// protected private information
			profilesBe[i].PaypalEmail = ""

			// calculate distances
			km, err := utils.CalculateDistance(userLoc, profilesBe[i].Latitude, profilesBe[i].Longitude)
			if err != nil {
				return profiles, err
			}
			// profileLoc := haversine.Coord{Lat: profilesBe[i].Latitude, Lon: profilesBe[i].Longitude}
			// _, km := haversine.Distance(profileLoc, userLoc)
			profilesBe[i].Distance = km

			// map text to array
			profilesBe[i].ImageArray = utils.MapTextToStringArray(profilesBe[i].Image)
			profilesBe[i].FacilityArray = utils.MapTextToStringArray(profilesBe[i].Facility)
			if len(profilesBe[i].Cages) > 0 {
				for j := range profilesBe[i].Cages {
					profilesBe[i].Cages[j].ImageArray = utils.MapTextToStringArray(profilesBe[i].Cages[j].Image)
					profilesBe[i].Cages[j].FacilityArray = utils.MapTextToStringArray(profilesBe[i].Cages[j].Facility)
				}
			}

			profiles = append(profiles, profilesBe[i])
		}
	}
	if err != nil {
		return profiles, err
	}

	// sort by
	sort.SliceStable(profiles, func(i, j int) bool { return profiles[i].Cages[0].Price < profiles[j].Cages[0].Price })
	if strings.ToLower(filter.Sort) == "distance" {
		profiles = s.ProfileService.SortProfileByDistance(profiles)
	} else if strings.ToLower(filter.Sort) == "rating" {
		profiles = s.ProfileService.SortProfileByReviewRate(profiles)
	}
	return profiles, nil
}

func (s *cageRoomService) SearchCageByHotel(animals []types.FilterInfo, filter types.FilterSearchCage, profile_id uint, user_id uint) (model.Profile, error) {
	profile := model.Profile{}
	if err := s.Validate.Struct(filter); err != nil {
		return profile, err
	}

	long, err := strconv.ParseFloat(filter.Longitude, 64)
	if err != nil {
		return profile, err
	}

	la, err := strconv.ParseFloat(filter.Latitude, 64)
	if err != nil {
		return profile, err
	}

	startDate, err := time.Parse("2006-01-02", filter.StartTime)
	if err != nil {
		return profile, err
	}

	endDate, err := time.Parse("2006-01-02", filter.EndTime)
	if err != nil {
		return profile, err
	}

	profile, err = s.CageRoomRepository.FilterCagesByHotel(animals, startDate, endDate, profile_id, user_id)
	if err != nil {
		return profile, err
	}

	userLoc := haversine.Coord{Lat: la, Lon: long}
	profileLoc := haversine.Coord{Lat: profile.Latitude, Lon: profile.Longitude}
	_, km := haversine.Distance(profileLoc, userLoc)
	profile.Distance = km

	profile.PaypalEmail = ""
	profile.ImageArray = utils.MapTextToStringArray(profile.Image)
	profile.FacilityArray = utils.MapTextToStringArray(profile.Facility)
	if len(profile.Cages) > 0 {
		for i := range profile.Cages {
			profile.Cages[i].ImageArray = utils.MapTextToStringArray(profile.Cages[i].Image)
			profile.Cages[i].FacilityArray = utils.MapTextToStringArray(profile.Cages[i].Facility)
		}
	}

	return profile, nil
}
