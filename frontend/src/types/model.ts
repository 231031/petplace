export interface CageRoom {
    animal_type:    string;
    cage_type:      string;
    detail?:         string;
    facility?:       string;
    facility_array: string[];
    height:         number;
    image?:          string;
    image_array:    string[];
    lenth:          number;
    max_capacity:   number;
    price:          number;
    profile_id:     number;
    quantity:       number;
    size:           string;
    width:          number;
    id?: number;
}


export interface User {
    age: number;
    citizen_id: string;
    email: string;
    expiry?: string;
    first_name: string;
    name?: string;
    number?: string;
    password: string;
    paypal_email?: string;
    security_code?: string;
    surename: string;
    id? :number;
}

export interface Profile {
    id? :number;
    address:        string;
    avg_review?:     number;
    check_in:       string;
    check_out:      string;
    email?:          string;
    facility?:       string;
    facility_array?: string[];
    image?:          string;
    image_array?:    string[];
    latitude:       number;
    longitude:      number;
    name:           string;
    payment?:        string;
    paypal_email:   string;
    role:           string;
    tel:            string;
    user_id:        number;
}

