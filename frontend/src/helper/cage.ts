import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { MapArrayToQuery, RequestApi } from "./utils";
import { CageRoom } from "@/types/model";
import { BASE_API } from "@/config/config";

export async function GetSearchCage(
  filterAnimal: FilterAnimal[],
  filterSearchCage: any
): Promise<any> {
  try {
    let apiPath = BASE_API + "/cageroom/search?";
    let queryParams = "";

    queryParams = MapArrayToQuery(filterAnimal, filterSearchCage);
    apiPath = apiPath + queryParams;
    const token = localStorage.getItem("token");
    const response = await fetch(apiPath, {
      headers: { authorization: `Bearer ${token}` },
    });
    // console.log("Response:", response);
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
  user_id: number
): Promise<any> {
  try {
    let apiPath =
      BASE_API +
      "/cageroom/search/" +
      user_id.toString() +
      "/" +
      profile_id.toString() +
      "?";
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

export async function UpdateCage(cage: CageRoom): Promise<any> {
  try {
    let endpoint = `${BASE_API}/cageroom/${cage.id}`;
    return RequestApi(endpoint, "PUT", cage, 200);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function RemoveCage(cage: CageRoom): Promise<any> {
  try {
    let endpoint = `${BASE_API}/cageroom/${cage.id}`;
    return RequestApi(endpoint, "DELETE", cage, 200);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function mapCageSize(max_capacity: number): string {
  if (max_capacity >= 1 && max_capacity <= 2) {
    return "s";
  } else if (max_capacity >= 3 && max_capacity <= 4) {
    return "m";
  } else if (max_capacity >= 5 && max_capacity <= 6) {
    return "l";
  } else if (max_capacity >= 7) {
    return "xl";
  }

  return "";
}
