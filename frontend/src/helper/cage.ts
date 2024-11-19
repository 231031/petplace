import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { MapArrayToQuery } from "./utils";

const baseApi = import.meta.env.VITE_BASEAPI;

export async function GetSearchCage(
  filterAnimal: FilterAnimal[],
  filterSearchCage: FilterSearchCage
): Promise<any> {
  try {
    let apiPath = baseApi + "/cageroom/search?";
    let queryParams = "";

    queryParams = MapArrayToQuery(filterAnimal, filterSearchCage);
    apiPath = apiPath + queryParams;

    const token = localStorage.getItem("token");
    const response = await fetch(apiPath, {
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

export async function GetSearchCageByHotel(
  filterAnimal: FilterAnimal[],
  filterSearchCage: FilterSearchCage,
  profile_id: number,
  user_id: number,
): Promise<any> {
  try {
    let apiPath = baseApi + "/cageroom/search/" + user_id.toString() + "/" + profile_id.toString() + "?";
    let queryParams = "";

    queryParams = MapArrayToQuery(filterAnimal, filterSearchCage);
    apiPath = apiPath + queryParams;

    const token = localStorage.getItem("token");
    const response = await fetch(apiPath, {
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


