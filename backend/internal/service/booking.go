package service

import (
	"errors"
	"fmt"
	"net/http"
	"petplace/internal/model"
	"petplace/internal/repository"
	"petplace/internal/types"
	"petplace/internal/utils"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/copier"
	"gorm.io/gorm"
)

// implement bussiness logic
type BookingService struct {
	HotelServiceRepositoryIn repository.HotelServiceRepositoryIn
	UsersServiceIn           UsersServiceIn
	ProfileServiceIn         ProfileServiceIn
	CageRoomServiceIn        CageRoomServiceIn
	PaymentServiceIn         PaymentServiceIn
	Validate                 *validator.Validate
}

func NewBookingService(
	hotelSerRepositoryIn repository.HotelServiceRepositoryIn,
	usersServiceIn UsersServiceIn,
	profileService ProfileServiceIn,
	cageRoomService CageRoomServiceIn,
	paymentService PaymentServiceIn,
	validate *validator.Validate,
) *BookingService {

	return &BookingService{
		HotelServiceRepositoryIn: hotelSerRepositoryIn,
		UsersServiceIn:           usersServiceIn,
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

	cage, err := s.CageRoomServiceIn.GetCageRoom(ser.CageID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("cage room not available"), err
	}

	startDate, err := time.Parse("2006-01-02", payload.StartTime)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("the booking detail is not correct"), err
	}
	endDate, err := time.Parse("2006-01-02", payload.EndTime)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("the booking detail is not correct"), err
	}
	ser.StartTime = startDate
	ser.EndTime = endDate

	strErr, err := utils.CheckInputDate(ser.StartTime, ser.EndTime)
	if err != nil {
		return http.StatusInternalServerError, strErr, err
	}
	if strErr != nil {
		return http.StatusBadRequest, strErr, nil
	}

	animals := make([]model.AnimalHotelService, len(payload.Animals))
	for i, animalID := range payload.Animals {
		animals[i] = model.AnimalHotelService{
			AnimalUserID:   animalID,
			HotelServiceID: 0,
		}
	}

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
			PaymentStatus: "hold",
		},
	}

	err = s.UpdateHotelService(bookID, updatedSer)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("update payment failed"), err
	}

	updatedCredit := model.User{
		Name:         payload.CardDetail.Name,
		Number:       payload.CardDetail.Number,
		Expiry:       payload.CardDetail.Expiry,
		SecurityCode: payload.CardDetail.SecurityCode,
	}
	err = s.UsersServiceIn.UpdateUser(payload.ClientID, updatedCredit)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("update creddit card failed"), err
	}

	return http.StatusCreated, nil, nil
}

func (s *BookingService) AcceptRejectBookHotel(payload types.SelectStatusPayload) error {
	bookID := payload.HotelServiceID
	if payload.Status == "rejected" {
		updatedSer := model.HotelService{
			ServiceInfo: types.ServiceInfo{
				Status: payload.Status,
			},
		}
		err := s.UpdateHotelService(bookID, updatedSer)
		if err != nil {
			fmt.Println(err.Error())
			return err
		}
		return nil
	}

	ser, err := s.GetBookingHotel(bookID)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	cost := ser.Price - 0.08*ser.Price
	profile, err := s.ProfileServiceIn.GetProfileByID(payload.ProfileID)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	payoutID, err := s.PaymentServiceIn.CreatePayout(cost, profile.PaypalEmail)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	updatedSer := model.HotelService{
		ServiceInfo: types.ServiceInfo{

			Status:        payload.Status,
			PayoutID:      payoutID,
			PaymentStatus: "completed",
		},
	}

	err = s.UpdateHotelService(bookID, updatedSer)
	if err != nil {
		return err
	}
	return nil
}

func (s *BookingService) ManageRefundBookHotel(payload types.RefundPayload) error {
	ser, err := s.GetBookingHotel(payload.HotelServiceID)
	if err != nil {
		return nil
	}

	if ser.Status == "accepted" {
		return s.cancelNotRefundBookHotel(payload.HotelServiceID)
	}

	if ser.Status == "rejected" {
		return s.refundBookHotel(ser, payload, ser.Status)
	}

	if ser.Status == "pending" {
		return s.refundBookHotel(ser, payload, "canceled")
	}
	return nil
}

