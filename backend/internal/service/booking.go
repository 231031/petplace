package service

import (
	"fmt"
	"net/http"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/copier"
)

// implement bussiness logic
type BookingService struct {
	HotelServiceRepositoryIn repository.HotelServiceRepositoryIn
	ProfileServiceIn         ProfileServiceIn
	CageRoomServiceIn        CageRoomServiceIn
	PaymentServiceIn         PaymentServiceIn
	Validate                 *validator.Validate
}

func NewBookingService(
	hotelSerRepositoryIn repository.HotelServiceRepositoryIn,
	profileService ProfileServiceIn,
	cageRoomService CageRoomServiceIn,
	paymentService PaymentServiceIn,
	validate *validator.Validate,
) *BookingService {

	return &BookingService{
		HotelServiceRepositoryIn: hotelSerRepositoryIn,
		ProfileServiceIn:         profileService,
		CageRoomServiceIn:        cageRoomService,
		PaymentServiceIn:         paymentService,
		Validate:                 validate,
	}
}

// role : Hotel
func (s *BookingService) BookHotelService(payload types.BookingPayload) (int, error, error) {
	err := s.Validate.Struct(payload)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("the booking detail is not correct"), err
	}

	if len(payload.Animals) == 0 {
		return http.StatusBadRequest, fmt.Errorf("no animals in booking detail"), err
	}

	ser := model.HotelService{}
	if err := copier.Copy(&ser, &payload); err != nil {
		return http.StatusBadRequest, fmt.Errorf("failed to copy booking payload to hotel service: %v", err), err
	}

	animals := make([]model.AnimalHotelService, len(payload.Animals))
	for i, animalID := range payload.Animals {
		animals[i] = model.AnimalHotelService{
			AnimalUserID:   animalID,
			HotelServiceID: 0,
		}
	}

	cage, err := s.CageRoomServiceIn.GetCageRoom(ser.CageID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("cage room not available"), err
	}
	if ser.EndTime.Before(ser.StartTime) {
		return http.StatusBadRequest, fmt.Errorf("end time must be after start time"), err
	}

	startDate, err := time.Parse("2006-01-02", payload.StartTime)
	if err != nil {
		return 0, fmt.Errorf("the booking detail is not correct"), err
	}
	endDate, err := time.Parse("2006-01-02", payload.EndTime)
	if err != nil {
		return 0, fmt.Errorf("the booking detail is not correct"), err
	}
	ser.StartTime = startDate
	ser.EndTime = endDate

	days, price := s.calculatePriceService(startDate, endDate, cage.Price)
	ser.Price = price

	bookID, err := s.HotelServiceRepositoryIn.BookHotelService(ser, animals)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("booking service failed"), err
	}

	// after transaction booking is complete
	// use payment service to pay the transaction from the client to the application
	bookDel := types.BookingDetail{
		TotalPrice: strconv.FormatFloat(float64(price), 'f', -1, 32),
		Category:   "PHYSICAL_GOODS",
		Day:        strconv.Itoa(days),
	}

	paymentID, err := s.PaymentServiceIn.RequestPayment(payload, bookDel)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("payment failed"), err
	}

	// update payment id link to paypal service and status in database
	updatedSer := model.HotelService{
		ServiceInfo: types.ServiceInfo{
			PaymentID:     paymentID,
			PaymentStatus: "completed",
		},
	}

	err = s.UpdateHotelService(bookID, updatedSer)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("update payment failed"), err
	}

	// calculate fee for petplace and use payment service to send money to profile ( hotel )
	cost := price - 0.1*price

	profile, err := s.ProfileServiceIn.GetProfileByID(payload.ProfileID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("booking service not complete"), err
	}

	payoutID, err := s.PaymentServiceIn.CreatePayout(cost, profile.PaypalEmail)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("booking service not complete"), err
	}

	updatedSer = model.HotelService{
		ServiceInfo: types.ServiceInfo{
			PayoutID: payoutID,
		},
	}

	err = s.UpdateHotelService(bookID, updatedSer)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("booking service not complete"), err
	}

	return http.StatusOK, nil, nil
}

func (s *BookingService) calculatePriceService(startTime, endTime time.Time, cagePrice float32) (int, float32) {
	duration := endTime.Sub(startTime)
	days := int(duration.Hours() / 24)
	price := cagePrice * float32(days)
	return days, price
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
