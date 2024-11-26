import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { MapArrayToQuery, RequestApi, UpdateImageArray } from "./utils";
import { CageRoom } from "@/types/model";
import { UploadRes } from "@/types/response";

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

export async function UpdateCage(cage:CageRoom): Promise<any> {
  try {
      let endpoint = `${baseApi}/cageroom/${cage.id}`;
      // if (newImages.length > 0) {
      //   cage.image_array = UpdateImageArray(newImages, cage.image_array, cage.image)
      // }
      return RequestApi(endpoint, "PUT", cage, 200);

    } catch (error) {
      return Promise.reject(error);
    }
}


