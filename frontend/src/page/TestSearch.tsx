import { GetSearchCage, GetSearchCageByHotel } from "@/helper/cage";
import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

    const [cages, setCages] = useState();

    useEffect(() => {
        const filterAnimal:FilterAnimal[] = [
            {
                animal_type: "dog",
                cage_size: "m",
            },
            {
                animal_type: "cat",
                cage_size: "s",
            },
        ]

        const filterSearchCage:FilterSearchCage= {
            longitude: "100.4913737",
            latitude: "13.6526372",
            start_time: "2024-11-11",
            end_time: "2024-11-12",
            sort: "",
        }

        const profile_id = 1;
        const user_id = 2;

        const apiSearch = async () => {
            try {
                // const res = await GetSearchCage(filterAnimal, filterSearchCage);
                const res = await GetSearchCageByHotel(filterAnimal, filterSearchCage, profile_id, user_id);
                setCages(res.cages);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }
        apiSearch()

    }, []);

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