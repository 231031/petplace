import { BookingPayload, RefundPayload, ReviewPayload, SelectStatusPayload } from "@/types/payload";
import { RequestApi } from "./utils";

const baseApi = import.meta.env.VITE_BASEAPI;

// not test
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

