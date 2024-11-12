package service

import (
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"
	"sort"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
)

// implement bussiness logic
type CageRoomService struct {
	ProfileServiceIn     ProfileServiceIn
	CageRoomRepositoryIn repository.CageRoomRepositoryIn
	Validate             *validator.Validate
}

func NewCageRoomService(
	profileServiceIn ProfileServiceIn,
	cageRoomRepositoryIn repository.CageRoomRepositoryIn,
	validate *validator.Validate,
) *CageRoomService {
	return &CageRoomService{
		ProfileServiceIn:     profileServiceIn,
		CageRoomRepositoryIn: cageRoomRepositoryIn,
		Validate:             validate,
	}
}

func (s *CageRoomService) CreateCageRoom(cages []model.CageRoom) error {
	if len(cages) > 0 {
		for i := range cages {
			cages[i].Size = utils.MapCageSize(cages[i].MaxCapacity)
			cages[i].Image = utils.MapStringArrayToText(cages[i].ImageArray)
			cages[i].Facility = utils.MapStringArrayToText(cages[i].FacilityArray)
		}
	}

	err := s.CageRoomRepositoryIn.CreateCageRoom(cages)
	if err != nil {
		return err
	}
	return nil
}

func (s *CageRoomService) GetAllCageRoom(profile_id uint) ([]model.CageRoom, error) {
	cages, err := s.CageRoomRepositoryIn.GetAllCageRoom(profile_id)
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

func (s *CageRoomService) GetCageRoom(id uint) (model.CageRoom, error) {
	cage, err := s.CageRoomRepositoryIn.GetCageRoom(id)
	if err != nil {
		return cage, err
	}

	cage.ImageArray = utils.MapTextToStringArray(cage.Image)
	cage.FacilityArray = utils.MapTextToStringArray(cage.Facility)
	return cage, nil
}

func (s *CageRoomService) UpdateCageRoom(id uint, cage model.CageRoom) error {
	cageDb, err := s.GetCageRoom(id)
	if err != nil {
		return err
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

	updateCage := utils.CopyNonZeroFields(&cage, &cageDb).(*model.CageRoom)
	err = s.CageRoomRepositoryIn.UpdateCageRoom(*updateCage)
	if err != nil {
		return err
	}

	return nil
}

func (s *CageRoomService) DeleteCageRoom(id uint) error {
	err := s.CageRoomRepositoryIn.DeleteCageRoom(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *CageRoomService) SearchCage(animals []types.FilterInfo, filter types.FilterSearchCage) ([]model.Profile, error) {
	if err := s.Validate.Struct(filter); err != nil {
		return nil, err
	}

	long, err := strconv.ParseFloat(filter.Longitude, 64)
	if err != nil {
		return nil, err
	}

	la, err := strconv.ParseFloat(filter.Latitude, 64)
	if err != nil {
		return nil, err
	}

	startDate, err := time.Parse("2006-01-02", filter.StartTime)
	if err != nil {
		return nil, err
	}

	endDate, err := time.Parse("2006-01-02", filter.EndTime)
	if err != nil {
		return nil, err
	}

	profiles, err := s.CageRoomRepositoryIn.FilterCages(animals, startDate, endDate)
	if err != nil {
		return profiles, err
	}

	// sort by
	if filter.Sort == "price" {
		sort.SliceStable(profiles, func(i, j int) bool { return profiles[i].Cages[0].Price < profiles[j].Cages[0].Price })
	} else if filter.Sort == "distance" {
		profiles = s.ProfileServiceIn.SortProfileByDistance(profiles, la, long)
	} else if filter.Sort == "review" {
		profiles = s.ProfileServiceIn.SortProfileByReviewRate(profiles)
	}

	if len(profiles) > 0 {
		for i := range profiles {
			profiles[i].ImageArray = utils.MapTextToStringArray(profiles[i].Image)
		}
	}

	return profiles, nil
}

func (s *CageRoomService) SearchCageByHotel(animals []types.FilterInfo, filter types.FilterSearchCage, profile_id uint) (model.Profile, error) {
	profile := model.Profile{}
	if err := s.Validate.Struct(filter); err != nil {
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

	profile, err = s.CageRoomRepositoryIn.FilterCagesByHotel(animals, startDate, endDate, profile_id)
	if err != nil {
		return profile, err
	}

	profile.ImageArray = utils.MapTextToStringArray(profile.Image)
	if len(profile.Cages) > 0 {
		for i := range profile.Cages {
			profile.Cages[i].ImageArray = utils.MapTextToStringArray(profile.Cages[i].Image)
			profile.Cages[i].FacilityArray = utils.MapTextToStringArray(profile.Cages[i].Facility)
		}
	}

	return profile, nil
}
