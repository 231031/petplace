import React from "react";

export default function HotelHome() {
    return (
        <div className="h-screen flex justify-center bg-bg">
            <div className="flex w-3/4 items-center flex-col gap-y-2 bg-">
                {/* section1 */}
                <div className="pt-10 space-x-1 text-white">
                    <button className="bg-navbar h-10 w-20 rounded-md">view</button>
                    <button className="bg-egg h-10 w-20 rounded-md text-navbar">edit</button>
                </div>
                <div className="flex flex-col w-full h-1/3 gap-y-5 ">
                    <h1 className="text-4xl">Hotel</h1>
                    <div className="bg-cover bg-center h-full" style={{backgroundImage: "url('/images/loginbg.png')"}}>
                    </div>
                </div>
                {/* section2 */}
                <div className="flex w-full h-72">
                    {/* detail */}
                    <div className="flex flex-col gap-y-5 w-full">
                        <h1 className="text-2xl"> Detail</h1>
                        <div className="flex flex-col mr-5 bg-bg gap-y-5 p-5 rounded-xl shadow-md shadow-gray-400">
                            <p>
                                At [Hotel Name], we believe your pets deserve a vacation too! 
                                Our pet hotel offers a safe, comfortable, and enriching environment 
                                for your furry family members, with amenities designed specifically 
                                for both cats and dogs.
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
                        <div className="bg-bg rounded-xl flex flex-col h-4/6 shadow-md shadow-gray-400">
                            <div className="bg-cover bg-center h-5/6 m-4" style={{backgroundImage: "url('/images/map.png')"}}></div>
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
                        <button className="w-32 h-12 bg-bg rounded-md shadow-md shadow-gray-400">Parking</button>
                        <button className="w-32 h-12 bg-bg rounded-md shadow-md shadow-gray-400">CCTV</button>
                        <button className="w-32 h-12 bg-bg rounded-md shadow-md shadow-gray-400">Picture</button>
                        <button className="w-32 h-12 bg-bg rounded-md shadow-md shadow-gray-400">Grooming</button>
                    </div>
                </div>
                {/* section4 */}
                <div className="flex flex-col w-full ">
                    <h1 className="text-2xl">Room</h1>
                    <div className="flex flex-col">
                        <div className="flex">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}