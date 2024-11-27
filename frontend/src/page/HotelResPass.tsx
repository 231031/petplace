import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import star icons

function HotelResPass() {
    const [hotels, setHotels] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<boolean>(false);
    const [viewId, setViewId] = useState<number>(-1);
    const navigate = useNavigate();
    const [fullStars, setFullStars] = useState<number>(0);
    const [halfStar, sethalfStar] = useState<boolean>(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("profileID");

        if (!id) {
            setError("User ID not found");
            return;
        }


        Promise.all([
            fetch(`http://localhost:5000/api/hotel/${id}/completed`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }),
            fetch(`http://localhost:5000/api/hotel/${id}/cancel`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
        ])
            .then(([completedRes, cancelRes]) =>
                Promise.all([completedRes.json(), cancelRes.json()])
            )
            .then(([completedData, cancelData]) => {

                const combinedData = [
                    ...(Array.isArray(completedData) ? completedData : []),
                    ...(Array.isArray(cancelData) ? cancelData : [])
                ];
                setHotels(combinedData);
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

    function handleViewReview(id: number, review_rate: number) {
        setFullStars(Math.floor(review_rate))
        sethalfStar(review_rate % 1 >= 0.5);

        if (viewId === id) {
            setView(!view)
        } else {
            setView(true)
        }
        setViewId(id)

    }

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
                <h2 className="max-w-screen-xl mx-auto text-2xl  mt-10">Passed By</h2>
                <div className="pb-10">
                    {Array.isArray(hotels) && hotels.length > 0 ? (
                        <div>
                            {hotels
                                .filter(hotel => hotel.status === "completed" || hotel.status === "cancel")
                                .map((hotel: any, index: number) => (
                                    <div key={index} className="grid grid-cols-10 gap-4  mt-10 rounded-2xl shadow-lg shadow-egg border border-gray-300 p-4 max-w-screen-xl mx-auto">
                                        <div className="col-span-2">
                                            {
                                                (hotel.cage_room.image_array.lenght > 0) ? (
                                                    <p>no image</p>
                                                ) : (
                                                    <img
                                                        // src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                                                        src={hotel.cage_room.image_array[0]}
                                                        className="w-full h-full object-cover object-center rounded-lg ml-5 "
                                                    />
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
                                                {
                                                    (hotel.status === "completed" && parseFloat(hotel.review_rate) > 0) ? (
                                                        <button onClick={() => handleViewReview(hotel.id, hotel.review_rate)}
                                                            className="bg-button px-10 py-2 border rounded-2xl shadow-lg shadow-egg"
                                                        >
                                                            View Review
                                                        </button>
                                                    ) : (

                                                        (hotel.status === "rejected") ? (
                                                            <div className="pr-2" >
                                                                <p className="font-medium">Rejected</p>
                                                            </div>
                                                        ) : (
                                                            <div className="pr-2" >
                                                                <p className="font-medium">Not Have Review</p>
                                                            </div>
                                                        )

                                                    )
                                                }
                                            </div>

                                        </div>
                                        {
                                            (view && viewId === hotel.id) ? (
                                                <div className="col-span-10 ml-5 border-t border-gray-500 pt-2 justify-items-end">
                                                    <h1 className="text-medium text-lg font-medium">Review Rate</h1>
                                                    <div className="flex items-center">
                                                        {Array(fullStars)
                                                            .fill(0)
                                                            .map((_, i) => (
                                                                <FaStar key={`full-${i}`} className="text-[#A08252]" />
                                                            ))}

                                                        {halfStar && <FaStarHalfAlt className="text-[#A08252]" />}
                                                    </div>
                                                    <h1 className="text-medium text-lg font-medium">Review Detail</h1>
                                                    <h1 className="text-medium text-lg flex">
                                                        {hotel.review_detail}
                                                    </h1>
                                                </div>
                                            ) : (
                                                <div className="review">
                                                </div>
                                            )
                                        }

                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-center py-4">No passed by hotel reservation information found.</div>
                    )}
                </div>
            </div >
        </div >
    );
}

export default HotelResPass;