func (s *BookingService) refundBookHotel(ser model.HotelService, payload types.RefundPayload, newStatus string) error {
	payoutID, err := s.PaymentServiceIn.CreatePayout(ser.Price, payload.PaypalEmail)
	if err != nil {
		return err
	}

	updatedSer := model.HotelService{
		ServiceInfo: types.ServiceInfo{
			Status:        newStatus,
			PaymentStatus: "refunded",
			PayoutID:      payoutID,
		},
	}
	err = s.UpdateHotelService(ser.ID, updatedSer)
	if err != nil {
		return err
	}

	updatedUser := model.User{
		PaypalEmail: payload.PaypalEmail,
	}
	err = s.UsersServiceIn.UpdateUser(payload.ClientID, updatedUser)
	if err != nil {
		return err
	}

	return nil
}

func (s *BookingService) cancelNotRefundBookHotel(id uint) error {
	updatedSer := model.HotelService{
		ServiceInfo: types.ServiceInfo{
			Status: "canceled",
		},
	}

	err := s.UpdateHotelService(id, updatedSer)
	if err != nil {
		return err
	}
	return nil
}

func (s *BookingService) calculatePriceService(startTime, endTime time.Time, cagePrice float32) (int, float32) {
	duration := endTime.Sub(startTime)
	days := int(duration.Hours() / 24)
	price := cagePrice * float32(days)
	return days, price
}

func (s *BookingService) ReviewHotelService(payload types.ReviewPayload) (int, error, error) {
	err := s.Validate.Struct(payload)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("review detail is not correct"), err
	}

	profile, err := s.ProfileServiceIn.GetProfileByID(payload.ProfileID)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("review detail is not correct"), err
	}

	count, err := s.ProfileServiceIn.CountCompleteBookByID(payload.ProfileID)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("review detail is not correct"), err
	}

	preAvg := float32(count) * profile.AvgReview
	newAvg := (preAvg + payload.ReviewRate) / (float32(count) + 1)

	payload.ReviewImage = utils.MapStringArrayToText(payload.ReviewImageArray)
	err = s.HotelServiceRepositoryIn.ReviewHotelService(payload, newAvg)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("review hotel service failed"), err
	}

	return http.StatusOK, nil, nil
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

func (s *BookingService) CheckAvailableBooking(payload types.BookAgainPayload) (bool, error, error) {
	if err := s.Validate.Struct(payload); err != nil {
		return false, fmt.Errorf("information is not correct"), err
	}

	startDate, err := time.Parse("2006-01-02", payload.StartTime)
	if err != nil {
		return false, fmt.Errorf("information is not correct"), err
	}

	endDate, err := time.Parse("2006-01-02", payload.EndTime)
	if err != nil {
		return false, fmt.Errorf("information is not correct"), err
	}

	strErr, err := utils.CheckInputDate(startDate, endDate)
	if err != nil {
		return false, strErr, err
	}
	if strErr != nil {
		return false, strErr, nil
	}

	_, err = s.HotelServiceRepositoryIn.CheckNotAvailableBooking(payload.CageID, startDate, endDate)
	// cage's available in selected date
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return true, nil, nil
	}
	if err != nil {
		return false, fmt.Errorf("selected date is not available"), err
	}

	return false, fmt.Errorf("selected date is not available"), nil
}

// role : hotel
func (s *BookingService) GetAllBookingHotelByHotel(profile_id uint, status string) ([]model.HotelService, error) {
	status = strings.ToLower(status)
	ser, err := s.HotelServiceRepositoryIn.GetAllHotelServiceByHotel(profile_id, status)
	if err != nil {
		return ser, err
	}

	for i := range ser {
		ser[i].CageRoom.ImageArray = utils.MapTextToStringArray(ser[i].CageRoom.Image)
		ser[i].CageRoom.FacilityArray = utils.MapTextToStringArray(ser[i].CageRoom.Facility)
	}

	return ser, nil
}

