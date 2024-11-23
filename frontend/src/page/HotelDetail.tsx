
import { useLocation, useNavigate } from "react-router-dom";
import { CarouselDemo } from "../components/HotelDetailComponents/CarousolDemo";
import { useEffect, useRef, useState } from 'react';
import { Cage } from "@/types/response";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '@fortawesome/fontawesome-free/css/all.min.css';


function HotelDetail() {
    const navigate = useNavigate();
    const hotelRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);
    const facilityRef = useRef<HTMLDivElement>(null);
    const roomRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const hotel = location.state?.selectedHotel;

    console.log("selectedHotel" ,hotel)
    console.log("hotel.cages", hotel.cages)
    const startDate = location.state?.startDate || '';
    const endDate = location.state?.endDate || '';


    const handleCageSelect = (cage: Cage) => {
        const queryParams = new URLSearchParams({
            size: cage.size,
            cage_type: cage.cage_type,  // Replace with dynamic value if needed
            facility: cage.facility,
            price: cage.price.toString(),
            max_capacity: cage.max_capacity.toString(),     // Replace with dynamic value if needed
            startDate: startDate,
            endDate: endDate
        }).toString();

        // Navigate with query parameters
        
        navigate(`/hotelbookdetail?${queryParams}`,
            { state: { 
                selectedCage: cage, 
                selectedHotel: location.state?.selectedHotel,
                profile_name: location.state?.profile_name,
                startDate: startDate, 
                endDate: endDate } });
        
    };
    const id = localStorage.getItem("userId");  
    console.log("id ", id)
    const [review, setReview] = useState({});
    const profile_id = hotel.id

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
            console.log("Fetched hotel review data:", data);
            // console.log("Fetched cage room data:", data.address);
            setReview(data|| []); // เก็บข้อมูลห้องใน state
          })
          .catch((error) => console.error("Error fetching cage room data:", error));
      }, []);
      
    //   console.log("cages", rooms)

    // const [hotel, setHotel] = useState({
    //     name: "",
    //     email: "",
    //     check_in:"",
    //     check_out:"",
    //     facility_array: "",
    //     avg_review:"",
    //     image_array:[],
    //     latitude: null,
    //     longitude:  null
    // }
    // );

   
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                <div className="flex flex-col w-full h-80 gap-y-5  ">
                    <h1 ref={hotelRef} id="hotel" className="text-4xl">{hotel.name}</h1>
                    <CarouselDemo images={hotel.image_array || []}/>

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
                                {/* <p>Check in {selectedHotel.check_in}</p> */}
                                {/* <p>Check out {selectedHotel.check_out}</p> */}
                            </div>
                        </div>
                    </div>
                    {/* map */}
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
                                distance
                            </div>
                        </div>
                    </div>
                </div>
                {/* section3 */}
                <div className="flex flex-col w-full gap-y-5 pb-5">
                    <h1 ref={facilityRef} id="facility" className="text-2xl"> Facility</h1>
                    <div className="flex gap-x-2">
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
                    <h1 ref={roomRef} id="room" className="text-2xl">Cage</h1>
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
                            {hotel.cages ? (
                                    <div>
                                        {hotel.cages.map((cage: Cage, index: number) => (
                                            <div key={index}>
                                                <div className="flex h-60 m-5 p-3 rounded-md shadow shadow-gray-400">
                                                    <div className="basis-1/3 bg-cover h-full w-72"  style={{ backgroundImage: `url(${cage.image})`}}></div>
                                                    <div className="basis-1/3  flex flex-col space-y-5 pl-5 pt-4">
                                                        <h1 className="text-2xl">{cage.cage_type}</h1>
                                                        <div>
                                                            <div className="grid grid-cols-11 gap-1">
                                                                <p className="bg-yellow text-center font-bold">{cage.size}</p>
                                                                <p>Size</p>
                                                            </div>
                                                            <p>Accommodates: {cage.max_capacity}</p>
                                                            <p>Facility: {cage.facility}</p>
                                                        </div>
                                                    </div>
                                                    <div className="basis-1/3  space-y-5 pl-5 pt-4 flex flex-col items-end pr-5">
                                                        <h1 className="text-2xl">{cage.price}$</h1>
                                                        <p>free cancel before 1 week</p>
                                                        <div className="flex space-x-2">
                                                            <button className="w-fit px-2 h-8 bg-bg rounded-full shadow">Add to cart</button>
                                                            <button className="w-fit px-2 h-8  rounded-full bg-yellow hover:bg-navbar" onClick={() => handleCageSelect(cage)}>Book now</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No cages available</p>
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
                        <h1 ref={reviewRef} id="review" className="text-2xl">Review</h1>
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
                                        <div className="flex  gap-x-2 flex-col w-10/12 ">
                                            <h1 className="text-xl font-bold">Name: {review[index].animal_hotel_services[0].animal_user.user.first_name}</h1>   
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

export default HotelDetail;