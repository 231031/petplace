import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CarouselDemo } from "../components/HotelDetailComponents/CarousolDemo";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function HotelHome() {
    const [hotel, setHotel] = useState({
        name: "",
        email: "",
        check_in:"",
        check_out:"",
        facility_array: "",
        avg_review:"",
        image_array:[],
        latitude: null,
        longitude:  null
    }
    );
    const id = localStorage.getItem("userId");
    const [rooms, setRooms] = useState({
        quantity: "",
        // size: "",

        
    });

    // console.log(id)

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/cageroom/all/${id}`, {
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
            setRooms(data|| []); // เก็บข้อมูลห้องใน state
          })
          .catch((error) => console.error("Error fetching cage room data:", error));
      }, []);

    const [review, setReview] = useState()


    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/hotel/review/${id}`, {
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
            setReview(data|| []); // เก็บข้อมูลห้องใน state
          })
          .catch((error) => console.error("Error fetching cage room data:", error));
    }, []);
      
    console.log("cages", rooms)

    useEffect(() => {
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
                
            })
            .catch((error) => console.error("Error fetching hotel data:", error));
    }, []);
    // console.log("hotel data", hotel.facility[])
    const navigate = useNavigate();

    return (
        <div className="flex justify-center bg-bg  pb-10">
            <div className="flex w-3/4 items-center flex-col gap-y-2 bg-bg">
                {/* section1 */}
                <div className="pt-10 space-x-1 text-white">
                    <button className="bg-navbar h-10 w-20 rounded-md">view</button>
                    <button
                        className="bg-egg h-10 w-20 rounded-md text-navbar"
                        onClick = {() => navigate('/hotel/edit')}
                        // onClick={() => navigate('hotel/edit', { state: { hotels: results } })}
                    >
                        edit
                    </button>     
                </div>
                <div className="flex flex-col w-full h-80 gap-y-5 ">
                    <h1 className="text-4xl">{hotel.name}</h1>
                    <CarouselDemo images={hotel.image_array || []} />
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
                            <div>
                                distance
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
                    <h1 className="text-2xl">Room</h1>
                    <div className="flex flex-col">
                        {/* selection */}
                        <div className="flex justify-end gap-x-2 my-2">
                            <button className="w-16 h-8 bg-navbar rounded-md text-xs">Cat</button>
                            <button className="w-16 h-8 bg-yellow rounded-md text-xs">Rabbit</button>
                            <button className="w-16 h-8 bg-yellow rounded-md text-xs">Hamster</button>
                        </div>
                        <div className="flex bg-bg w-full h-full flex-col shadow shadow-gray-400 rounded-md">
                            {/* room container */}
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <div key={index} className="flex h-60 m-5 p-3 rounded-md shadow shadow-gray-400">
                                        <div
                                            className="basis-1/3 bg-cover h-full w-72"
                                            style={{ backgroundImage: `url(${room.image || "/images/default-room.png"})` }}
                                        ></div>
                                        <div className="basis-1/3 flex flex-col space-y-5 pl-5 pt-4">
                                            <h1 className="text-2xl">{room.cage_type || "Room"}</h1>
                                            <div>
                                                <p>Size: {room.size || "N/A"} {room.length && room.width && room.height ? `${room.length} x ${room.width} x ${room.height}` : ""}</p>
                                                <p>Capacity: {room.quantity || "N/A"}</p>
                                                <p>Facility: {room.facility || "Standard facilities"}</p>
                                            </div>
                                            <a>More detail</a>
                                        </div>
                                        <div className="basis-1/3 space-y-5 pl-5 pt-4 flex flex-col items-end pr-5">
                                            <h1 className="text-2xl">{room.price}$</h1>
                                            <p>Free cancel before {new Date().toLocaleDateString()}</p>
                                            <div className="flex space-x-2">
                                                <button className="w-fit px-2 h-8 bg-bg rounded-full shadow">Add to chart</button>
                                                <button className="w-fit px-2 h-8 bg-bg rounded-full bg-yellow">Book now</button>
                                            </div>
                                        </div>
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
                        <h1  id="review" className="text-2xl">Review</h1>
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={` text-2xl`}>
                                    {i < Math.floor(hotel.avg_review) ? (
                                        <i className="fa-sharp fa-solid fa-star "style={{ color: "#DBA54D" }} ></i> // ดาวเต็ม
                                        ) : i < hotel.avg_review ? (
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
                                        <div className="flex  gap-x-2 gap-y-4 flex-col w-10/12 ">
                                            <h1 className="text-xl font-semibold">{review[index].animal_hotel_services[0].animal_user.user.first_name}</h1>   
                                                <div className="flex gap-x-2">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <span key={i} className={`text-yellow-500 text-lg`}>
                                                            {i < Math.floor(item.review_rate) ? (
                                                                <i className="fa-solid fa-star "style={{ color: "#DBA54D" }} ></i> // ดาวเต็ม
                                                            ) : i < item.review_rate ? (
                                                                <i className="fas fa-star-half-alt 0" style={{ color: "#DBA54D" }}></i> // ครึ่งดาว
                                                            ) : (
                                                                <i className="fa-regular fa-star" style={{ color: "#DBA54D" }}  ></i> // ดาวว่าง
                                                            )}
                                                        </span>
                                                    ))}
                                                </div> 
                                                <p className="mr-4 ">{item.review_detail ||" At {hotel.name}, we believe your pets deserve a vacation too Our pet hotel offers a safe, comfortable, and enriching environment for your furry family members, with amenities designed specifically for both cats and dogs."}</p>
                                        </div>
                                        <div className="flex flex-col  w-2/12 h-full justify-end h-full">
                                            <div className="flex ">
                                                <div className="m-1 text-white text-sm p-2 bg-onstep rounded-lg flex justify-center w-fit h-fit ">
                                                    {review[index].cage_room.animal_type}    
                                                </div>
                                                <div className=" m-1 text-onstep text-sm p-2 bg-egg rounded-lg flex justify-center  w-fit h-fit">
                                                    {review[index].cage_room.cage_type}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <img src="/public/images/loginbg.png" alt="" />
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