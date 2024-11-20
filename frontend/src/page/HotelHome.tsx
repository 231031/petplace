import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function HotelHome() {
    const [hotel, setHotel] = useState({
        name: "",
        email: "",
        check_in:"",
        check_out:"",
        facility_array: "",
        avg_review:"",
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
                    <div className="bg-cover bg-center h-full" style={{ backgroundImage: "url('/images/loginbg.png')" }}>
                    </div>
                </div>
                {/* section2 */}
                <div className="flex w-full h-72 mt-10">
                    {/* detail */}
                    <div className="flex flex-col gap-y-5 w-full ">
                        <h1 className="text-2xl"> Detail</h1>
                        <div className="flex flex-col mr-5 bg-bg gap-y-5 p-5 rounded-xl shadow shadow-gray-400">
                            <p>
                                At {hotel.name}, we believe your pets deserve a vacation too!
                                Our pet hotel offers a safe, comfortable, and enriching environment
                                for your furry family members, with amenities designed specifically
                                for both cats and dogs.

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
                    <h1 className="text-2xl"> Facility</h1>
                    <div className="flex gap-x-2">
                        <button className="w-32 h-12 bg-bg rounded-md shadow shadow-gray-400">{hotel.facility_array[0]}</button>
                        <button className="w-32 h-12 bg-bg rounded-md shadow shadow-gray-400">{hotel.facility_array[1]}</button> 
                        <button className="w-32 h-12 bg-bg rounded-md shadow shadow-gray-400">{hotel.facility_array[2]}</button>
                        <button className="w-32 h-12 bg-bg rounded-md shadow shadow-gray-400">{hotel.facility_array[3]}</button>
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
                            <div className="flex flex-col bg-bg rounded-md w-full shadow shadow-gray-400">
                                {/* room */}
                                <div className="flex h-60 m-5 p-3 rounded-md shadow shadow-gray-400">
                                    <div className="basis-1/3 bg-cover h-full w-72 " style={{ backgroundImage: "url('/images/map.png')" }}></div>
                                    <div className="basis-1/3  flex flex-col space-y-5 pl-5 pt-4">
                                        <h1 className="text-2xl">Capsule</h1>
                                        <div>
                                            <p>S Size 1.2 x 1.2 x 1.1 m</p>
                                            <p>Accommodates: 1</p>
                                            <p>Facility: Air, Bed, Open toilet</p>
                                        </div>
                                        <a>More detail</a>
                                    </div>
                                    <div className="basis-1/3  space-y-5 pl-5 pt-4 flex flex-col items-end pr-5">
                                        <h1 className="text-2xl">1000$</h1>
                                        <p>free cancel before 8 Oct 2024</p>
                                        <div className="flex space-x-2">
                                            <button className="w-fit px-2 h-8 bg-bg rounded-full shadow">Add to chart</button>
                                            <button className="w-fit px-2 h-8 bg-bg rounded-full bg-yellow">Book now</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex h-60 m-5 p-3 rounded-md shadow shadow-gray-400">
                                    <div className="basis-1/3 bg-cover h-full w-72 " style={{ backgroundImage: "url('/images/map.png')" }}></div>
                                    <div className="basis-1/3  flex flex-col space-y-5 pl-5 pt-4">
                                        <h1 className="text-2xl">Capsule</h1>
                                        <div>
                                            <p>S Size 1.2 x 1.2 x 1.1 m</p>
                                            <p>Accommodates: 1</p>
                                            <p>Facility: Air, Bed, Open toilet</p>
                                        </div>
                                        <a>More detail</a>
                                    </div>
                                    <div className="basis-1/3  space-y-5 pl-5 pt-4 flex flex-col items-end pr-5">
                                        <h1 className="text-2xl">1000$</h1>
                                        <p>free cancel before 8 Oct 2024</p>
                                        <div className="flex space-x-2">
                                            <button className="w-fit px-2 h-8 bg-bg rounded-full shadow">Add to chart</button>
                                            <button className="w-fit px-2 h-8 bg-bg rounded-full bg-yellow">Book now</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* room */}
                            {/* review */}

                        </div>
                    </div>
                </div>
                {/* section 5 */}
                <div className="flex flex-col bg-bg w-full mt-10">
                    <div className="flex space-x-5">
                        <h1 className="text-2xl">Review {hotel.avg_review}</h1>
                        {/* <h1></h1> */}
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