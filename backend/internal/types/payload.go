package types

type LoginPayload struct {
	Email    string `json:"email" query:"email"`
	Password string `json:"password" query:"password"`
}

type BookingHotelPayload struct{}