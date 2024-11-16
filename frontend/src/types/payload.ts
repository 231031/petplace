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
