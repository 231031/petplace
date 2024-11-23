import { AnimalUserPayload } from "@/types/payload";
import { RequestApi } from "./utils";

const baseApi = import.meta.env.VITE_BASEAPI;

export async function GetAnimalByID(animal_user_id:number): Promise<any> {
    try {
        let endpoint = `${baseApi}/user/animal/${animal_user_id}`
        const token = localStorage.getItem("token");

        const response = await fetch(endpoint, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.status != 200) {
          return Promise.reject(data);
        }
    
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
}

export async function GetAllAnimalByUserID(user_id:number): Promise<any> {
    try {
        let endpoint = `${baseApi}/user/animals/${user_id}`
        const token = localStorage.getItem("token");

        const response = await fetch(endpoint, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.status != 200) {
          return Promise.reject(data);
        }
    
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
}

export async function GetTypeAnimalByUserID(user_id:number, animal_type:string): Promise<any> {
    try {
        let endpoint = `${baseApi}/user/animal/${user_id}/${animal_type}`
        const token = localStorage.getItem("token");

        const response = await fetch(endpoint, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.status != 200) {
          return Promise.reject(data);
        }
    
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
}

export async function AddAnimalsUser(animals: AnimalUserPayload[]): Promise<any> {
    try {
        let endpoint = `${baseApi}/user/animals`
        return RequestApi(endpoint, "POST", animals, 201);
      } catch (error) {
        return Promise.reject(error);
      }
}