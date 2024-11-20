import React, { useState } from "react";
import HotelData from "../components/Hotel-Search/HotelData";
import { GetSearchCage, GetSearchCageByHotel } from "@/helper/cage";
import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { useLocation } from "react-router-dom";
import { Profile } from "@/types/model";
import { Cage } from "@/types/response";
// import HotelSearch from "./TestSearch";

function HotelSearch() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [longitude, setLongtitude] = useState("");
  // const [latitude, setLatitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const petOptions = [
    "dog",
    "Cat",
    // "Fish",
    // "Bird",
    // "Chinchilla",
    // "Ferret",
    // "Rabbit",
    // "Hamster",
    // "Hedgehog",
    // "Sugar Glider",
  ];

  const handlePetChange = (pet: string) => {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  };

  console.log("Currently selected pets:", selectedPets);

  const handleSearch = async () => {
    const filterAnimal: FilterAnimal[] = selectedPets.map((pet) => ({
      animal_type: pet,
      cage_size: "m",
    }));

    const filterSearchCage: FilterSearchCage = {
      longitude: longitude,
      latitude: "18.3170581",
      start_time: startDate,
      end_time: endDate,
    };

    try {
      const results = await GetSearchCage(filterAnimal, filterSearchCage);
      setHotels(results.data);
      console.log("Results:", results);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  console.log({ longitude });

  const location = useLocation();
  const hotel = location.state?.hotels || [];
  console.log(hotel);
  // const [isClicked, setIsClicked] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const buttons = ["Sort By", "Distance", "Price", "Rating", "Hot Deal"]; // Button labels

  return (
    <div>
      <div className="w-full h-1/2 p-4 bg-white flex justify-center items-center relative">
        <div
          className="w-1/4 rounded-lg absolute mt-4 top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4"
          style={{ backgroundColor: "#A08252" }}
        >
          <a href="/" className="text-xl text-white p-2">
            Hotel
          </a>
          <a href="/" className="text-xl text-white p-2">
            Care
          </a>
          <a href="/" className="text-xl text-white p-2">
            Clinic
          </a>
          <a href="/" className="text-xl text-white p-2">
            Delivery
          </a>
        </div>
      </div>

      <div className="flex flex-cols-3 justify-center gap-20 rounded-2xl shadow-lg shadow-egg border border-gray-300 mx-40">
        <div className="text-xl p-2 mt-10">
          <div className="flex flex-col">
            <label>Pet</label>
            {petOptions.map((pet) => (
              <label
                key={pet}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={pet}
                  checked={selectedPets.includes(pet)}
                  onChange={() => handlePetChange(pet)}
                  className="h-5 w-5 text-[#A08252] focus:ring-[#A08252] rounded-full"
                />
                <span>{pet}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="text-xl p-2 mt-10">
          <div className="flex flex-col">
            <label>Location</label>
            <input
              type="text"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongtitude(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
            />
          </div>
        </div>

        <div className="text-xl p-2 mt-10">
          <div className="flex flex-col">
            <label>Date</label>
            <div>
              Start
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
              />
            </div>
            <div>
              End
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-cols-10 gap-4 justify-center">

      {buttons.map((label, index) => (
        <button
          key={index}
          type="submit"
          onClick={() => setActiveButton(index)}
          style={{
            backgroundColor: activeButton === index ? "#A08252" : "white",
            color: activeButton === index ? "white" : "#A08252",
          }}
          className={`${
            activeButton === index
              ? "hover:bg-egg focus:ring-red-300"
              : "hover:bg-gray-100 focus:ring-red-300"
          } mt-2 rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-4`}
        >
          {label}
        </button>
      ))}

      </div>
      <HotelData hotelList={hotel} />
    </div>
  );
}

export default HotelSearch;
