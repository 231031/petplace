import { useLocation } from "react-router-dom";
import { useState } from "react";

interface Cage {
    id: number;
    size: string;
    price: number;
}

interface Hotel {
    name: string;
    longitude: number;
    latitude: number;
    cages: Cage[];
}

function HotelSearch() {
    const location = useLocation();
    const hotels = location.state?.hotels || [];


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Hotel Search Results</h1>
            <ul>
                {hotels.map((hotel: Hotel, index: number) => (
                    <li key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                        <h2 className="text-xl font-semibold">{hotel.name}</h2>
                        <p className="text-black">Longitude: {hotel.longitude}</p>
                        <p className="text-black">Latitude: {hotel.latitude}</p>
                        <h3 className="text-lg font-semibold mt-2">Cages:</h3>
                        <ul className="list-disc list-inside">
                            {hotel.cages.map((cage: Cage, cageIndex: number) => (
                                <li key={cageIndex} className="ml-4">
                                    <p className="text-black">ID: {cage.id}</p>
                                    <p className="text-black">Size: {cage.size}</p>
                                    <p className="text-black">Price: {cage.price} THB</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HotelSearch;