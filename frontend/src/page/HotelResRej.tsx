import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function HotelResRej() {
    const [hotels, setHotels] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();



    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("profileID");

        console.log("Token:", token);
        console.log("ProfileID:", id);

        if (!id) {
            setError("User ID not found");
            return;
        }


        fetch(`http://localhost:5000/api/hotel/${id}/rejected`, {
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

                if (data && Array.isArray(data)) {
                    setHotels(data);
                } else if (data && data.data) {
                    setHotels(data.data);
                } else {
                    setError("ไม่พบข้อมูลที่ต้องการ");
                }
            })
            .catch((error) => {
                console.error("Error fetching hotel data:", error);
                setError(error.message);
            });
    }, []);
    if (error) {
        return <div className="h-screen text-red-500">Error: {error}</div>;
    }

    console.log("hotelServiceUsers", hotels)
    console.log("Hotel data in ResCard:", hotels);

    if (!hotels) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
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
                <h2 className="max-w-screen-xl mx-auto text-2xl  mt-10">Rejected</h2>
                <div className="pb-10">
                    {Array.isArray(hotels) && hotels.length > 0 ? (
                        <div>
                            {hotels
                                .filter(hotel => hotel.status === "rejected")
                                .map((hotel: any, index: number) => (
                                    <div key={index} className="grid grid-cols-10 gap-4  mt-10 rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4 max-w-screen-xl mx-auto">
                                        <div className="col-span-2">
                                            <img
                                                src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                                                className="w-full h-full object-cover object-center rounded-lg ml-5 "
                                            />
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
                                                    className="bg-button px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                                                >
                                                    Cancels
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-center py-4">No rejected hotel reservation information found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelResRej;