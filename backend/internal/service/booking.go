package service

import (
	"fmt"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"

	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/copier"
)

// implement bussiness logic
type BookingService struct {
	HotelServiceRepositoryIn repository.HotelServiceRepositoryIn
	CageRoomServiceIn        CageRoomServiceIn
	Validate                 *validator.Validate
}

func NewBookingService(
	hotelSerRepositoryIn repository.HotelServiceRepositoryIn,
	cageRoomService CageRoomServiceIn,
	validate *validator.Validate,
) *BookingService {

	return &BookingService{
		HotelServiceRepositoryIn: hotelSerRepositoryIn,
		CageRoomServiceIn:        cageRoomService,
		Validate:                 validate,
	}
}

// role : Hotel
func (s *BookingService) BookHotelService(payload types.BookingHotelPayload) error {
	if len(payload.Animals) == 0 {
		return fmt.Errorf("no animals provided in booking payload")
	}

	ser := model.HotelService{}
	if err := copier.Copy(&ser, &payload); err != nil {
		return fmt.Errorf("failed to copy booking payload to hotel service: %v", err)
	}

	animals := make([]model.AnimalHotelService, len(payload.Animals))
	for i, animalID := range payload.Animals {
		animals[i] = model.AnimalHotelService{
			AnimalUserID:   animalID,
			HotelServiceID: 0,
		}
	}

	// calculate price of this service
	cage, err := s.CageRoomServiceIn.GetCageRoom(ser.CageID)
	if err != nil {
		return err
	}
	if ser.EndTime.Before(ser.StartTime) {
		return fmt.Errorf("end time must be after start time")
	}

	duration := ser.EndTime.Sub(ser.StartTime)
	days := int(duration.Hours() / 24)
	price := cage.Price * days
	ser.Price = price

	err = s.HotelServiceRepositoryIn.BookHotelService(ser, animals)
	if err != nil {
		return err
	}

	// after transaction booking is complete
	// use payment service to pay the transaction from the client to the application
	// update order id link to paypal service and status in database
	// calculate fee for petplace
	// use payment service to send money to profile ( hotel )

	return nil
}

func (s *BookingService) UpdateHotelService(id uint, ser model.HotelService) error {
	ser_db, err := s.GetBookingHotel(id)
	if err != nil {
		return err
	}

	updateBook := utils.CopyNonZeroFields(&ser, &ser_db).(*model.HotelService)
	err = s.HotelServiceRepositoryIn.UpdateHotelService(*updateBook)
	if err != nil {
		return err
	}

	return nil
}

// role : hotel
func (s *BookingService) GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetAllHotelServiceByHotel(profile_id, status)
	if err != nil {
		return ser, err
	}

	return ser, nil
}

func (s *BookingService) GetBookingHotel(id uint) (model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetHotelService(id)
	if err != nil {
		return ser, err
	}

	return ser, nil
}

// role : client
func (s *BookingService) GetAllBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetAllHotelServiceByUser(user_id, status)
	if err != nil {
		return ser, err
	}

	return ser, nil
}
