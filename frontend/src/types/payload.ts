export interface FilterAnimal {
    animal_type: string;
    cage_size: string;
}

export interface FilterSearchCage {
  longitude: string;
  latitude: string;
  start_time: string;
  end_time: string;
  sort?: string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface BookingPayload {
  animals:      number[];
  cage_id:      number;
  card_detail:  CardDetail;
  client_id:    number;
  client_name:  string;
  detail?:       string;
  end_time:     string;
  profile_id:   number;
  profile_name: string;
  start_time:   string;
}

export interface CardDetail {
  expiry:        string;
  name:          string;
  number:        string;
  security_code: string;
}

export interface SelectStatusPayload {
  hotel_service_id: number;
  profile_id:       number;
  profile_name:     string;
  status:           string;
}

export interface RefundPayload {
  client_id:        number;
  hotel_service_id: number;
  paypal_email:     string;
}


