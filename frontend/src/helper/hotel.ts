import { BookingPayload, RefundPayload, SelectStatusPayload } from "@/types/payload";

const baseApi = import.meta.env.VITE_BASEAPI;

// not test
export async function BookHotelService(payload:BookingPayload): Promise<any> {
    try {
        const endpoint = baseApi + "/hotel/client/booking";
        return RequestApi(endpoint, "POST", payload, 201);
      } catch (error) {
        Promise.reject(error);
      } 
}

export async function AcceptOrRejectBooking(payload:SelectStatusPayload): Promise<any> {
    try {
        const endpoint = baseApi + "/hotel/" + payload.hotel_service_id.toString();
        return RequestApi(endpoint, "PUT", payload, 200);
      } catch (error) {
        Promise.reject(error);
      } 
}

export async function AcceptRejectBookHotel(payload:SelectStatusPayload): Promise<any> {
    try {
        const endpoint = baseApi + "/hotel/" + payload.hotel_service_id.toString();
        return RequestApi(endpoint, "PUT", payload, 200);

      } catch (error) {
        Promise.reject(error);
      } 
}

export async function ManageRefundBookHotel(payload:RefundPayload): Promise<any> {
    try {
        const endpoint = baseApi + "/hotel/client/" + payload.hotel_service_id.toString();
        return RequestApi(endpoint, "PUT", payload, 200);
      } catch (error) {
        Promise.reject(error);
      } 
}

export async function ReviewHotelService(payload:RefundPayload): Promise<any> {
    try {
        const endpoint = baseApi + "/hotel/client/" + payload.hotel_service_id.toString();
        return RequestApi(endpoint, "PUT", payload, 200);

      } catch (error) {
        return Promise.reject(error);
      } 
}

async function RequestApi(endpoint:string, method:string, payload: any, checkStatus: number): Promise<any> {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(endpoint, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.status != checkStatus) {
          return Promise.reject(data);
        }
    
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
}