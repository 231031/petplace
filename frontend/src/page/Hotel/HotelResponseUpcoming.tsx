import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectStatusPayload } from "@/types/payload";
import { AcceptRejectBookHotel } from "@/helper/hotel";
function HotelResponseUpcoming() {
    // State to manage hotels data
    const [hotels, setHotels] = useState<any[] | null>(null);
    // State to manage error messages
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const baseApi = import.meta.env.VITE_BASEAPI;

    // Fetch upcoming hotel reservations when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("profileID");
        if (!id) {
            setError("User ID not found");
            console.log(error)
            return;
        }

        // Fetch upcoming hotel reservations
        fetch(`${baseApi}/hotel/${id}/pending`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((response) => {
                console.log("Response status:", response.status);
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then((data) => {
                console.log("API Response data:", data);
                console.log("First hotel object:", data[0]); // Log the structure of the hotel object

                if (data && Array.isArray(data)) {
                    setHotels(data);
                } else if (data && data.data) {
                    setHotels(data.data);
                } else {
                    setError("Not found data");
                }
            })
            .catch((error) => {
                if (error) {
                    return <div className="h-screen text-red-500">Error: {error}</div>;
                }
            })
    }, []);

    if (!hotels) {
        return <div>Loading...</div>;
    }

    // Format date to 'DD-MM-YYYY'
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    // Handle accept/reject booking
    const handleAcceptReject = async (hotelServiceId: number, status: "accepted" | "rejected") => {
        try {
            const token = localStorage.getItem("token");
            const profileId = localStorage.getItem("profileID");
            const profileName = localStorage.getItem("name");

            if (!profileId || !profileName || !token) {
                throw new Error("Required information not found");
            }

            const payload: SelectStatusPayload = {
                hotel_service_id: hotelServiceId,
                profile_id: parseInt(profileId),
                profile_name: profileName,
                status: status
            };

            const response = await AcceptRejectBookHotel(payload);

            if (!response.ok) {
                throw new Error(response || "Failed to update booking status");
            }

        } catch (error) {
            console.error("Error updating status:", error);
            if (error instanceof Error) {
                if (error.message === "Payment not completed") {
                    setError("Payment not completed");
                } else {
                    setError(error.message);
                }
            } else {
                setError("Failed to update status");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <h1 className="text-center text-2xl font-bold mt-10">Hotel Reservation</h1>
                <div className="pt-10 text-black max-w-screen-sm mx-auto">
                    <div className="bg-white grid grid-cols-4 gap-2 text-center p-2 rounded-md shadow-md">
                        <button className="h-10 rounded-md " onClick={() => navigate('/hotel/reservation/upcoming')}>Upcoming</button>
                        <button className="h-10 rounded-md " onClick={() => navigate('/hotel/reservation/accepted')}>Accepted</button>
                        <button className="h-10 rounded-md " onClick={() => navigate('/hotel/reservation/rejected')}>Rejected</button>
                        <button className="h-10 rounded-md " onClick={() => navigate('/hotel/reservation/passedby')}>Passed By</button>
                    </div>
                </div>
                <h2 className="max-w-screen-xl mx-auto text-2xl  mt-10">Upcoming</h2>
                <div className="pb-10">
                    {Array.isArray(hotels) && hotels.length > 0 ? (
                        <div>
                            {hotels
                                .filter(hotel => hotel.status === "pending")
                                .map((hotel: any, index: number) => (
                                    <div key={index} className="grid grid-cols-10 gap-4  mt-10 rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4 max-w-screen-xl mx-auto">
                                        <div className="col-span-2">
                                            {
                                                (hotel.cage_room.image_array.length > 0) ? (
                                                    <img
                                                        src={hotel.cage_room.image_array[0]}
                                                        className="w-full h-full max-h-56 object-cover object-center rounded-lg ml-5 "
                                                    />
                                                ) : (
                                                    <p>No image</p>
                                                )
                                            }
                                        </div>

                                        <div className="col-span-3  ml-5 mt-5">
                                            <h2 className="text-2xl font-medium">{hotel.cage_room.cage_type}</h2>
                                            <div className="space-x-2  text-lg">
                                                <h1 className="space-x-2 text-lg">
                                                    <span className="bg-size pl-2 pr-1">{hotel.cage_room.size}</span>
                                                    <span className="">Size</span>
                                                    <span>{hotel.cage_room.width} x</span>
                                                    <span>{hotel.cage_room.lenth} x</span>
                                                    <span>{hotel.cage_room.height}</span>
                                                </h1>
                                                <h2 className="text-lg">Accommodates: {hotel.cage_room.max_capacity}</h2>
                                                <h2 className="text-lg">Facility: {hotel.cage_room.facility}</h2>
                                            </div>
                                        </div>

                                        <div className="col-span-2 ml-5 mt-5 space-y-2">
                                            <h1 className="text-2xl font-medium">
                                                {hotel.animal_hotel_services[0].animal_user.name}
                                            </h1>
                                            <h1 className="flex items-center space-x-2">
                                                <span className="text-lg">Pet type:</span>
                                                <span>{hotel.animal_hotel_services[0].animal_user.animal_type}</span>
                                            </h1>
                                            <h2>
                                                <span className="text-lg">Age:</span>
                                                <span>{hotel.animal_hotel_services[0].animal_user.age}</span>
                                            </h2>
                                            <h2>
                                                <span className="text-lg">Pet breed:</span>
                                                <span>{hotel.animal_hotel_services[0].animal_user.breed}</span>
                                            </h2>
                                            <h2>
                                                <span className="text-lg">Weight:</span>
                                                <span>{hotel.animal_hotel_services[0].animal_user.weight}</span>
                                            </h2>
                                        </div>

                                        <div className="col-span-3 ml-5 mt-5 space-y-4">
                                            <div className="">
                                                <h1 className="ml-auto text-lg px-4 text-right">
                                                    Check in: {formatDate(hotel.start_time)}
                                                </h1>
                                                <h1 className="ml-auto text-lg px-4 text-right">
                                                    Check out: {formatDate(hotel.end_time)}
                                                </h1>
                                            </div>
                                            <h2 className="ml-auto text-right px-4 font-bold text-2xl">
                                                {hotel.price} ฿
                                            </h2>
                                            <div className="flex justify-end mt-auto mb-0 space-x-4 pt-2">
                                                <button
                                                    onClick={() => handleAcceptReject(hotel.id, "rejected")}
                                                    className=" bg-gray-100 px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleAcceptReject(hotel.id, "accepted")}
                                                    className="bg-button px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                                                >
                                                    Accept
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-center py-4">No upcoming hotel reservation information found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelResponseUpcoming;