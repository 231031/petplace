import { BookAgainPayload, BookingPayload, RefundPayload, ReviewPayload, SelectStatusPayload } from "@/types/payload";
import { RequestApi } from "./utils";

const baseApi = import.meta.env.VITE_BASEAPI;

export async function CheckAvailableCage(payload: BookAgainPayload): Promise<any> {
  try {
    let endpoint = `${baseApi}/hotel/client/again/${payload.cage_id}`;
    let queryParams = `?start_time=${payload.start_time}&end_time=${payload.end_time}`;

    endpoint = endpoint + queryParams;
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

export async function GetHotelServiceByID(serId: number): Promise<any> {
  try {
    let endpoint = `${baseApi}/hotel/${serId}`;
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

export async function BookHotelService(payload:BookingPayload): Promise<any> {
    try {
        const endpoint = `${baseApi}/hotel/client/booking`;
        return RequestApi(endpoint, "POST", payload, 201);
      } catch (error) {
        Promise.reject(error);
      } 
}

export async function AcceptRejectBookHotel(payload:SelectStatusPayload): Promise<any> {
    try {
        const endpoint = `${baseApi}/hotel/${payload.hotel_service_id}`;
        return RequestApi(endpoint, "PUT", payload, 200);

      } catch (error) {
        Promise.reject(error);
      } 
}

export async function ManageRefundBookHotel(payload:RefundPayload): Promise<any> {
    try {
        const endpoint = `${baseApi}/hotel/client/${payload.hotel_service_id}`;
        return RequestApi(endpoint, "PUT", payload, 200);
      } catch (error) {
        Promise.reject(error);
      } 
}

export async function ReviewHotelService(payload:ReviewPayload): Promise<any> {
    try {
        const endpoint = `${baseApi}/hotel/client/review/${payload.hotel_service_id}`;
        return RequestApi(endpoint, "PUT", payload, 200);

      } catch (error) {
        return Promise.reject(error);
      } 
}

