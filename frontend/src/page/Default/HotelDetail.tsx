import { useLocation, useNavigate } from "react-router-dom";
import { CarouselDemo } from "../components/HotelHome/CarousalDemo";
import { CarouselCage } from "../components/HotelHome/CarousalCage";
import { useEffect, useRef, useState } from 'react';
import { Cage } from "@/types/response";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AddFavCage } from "@/helper/user";

function HotelDetail() {
    const navigate = useNavigate();
    const hotelRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);
    const facilityRef = useRef<HTMLDivElement>(null);
    const roomRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const hotel = location.state?.selectedHotel;
    const startDate = location.state?.startDate || '';
    const endDate = location.state?.endDate || '';

    // Handle adding a cage to favorites
    const handleAddFavorite = async (cage: Cage) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("You need to log in to add favorites.");
            return;
        }

        const favPayload = {
            cage_id: cage.id,
            user_id: Number(userId),
        };

        try {
            const response = await AddFavCage(favPayload);
        } catch (error) {
            console.error("Error adding to favorites:", error);
            alert("Failed to add cage to favorites. Please try again.");
        }
    };

    // Handle cage selection and navigate to booking detail page
    const handleCageSelect = (cage: Cage) => {
        const queryParams = new URLSearchParams({
            size: cage.size,
            width: cage.width.toString(),
            height: cage.height.toString(),
            lenth: cage.lenth.toString(),
            cage_type: cage.cage_type,
            facility: cage.facility,
            price: cage.price.toString(),
            animal_type: cage.animal_type,
            max_capacity: cage.max_capacity.toString(),
            startDate: startDate,
            endDate: endDate,
        }).toString();

        navigate(`/hotelbookdetail?${queryParams}`, {
            state: {
                selectedCage: cage,
                selectedHotel: location.state?.selectedHotel,
                profile_name: location.state?.profile_name,
                startDate: startDate,
                endDate: endDate
            }
        });
    };

    const id = localStorage.getItem("userId");
    const [review, setReview] = useState({});
    const profile_id = hotel.id;

    // Fetch hotel reviews
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/hotel/review/${profile_id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch cage room data");
                return response.json();
            })
            .then((data) => {
                setReview(data || []); // store room data state
            })
            .catch((error) => console.error("Error fetching cage room data:", error));
    }, []);

    const [distance, setDistance] = useState(null); // to store the calculated distance

    // Get user's current location and calculate distance to hotel
    useEffect(() => {
        if (hotel.latitude && hotel.longitude) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    // Haversine formula to calculate the distance
                    const toRad = (value: number) => value * (Math.PI / 180); // Convert degrees to radians

                    const lat1 = toRad(userLat);
                    const lon1 = toRad(userLon);
                    const lat2 = toRad(hotel.latitude);
                    const lon2 = toRad(hotel.longitude);

                    const dLat = lat2 - lat1;
                    const dLon = lon2 - lon1;

                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const R = 6371; // Earth radius in kilometers
                    const distance = R * c; // Distance in kilometers
                    setDistance(distance); // Store the distance
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, [hotel.latitude, hotel.longitude]);

    // Scroll to a specific section
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
    const [expandedRoomId, setExpandedRoomId] = useState<number | null>(null);

    // Handle room click to expand/collapse details
    const handleRoomClick = (index: number) => {
        setSelectedRoomIndex(prevIndex => prevIndex === index ? null : index);
        setExpandedRoomId((prev) => (prev === index ? null : index));
    };

    return (
        <div className="flex justify-center bg-bg  pb-10">
            <div className="flex w-3/4 items-center flex-col gap-y-10 bg-bg">
                {/* Section 1: Navigation Buttons */}
                <div className="pt-10 text-black">
                    <div className="bg-white grid grid-cols-5 gap-1 p-2 rounded-md shadow-md">
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(hotelRef)} >Hotel</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(detailRef)}>Detail</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(facilityRef)}>Facility</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(roomRef)}>Room</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(reviewRef)}>Review</button>
                    </div>
                </div>
                <div></div>
                <div className="flex flex-col w-full h-[36rem]  gap-y-5 ">
                    <h1 ref={hotelRef} id="hotel" className="text-4xl">{hotel.name}</h1>
                    <div className="flex justify-center">
                        <CarouselDemo images={hotel.image_array || []} />
                    </div>
                </div>
                {/* Section 2: Hotel Details and Map */}
                <div className="flex w-full h-72 mt-10">
                    {/* Detail */}
                    <div className="flex flex-col gap-y-5 w-full  ">
                        <h1 ref={detailRef} id="detail" className="text-2xl">Detail</h1>
                        <div className="flex flex-col mr-5 bg-bg gap-y-5 p-5 rounded-xl shadow shadow-gray-400">
                            <p>
                                {hotel.detail}
                            </p>
                            <div>
                                {/* <p>Check in {selectedHotel.check_in}</p> */}
                                {/* <p>Check out {selectedHotel.check_out}</p> */}
                            </div>
                        </div>
                    </div>
                    {/* Map */}
                    <div className="flex flex-col w-3/12 gap-y-5 pl-5">
                        <h1 className="text-2xl"> Map</h1>
                        <div className="bg-bg rounded-xl flex flex-col h-64 shadow shadow-gray-400 p-2">
                            {hotel.latitude && hotel.longitude ? (
                                <MapContainer
                                    center={[hotel.latitude, hotel.longitude]}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[hotel.latitude, hotel.longitude]}>
                                        <Popup>{hotel.name}</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <p className="text-center mt-10">Location data not available.</p>
                            )}
                            <div>
                                <p>{hotel.address}</p>
                                <p>Distance: {distance ? distance.toFixed(2) : "Loading..."}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 3: Facilities */}
                <div className="flex flex-col w-full gap-y-5 pb-5">
                    <h1 ref={facilityRef} id="facility" className="text-2xl"> Facility</h1>
                    <div className="flex gap-x-2">
                        {hotel.facility_array && hotel.facility_array.length > 0 ? (
                            hotel.facility_array.map((facility: string, index: number) => (
                                <button
                                    key={index}
                                    className="w-32 h-12 bg-bg rounded-md shadow shadow-gray-400"
                                >
                                    {facility}
                                </button>
                            ))
                        ) : (
                            <p>No facilities available.</p>
                        )}
                    </div>
                </div>
                {/* Section 4: Cages */}
                <div className="flex flex-col w-full ">
                    <h1 ref={roomRef} id="room" className="text-2xl mb-5">Cage</h1>
                    <div className="flex flex-col">
                        <div className="flex w-full h-full flex-col shadow shadow-gray-400 rounded-md pb-5">
                            {/* Room container */}
                            {hotel.cages ? (
                                <div>
                                    {hotel.cages.map((cage: Cage, index: number) => (
                                        <div className="flex flex-col">
                                            <div key={index}
                                                className={`flex h-60 mx-5 mt-5 p-3 shadow shadow-gray-400 h-80 ${selectedRoomIndex === index
                                                    ? 'rounded-t-md  shadow-tl shadow-tr shadow-bl shadow-br shadow-gray-400'  // Rounded corners only at the top and shadow around except bottom
                                                    : 'rounded-md shadow shadow-gray-400 '  // Rounded corners all around initially
                                                    }`}
                                            >
                                                <div className="basis-1/3 bg-cover h-full w-72 pt-5 pl-5 "  >
                                                    <CarouselCage images={Array.isArray(cage.image) ? cage.image : cage.image ? [cage.image] : []} />
                                                </div>
                                                <div className="basis-1/3  flex flex-col space-y-5 pl-5 pt-4 cursor-pointer "
                                                    onClick={() => handleRoomClick(index)}
                                                >
                                                    <h1 className="text-2xl font-semibold">{cage.cage_type} : {cage.animal_type}</h1>
                                                    <div>
                                                        <div className="flex flex-col gap-y-5">
                                                            <div className="flex gap-2 ">
                                                                <p className="bg-yellow text-center font-bold w-10 p-1">{cage.size}</p>
                                                                <p className="flex items-center">Size {cage.height} X {cage.width} X {cage.lenth} </p>
                                                            </div>
                                                            <p>Accommodates: {cage.max_capacity}</p>
                                                            <p>Facility: {cage.facility}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="basis-1/3  space-y-5 pl-5 pt-4 flex flex-col items-end pr-5 gap-y-5">
                                                    <h1 className="text-2xl font-semibold">{cage.price}$</h1>
                                                    <p>free cancel before 1 week</p>
                                                    <div className="flex space-x-2">
                                                        <button className="w-fit px-2 h-8 bg-bg rounded-full shadow" onClick={() => handleAddFavorite(cage)}>Add Favorite</button>
                                                        <button className="w-fit px-2 h-8  rounded-full bg-yellow hover:bg-navbar" onClick={() => handleCageSelect(cage)}>Book now</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {expandedRoomId === index && (
                                                <div className=" bg-bg flex h-fit w-full  ">
                                                    <div className="flex w-full mx-5 bg-bg shadow shadow-gray-400  rounded-b-lg ">
                                                        <div className="w-4/12 bg-bg mr-4"></div>
                                                        <div>
                                                            <p className=" p-2 text-xl"> Detail</p>
                                                            <div className="flex p-2 "> {cage.detail}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No cages available</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Section 5: Reviews */}
                <div className="flex flex-col bg-bg w-full mt-10">
                    <div className="flex space-x-5">
                        <h1 ref={reviewRef} id="review" className="text-2xl">Review</h1>
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={` text-2xl`}>
                                {i < Math.floor(hotel.avg_review) ? (
                                    <i className="fa-sharp fa-solid fa-star " style={{ color: "#DBA54D" }} ></i> // Full star
                                ) : i < hotel.avg_review ? (
                                    <i className="fa-solid fa-star-half-alt 0" style={{ color: "#DBA54D" }}></i> // Half star
                                ) : (
                                    <i className="fa-regular fa-star" style={{ color: "#DBA54D" }}  ></i> // Empty star
                                )}
                            </span>
                        ))}
                    </div>
                    <div className="shadow shadow-gray-400 rounded-md mt-5 ">
                        {review && Array.isArray(review) && review.length > 0 ? (
                            review.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col h-auto m-5 p-3 bg-bg rounded-md shadow shadow-gray-400 gap-y-5 "
                                >
                                    <div className="flex">
                                        <div className="flex  gap-x-2 flex-col w-8/12 ">
                                            <h1 className="text-xl font-bold">Name: {review[index].animal_hotel_services[0].animal_user.user.first_name}</h1>
                                            <div className="flex gap-x-2">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <span key={i} className={`text-yellow-500 text-lg`}>
                                                        {i < Math.floor(item.review_rate) ? (
                                                            <i className="fa-solid fa-star " style={{ color: "#DBA54D" }} ></i> // Full star
                                                        ) : i < item.review_rate ? (
                                                            <i className="fas fa-star-half-alt 0" style={{ color: "#DBA54D" }}></i> // Half star
                                                        ) : (
                                                            <i className="fa-regular fa-star" style={{ color: "#DBA54D" }}  ></i> // Empty star
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mr-4 ">{item.review_detail || " At {hotel.name}, we believe your pets deserve a vacation too Our pet hotel offers a safe, comfortable, and enriching environment for your furry family members, with amenities designed specifically for both cats and dogs."}</p>
                                        </div>
                                        <div className="flex flex-col  w-4/12 justify-end h-full">
                                            <div className="flex ">
                                                <div className="m-1 text-white text-sm p-2 bg-onstep rounded-lg flex justify-center w-fit h-fit ">
                                                    {review[index].cage_room.animal_type}
                                                </div>
                                                <div className=" m-1 text-onstep text-sm p-2 bg-egg rounded-lg flex justify-center  w-fit h-fit">
                                                    {review[index].cage_room.cage_type}
                                                </div>
                                            </div>
                                            <div className="mt-2 mb-10">
                                                <CarouselCage images={review[index].review_image_array || []} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center p-5">No reviews available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelDetail;