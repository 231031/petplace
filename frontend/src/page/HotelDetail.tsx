
import { useNavigate } from "react-router-dom";
import { CarouselDemo } from "../components/HotelDetailComponents/CarousolDemo";
import { useRef, useEffect, useState } from 'react';

function HotelDetail() {
    const navigate = useNavigate();
    const hotelRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);
    const facilityRef = useRef<HTMLDivElement>(null);
    const roomRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

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
      
      console.log("cages", rooms)



    const ClickBookNow = () => {
        navigate('/hotelbookdetail')
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth'});
        }
    };

    const [hotel, setHotel] = useState({
        name: "",
        email: "",
        check_in:"",
        check_out:"",
        facility_array: "",
        avg_review:"",
        detail:"",
    }
    );
    const id = localStorage.getItem("userId");
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
    // const navigate = useNavigate();

    return (
        <div className="flex justify-center bg-bg  pb-10">
            <div className="flex w-3/4 items-center flex-col gap-y-2 bg-bg">
                {/* section1 */}
                <div className="pt-10 text-black">
                    <div className="bg-white grid grid-cols-5 gap-1 p-2 rounded-md shadow-md"> 
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(hotelRef)} >Hotel</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(detailRef)}>Detail</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(facilityRef)}>Facility</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(roomRef)}>Room</button>
                        <button className="h-10 w-20 rounded-md " onClick={() => scrollToSection(reviewRef)}>Review</button>
                    </div>
                </div>
                <div className="flex flex-col w-full h-80 gap-y-5 ">
                    <h1 ref={hotelRef} id="hotel" className="text-4xl">{hotel.name}</h1>
                    <CarouselDemo images={hotel.image_array || []} />
                </div>
                {/* section2 */}
                <div className="flex w-full h-72 mt-10">
                    {/* detail */}
                    <div className="flex flex-col gap-y-5 w-full ">
                        <h1 ref={detailRef} id="detail" className="text-2xl">Detail</h1>
                        <div className="flex flex-col mr-5 bg-bg gap-y-5 p-5 rounded-xl shadow shadow-gray-400">
                            <p>
                                {hotel.detail}

                            </p>
                            <div>
                                <p>Check in 12.00</p>
                                <p>Check out 12.00</p>
                            </div>
                        </div>
                    </div>
                    {/* map */}
                    <div className="flex flex-col w-3/12 gap-y-5 pl-5">
                        <h1 className="text-2xl"> Map</h1>
                        <div className="bg-bg rounded-xl flex flex-col h-64 shadow shadow-gray-400">
                            <div className="bg-cover bg-center h-5/6 m-4" style={{ backgroundImage: "url('/images/map.png')" }}></div>
                            <div className="flex ml-4 mb-2 space-x-5">
                                <p>Distinct</p>
                                <p>Province</p>
                                <p>0.5 km</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* section3 */}
                <div className="flex flex-col w-full gap-y-5 pb-5">
                    <h1 ref={facilityRef} id="facility" className="text-2xl"> Facility</h1>
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
                    <h1 ref={roomRef} id="room" className="text-2xl">Room</h1>
                    <div className="flex flex-col">
                        {/* selection */}
                        <div className="flex justify-end gap-x-2 my-2">
                            <button className="w-16 h-8 bg-navbar rounded-md text-xs">Cat</button>
                            <button className="w-16 h-8 bg-yellow rounded-md text-xs">Rabbit</button>
                            <button className="w-16 h-8 bg-yellow rounded-md text-xs">Hamster</button>
                        </div>
                        <div className="flex bg-bg w-full h-full flex-col shadow shadow-gray-400 rounded-md">
                            {/* room container */}
                            <div className="flex flex-col bg-bg rounded-md w-full shadow shadow-gray-400">
                                {/* room */}
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
                                                <button className="w-fit px-2 h-8 bg-bg rounded-full bg-yellow  hover:bg-navbar" onClick={ClickBookNow}>Book now</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="p-5 text-center">No rooms available.</p>
                            )}

                            </div>
                            {/* room */}
                            {/* review */}

                        </div>
                    </div>
                </div>
                {/* section 5 */}
                <div className="flex flex-col bg-bg w-full mt-10">
                    <div className="flex space-x-5">
                        <h1 ref={reviewRef} id="review" className="text-2xl">Review {hotel.avg_review}</h1>
                        <div className="size-7 bg-navbar rounded-full"></div>
                    </div>
                    <div className="shadow shadow-gray-400 rounded-md mt-5">
                        <div className="flex flex-col h-48 m-5 p-3 bg-bg rounded-md shadow shadow-gray-400 gap-y-5">
                            <h1 className="text-2xl"> Arthit </h1>
                            <div className="size-7 bg-navbar rounded-full"></div>
                            <p> Great service, checked in at 23:30 and the staff was very helpful.
                                The hotel is located in a quiet alley but not far from the main road. There's a 7-Eleven nearby.
                                I booked a room with a king-size bed and it was really spacious, and the price was less than 200,
                                very worth it.
                                The room has a TV and a safe, and there's free coffee with a great view.</p>
                        </div>
                        <div className="flex flex-col h-48 m-5 p-3 bg-bg rounded-md shadow shadow-gray-400 gap-y-5">
                            <h1 className="text-2xl"> Arthit </h1>
                            <div className="size-7 bg-navbar rounded-full"></div>
                            <p> Great service, checked in at 23:30 and the staff was very helpful.
                                The hotel is located in a quiet alley but not far from the main road. There's a 7-Eleven nearby.
                                I booked a room with a king-size bed and it was really spacious, and the price was less than 200,
                                very worth it.
                                The room has a TV and a safe, and there's free coffee with a great view.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>


    )
}

export default HotelDetail;