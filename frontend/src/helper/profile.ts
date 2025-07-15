import { Profile } from "@/types/model";
import { ProfileRes } from "@/types/response";
import { RequestApi } from "./utils";
import { BASE_API } from "@/config/config";

export async function GetProfileByID(
  user_id: number,
  role: string
): Promise<ProfileRes> {
  try {
    let endpoint = `${BASE_API}/profile/${user_id}/${role}`;
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

export async function UpdateProfile(profile: Profile): Promise<any> {
  try {
    let endpoint = `${BASE_API}/profile/${profile.id}`;
    return RequestApi(endpoint, "PUT", profile, 200);
  } catch (error) {
    return Promise.reject(error);
  }
}