func (s *BookingService) GetBookingHotel(id uint) (model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetHotelService(id)
	if err != nil {
		return ser, err
	}

	ser.CageRoom.ImageArray = utils.MapTextToStringArray(ser.CageRoom.Image)
	ser.CageRoom.FacilityArray = utils.MapTextToStringArray(ser.CageRoom.Facility)
	return ser, nil
}

// role : client
func (s *BookingService) GetStatusBookingHotelByUser(user_id uint, status string) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetStatusBookingHotelByUser(user_id, status)
	if err != nil {
		return ser, err
	}

	for i := range ser {
		ser[i].CageRoom.ImageArray = utils.MapTextToStringArray(ser[i].CageRoom.Image)
		ser[i].CageRoom.FacilityArray = utils.MapTextToStringArray(ser[i].CageRoom.Facility)
	}

	return ser, nil
}

func (s *BookingService) GetAllHotelServiceByUser(user_id uint) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetAllHotelServiceByUser(user_id)
	if err != nil {
		return ser, err
	}

	for i := range ser {
		ser[i].CageRoom.ImageArray = utils.MapTextToStringArray(ser[i].CageRoom.Image)
		ser[i].CageRoom.FacilityArray = utils.MapTextToStringArray(ser[i].CageRoom.Facility)
	}

	return ser, nil
}

func (s *BookingService) GetReviewByHotel(profile_id uint) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetReviewByHotel(profile_id)
	if err != nil {
		return ser, err
	}

	for i := range ser {
		ser[i].ReviewImageArray = utils.MapTextToStringArray(ser[i].ReviewImage)
	}

	return ser, nil
}

// task
func (s *BookingService) GetAllBookingHotelByStatus(status string) ([]model.HotelService, error) {
	ser, err := s.HotelServiceRepositoryIn.GetAllBookingHotelByStatus(status)
	if err != nil {
		return ser, err
	}

	for i := range ser {
		ser[i].CageRoom.ImageArray = utils.MapTextToStringArray(ser[i].CageRoom.Image)
		ser[i].CageRoom.FacilityArray = utils.MapTextToStringArray(ser[i].CageRoom.Facility)
	}

	return ser, nil
}

// location, err := time.LoadLocation("Asia/Bangkok")
// if err != nil {
// 	return http.StatusInternalServerError, fmt.Errorf("failed to get current time in location"), err
// }

// currentTime := time.Now().In(location)
// // currentDay := time.Date(
// // 	currentTime.Year(),
// // 	currentTime.Month(),
// // 	currentTime.Day()+1,
// // 	0, 0, 0, 0, location,
// // )
// nextDay := time.Date(
// 	currentTime.Year(),
// 	currentTime.Month(),
// 	currentTime.Day()+1,
// 	0, 0, 0, 0, location,
// )
// // fmt.Println("reserve : ", ser.StartTime.In(location))
// // fmt.Println("next : ", nextDay)
// if (ser.StartTime.In(location)).Before(nextDay) {
// 	return http.StatusBadRequest, fmt.Errorf("failed to reserve past day and current day"), err
// }

// if (ser.EndTime).Before(ser.StartTime) {
// 	return http.StatusBadRequest, fmt.Errorf("end time must be after start time"), err
// }

// func (s *BookingService) UpdateHotelInfo(payload types.UpdateHotelPayload) (int, error) {
//     // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
//     err := s.Validate.Struct(payload)
//     if err != nil {
//         return http.StatusBadRequest, fmt.Errorf("invalid input: %v", err)
//     }

//     // ดึงข้อมูลโรงแรมเดิมจากฐานข้อมูล
//     existingHotel, err := s.HotelServiceRepositoryIn.GetHotelByID(payload.HotelID)
//     if err != nil {
//         return http.StatusNotFound, fmt.Errorf("hotel not found")
//     }

//     // อัปเดตเฉพาะฟิลด์ที่ส่งมา
//     updatedHotel := utils.CopyNonZeroFields(&payload, &existingHotel).(*model.Hotel)

//     // บันทึกข้อมูลที่อัปเดตลงฐานข้อมูล
//     err = s.HotelServiceRepositoryIn.UpdateHotel(*updatedHotel)
//     if err != nil {
//         return http.StatusInternalServerError, fmt.Errorf("failed to update hotel: %v", err)
//     }

//     return http.StatusOK, nil
// }
