import { FavPayload } from "@/types/payload";
import { RequestApi } from "./utils";

const baseApi = import.meta.env.VITE_BASEAPI;

export async function GetAllFavCageByUserID(user_id:number): Promise<any> {
    try {
        let endpoint = `${baseApi}/user/fav/${user_id}`
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

export async function AddFavCage(fav: FavPayload): Promise<any> {
    try {
        let endpoint = `${baseApi}/user/fav`
        return RequestApi(endpoint, "POST", fav, 201);
      } catch (error) {
        return Promise.reject(error);
      }
}