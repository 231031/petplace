import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CarouselDemo } from "../components/HotelHome/CarousalDemo";
import { CarouselCage } from "../components/HotelHome/CarousalCage";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function HotelHome() {
    const navigate = useNavigate();
    const [hotel, setHotel] = useState({
        name: "",
        email: "",
        check_in: "",
        check_out: "",
        facility_array: "",
        avg_review: "",
        image_array: [],
        latitude: null,
        longitude: null,
        address: "",
    }
    );
    const id = localStorage.getItem("userId");
    const profileId = localStorage.getItem("profile_id");

    const [rooms, setRooms] = useState({
        quantity: "",
        width: "",
        height: "",
        lenth: "",
        // size: "",


    });

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        const token = localStorage.getItem("token");

        fetch(`http://localhost:5000/api/profile/${id}/hotel`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then((data) => {
                console.log("Fetched hotel data:", data.profile);
                setHotel(data.profile) // ตรวจสอบข้อมูลที่ดึงมาจาก API
                localStorage.setItem("profile_id", data.profile.id)
                localStorage.setItem("token", data.token)
                localStorage.setItem("role", data.profile.role)

                const profileID = data.profile.id
                localStorage.setItem("profileID", profileID)
                localStorage.setItem("name", data.profile.name)
                localStorage.setItem("data", data.profile)
            })
            .catch((error) => console.error("Error fetching hotel data:", error));
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

    // console.log(id)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (profileId) {
            fetch(`http://localhost:5000/api/cageroom/all/${profileId}`, {
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
                    console.log("Fetched cage room data:", data);
                    // console.log("Fetched cage room data:", data.address);
                    setRooms(data || []); // เก็บข้อมูลห้องใน state
                })
                .catch((error) => console.error("Error fetching cage room data:", error));
        }
    }, [hotel]);

    const [review, setReview] = useState()


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (profileId) {
            fetch(`http://localhost:5000/api/hotel/review/${profileId}`, {
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
                    console.log("Fetched hotel review data:", data);
                    // console.log("Fetched cage room data:", data.address);
                    setReview(data || []); // เก็บข้อมูลห้องใน state
                })
                .catch((error) => console.error("Error fetching cage room data:", error));
        }
    }, [hotel]);

    console.log("cages", rooms)


    // console.log("hotel data", hotel.facility[])

    const [expandedRoomId, setExpandedRoomId] = useState<number | null>(null);

    const toggleRoomDetails = (index: number) => {
        setExpandedRoomId((prev) => (prev === index ? null : index));
    };

    const [hiddenRooms, setHiddenRooms] = useState<Set<number>>(new Set());

    const toggleRoomVisibility = (index: number) => {
        setHiddenRooms((prevHiddenRooms) => {
            const newHiddenRooms = new Set(prevHiddenRooms);
            if (newHiddenRooms.has(index)) {
                newHiddenRooms.delete(index); // ถ้าห้องถูกกดแล้วจะทำการแสดงใหม่
            } else {
                newHiddenRooms.add(index); // ถ้าห้องยังไม่ถูกกด จะทำการซ่อน
            }
            return newHiddenRooms;

        });

        setSelectedRoomIndex(prevIndex => prevIndex === index ? null : index);
    };

    const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);

    const handleRoomClick = (index: number) => {
        // Toggle the selected room index
        setSelectedRoomIndex(prevIndex => prevIndex === index ? null : index);
        setExpandedRoomId((prev) => (prev === index ? null : index));

    };




    return (
        <div className="flex justify-center bg-bg  pb-10">
            <div className="flex w-3/4 items-center flex-col gap-y-2 bg-bg">
                {/* section1 */}
                <div className="pt-10 space-x-1 text-white">
                    <button className="bg-nextstep border shadow-lg h-10 w-20 rounded-md">View</button>
                    <button
                        className="bg-[#FFFBF5] border shadow-lg h-10 w-20 rounded-md text-navbar"
                        onClick={() => navigate('/hotel/edit')}
                    // onClick={() => navigate('hotel/edit', { state: { hotels: results } })}
                    >
                        Edit
                    </button>
                </div>
                <div className="flex flex-col w-full h-[36rem] gap-y-5 ">
                    <h1 className="text-4xl ml-1">{hotel.name}</h1>
                    <div className="flex justify-center">
                        <CarouselDemo images={hotel.image_array || []} />
                    </div>

                </div>
                {/* section2 */}
                <div className="flex w-full h-72 mt-10">
                    {/* detail */}
                    <div className="flex flex-col gap-y-5 w-full ">
                        <h1 className="text-2xl"> Detail</h1>
                        <div className="flex flex-col mr-5 bg-bg gap-y-5 p-5 rounded-xl shadow shadow-gray-400">
                            <p>
                                {hotel.detail}

                            </p>
                            <div>
                                <p>Check in {hotel.check_in}</p>
                                <p>Check out {hotel.check_out}</p>
                            </div>
                        </div>
                    </div>
                    {/* map */}
                    <div className="flex flex-col w-3/12 gap-y-5 pl-5">
                        <h1 className="text-2xl"> Map</h1>
                        <div className="bg-bg rounded-xl flex flex-col h-64 shadow shadow-gray-400 p-2 ">
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
                            <div className="pt-1">
                                <p>{hotel.address}</p>
                                <p> Distance: {distance ? distance.toFixed(2) : "Loading..."} Km</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* section3 */}
                <div className="flex flex-col w-full gap-y-5 pb-5">
                    <h1 className="text-2xl"> Facility</h1>
                    <div className="flex gap-x-2 flex-wrap">
                        {hotel.facility_array && hotel.facility_array.length > 0 ? (
                            hotel.facility_array.map((facility, index) => (
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
                {/* section4 */}
                <div className="flex flex-col w-full ">
                    <h1 className="text-2xl mb-5">Cage</h1>
                    <div className="flex flex-col">
                        {/* selection */}
                        {/* <div className="flex justify-end gap-x-2 my-2">
                            <button className="w-16 h-8 bg-navbar rounded-md text-xs">Cat</button>
                            <button className="w-16 h-8 bg-yellow rounded-md text-xs">Rabbit</button>
                            <button className="w-16 h-8 bg-yellow rounded-md text-xs">Hamster</button>
                        </div> */}

                        <div className="flex bg-bg w-full h-full  flex-col shadow shadow-gray-400 rounded-md pb-5" >
                            {/* room container */}
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <div className=" flex flex-col">
                                        <div
                                            key={index}
                                            className={`flex h-60 mx-5 mt-5 p-3 shadow shadow-gray-400 h-80 ${selectedRoomIndex === index
                                                ? 'rounded-t-md  shadow-tl shadow-tr shadow-bl shadow-br shadow-gray-400'  // มุมโค้งเฉพาะด้านบนและเงารอบๆ ยกเว้นด้านล่าง
                                                : 'rounded-md shadow shadow-gray-400 '  // มุมโค้งรอบๆ ทุกด้านตอนแรก
                                                }`}
                                        // onClick={() => handleRoomClick(index)}
                                        // onClick={() => handleRoomClick(index)}
                                        >
                                            <div
                                                className="basis-1/3 bg-cover  w-72  pt-5 pl-5">
                                                <CarouselCage images={room.image_array || []} />
                                            </div>
                                            <div className="basis-1/3 flex flex-col space-y-5 pl-5 pt-4 cursor-pointer"
                                                onClick={() => handleRoomClick(index)}
                                            >
                                                <h1 className="text-2xl font-semibold">{room.cage_type || "Room"}</h1>
                                                <div className="flex flex-col gap-y-5 text-xl ">
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-center font-bold bg-yellow p-1 w-10"> {room.size} </p>
                                                        <p>Size {room.height} X {room.width} X {room.lenth} </p>
                                                    </div>

                                                    <p>Capacity: {room.quantity || "N/A"}</p>
                                                    <p>Facility: {room.facility || "Standard facilities"}</p>
                                                </div>
                                            </div>
                                            <div className="basis-1/3 space-y-5 pl-5 pt-4 flex flex-col items-end pr-5 gap-y-5">
                                                <h1 className="text-2xl font-semibold">{room.price}$</h1>
                                                <p>Free cancel before {new Date().toLocaleDateString()}</p>

                                            </div>

                                        </div>
                                        {expandedRoomId === index && (
                                            <div className=" bg-bg flex h-fit w-full  ">
                                                <div className="flex w-full mx-5 bg-bg shadow shadow-gray-400  rounded-b-lg ">
                                                    <div className="w-4/12 bg-bg mr-4"></div>
                                                    <div>
                                                        <p className=" p-2 text-xl"> Detail</p>
                                                        <div className="flex p-2 "> {room.detail}</div>
                                                    </div>

                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="p-5 text-center">No rooms available.</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* section 5 */}
                <div className="flex flex-col bg-bg w-full mt-10">
                    <div className="flex space-x-5">
                        <h1 id="review" className="text-2xl">Review</h1>
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={` text-2xl`}>
                                {i < Math.floor(Number(hotel.avg_review)) ? (
                                    <i className="fa-sharp fa-solid fa-star " style={{ color: "#DBA54D" }} ></i> // ดาวเต็ม
                                ) : i < Number(hotel.avg_review) ? (
                                    <i className="fa-solid fa-star-half-alt 0" style={{ color: "#DBA54D" }}></i> // ครึ่งดาว
                                ) : (
                                    <i className="fa-regular fa-star" style={{ color: "#DBA54D" }}  ></i> // ดาวว่าง
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
                                        <div className="flex  gap-x-2 gap-y-4 flex-col w-8/12 ">
                                            <h1 className="text-xl font-semibold">{review[index].animal_hotel_services[0].animal_user.user.first_name}</h1>
                                            <div className="flex gap-x-2">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <span key={i} className={`text-yellow-500 text-lg`}>
                                                        {i < Math.floor(item.review_rate) ? (
                                                            <i className="fa-solid fa-star " style={{ color: "#DBA54D" }} ></i> // ดาวเต็ม
                                                        ) : i < item.review_rate ? (
                                                            <i className="fas fa-star-half-alt 0" style={{ color: "#DBA54D" }}></i> // ครึ่งดาว
                                                        ) : (
                                                            <i className="fa-regular fa-star" style={{ color: "#DBA54D" }}  ></i> // ดาวว่าง
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mr-4 ">{item.review_detail || " At {hotel.name}, we believe your pets deserve a vacation too Our pet hotel offers a safe, comfortable, and enriching environment for your furry family members, with amenities designed specifically for both cats and dogs."}</p>
                                        </div>
                                        <div className="flex flex-col  w-4/12 h-full justify-end">
                                            <div className="flex ">
                                                <div className="m-1 text-white text-sm p-2 bg-onstep rounded-lg flex justify-center w-fit h-fit ">
                                                    {review[index].cage_room.animal_type}
                                                </div>
                                                <div className=" m-1 text-onstep text-sm p-2 bg-egg rounded-lg flex justify-center  w-fit h-fit">
                                                    {review[index].cage_room.cage_type}
                                                </div>
                                            </div>
                                            <div className="my-2 mb-10">
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