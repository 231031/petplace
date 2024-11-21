export interface UploadRes {
    filePath: string;
    accountId: string;
    fileUrl: string;
}

export interface ProfileRes {
    profile: Profile;
    token:   string;
}

export interface HotelService {
    id:                    number;
    start_time:            Date;
    end_time:              Date;
    CreatedAt:             Date;
    UpdatedAt:             Date;
    status:                string;
    payment_status:        string;
    price:                 number;
    detail:                string;
    payment_id:            string;
    payout_id:             string;
    review_rate:           number;
    review_detail:         string;
    cage_id:               number;
    animal_hotel_services: null;
    cage_room:             Cage;
}

export interface Cage {
    id:             number;
    profile_id:     number;
    quantity:       number;
    cage_type:      string;
    price:          number;
    detail:         string;
    image:          string;
    facility:       string;
    animal_type:    string;
    max_capacity:   number;
    lenth:          number;
    width:          number;
    height:         number;
    size:           string;
    hotel_services: HotelService[] | null;
    favorite_cages: null;
    profile:        Profile;
    image_array:    null;
    facility_array: null;
}

export interface Profile {
    id:                  number;
    user_id:             number;
    role:                string;
    payment:             string;
    paypal_email:        string;
    email:               string;
    tel:                 string;
    name:                string;
    address:             string;
    image:               string;
    image_profile:       string;
    facility:            string;
    detail:              string;
    longitude:           number;
    latitude:            number;
    check_in:            string;
    check_out:           string;
    avg_review:          number;
    cages:               Cage[] | null;
    service_details:     null;
    transport_categorys: null;
    merchandises:        null;
    animals:             null;
    sender_id:           null;
    receiver_id:         null;
    Distance:            number;
    image_array:         string[] | null;
    facility_array:      any[] | null;
}
