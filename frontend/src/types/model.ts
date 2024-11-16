export interface CageRoom {
    id: number;
    profile_id: number;
    quantity: number;
    price: number;
    width: number;
    length: number;
    height: number;
    animal_type: string;
    max_capacity: number;
    cage_type: string;
    facility_array?: string[];
    image_array?: string[];
}

export interface User {
    age: number;
    citizen_id: string;
    email: string;
    expiry?: string;
    first_name: string;
    id?: number;
    name?: string;
    number?: string;
    password: string;
    paypal_email?: string;
    security_code?: string;
    surename: string;
}
