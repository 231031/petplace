import { User } from "@/types/model";
import { LoginPayload } from "@/types/payload";

const baseApi = import.meta.env.VITE_BASEAPI;
export async function LoginUser(loginPayload: LoginPayload): Promise<any> {
  try {
    const apiPath = baseApi + "/auth/login";
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginPayload),
    });
    const data = await response.json();
    if (response.status != 200) {
      return Promise.reject(data);
    }

    return Promise.resolve(data);
  } catch (error) {
    Promise.reject(error);
  }
}

// not test
export async function SignUpUser(payload: User): Promise<any> {
  try {
    const apiPath = baseApi + "/auth/signup";
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.status != 201) {
      return Promise.reject(data);
    }

    return Promise.resolve(data);
  } catch (error) {
    Promise.reject(error);
  }
}


