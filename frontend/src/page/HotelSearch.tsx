import React, { useState } from "react";
import HotelData from "../components/Hotel-Search/HotelData";
import { GetSearchCage, GetSearchCageByHotel } from "@/helper/cage";
import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Profile } from "@/types/model";
import { Cage } from "@/types/response";
// import HotelSearch from "./TestSearch";

function HotelSearch() {

  const [hotels, setHotels] = useState<any[]>([]);
  const [longitude, setLongtitude] = useState("");
  // const [latitude, setLatitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sort, setSort] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate


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

  const petOptions2 = [
    "dog",
    "Cat",
    "Fish",
    "Bird",
    "Chinchilla",
    "Ferret",
    "Rabbit",
    "Hamster",
    "Hedgehog",
    "Sugar Glider",
  ];

  const handlePetChange = (pet: string) => {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  };

  console.log("Currently selected pets:", selectedPets);

  const handleSearch = async (sort: string) => {
    const filterAnimal: FilterAnimal[] = selectedPets.map((pet) => ({
      animal_type: pet,
      cage_size: "m",
    }));

    const filterSearchCage: FilterSearchCage = {
      longitude: "14.53",
      latitude: "100.77",
      start_time: startDate,
      end_time: endDate,
      sort: sort,
    };

    try {
      const results = await GetSearchCage(filterAnimal, filterSearchCage);
      setHotels(results.data);
      console.log("Results:", results);
      navigate("/hotelsearch", { state: { hotels: results } });
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const [searchClicked, setSearchClicked] = useState(false); // New state to track if search was clicked

  const location = useLocation();
  const hotel = location.state?.hotels || [];
  console.log(hotel);
  // const [isClicked, setIsClicked] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const buttons = ["Sort By", "Distance", "Price", "Rating", "Hot Deal"]; // Button labels

  return (
    <div className="">
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
      {/* dsadsa */}

      {/* -=========================================================================*/}
      {/* <div className="flex flex-rows-2"> */}
      <div className="">
        <div className="flex flex-cols-3 justify-center gap-20 ">
          {/* <div className="flex flex-cols-3 justify-center gap-20 rounded-2xl shadow-lg shadow-egg border border-gray-300 mx-40 bg-slate-500"></div> */}

          {/* Conditional Rendering */}
          {isEditing ? (
            // Edit Search Section
            <div className="w-3/4 border top-12 h-200 bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Location Section */}
                <div className="p-4 border border-gray-300 bg-white mt-8">
                  <label
                    htmlFor="location"
                    className="block text-lg font-semibold mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={longitude}
                    onChange={(e) => setLongtitude(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                  />
                </div>

                {/* Date Section */}
                <div className="grid grid-cols-1 gap-4 mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-8">
                  <div>
                    <label
                      htmlFor="start-date"
                      className="block text-lg font-semibold mb-2"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end-date"
                      className="block text-lg font-semibold mb-2"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                    />
                  </div>
                </div>

                {/* Pet Section */}
                <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-0">
                  <label className="block text-red-900 text-lg font-semibold mb-4">
                    Pet
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {petOptions2.map((pet) => (
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
                {/* Search Button */}
              </div>
              <div className="flex justify-center mt-auto">
                <button
                  onClick={() => {
                    handleSearch("");
                    setIsEditing(false); // Exit edit mode on search
                  }}
                  className="bg-[#A08252] text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-[#8a6e45] transition duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          ) : (
            // Original Search Section
            <div className="rounded-2xl shadow-lg shadow-egg border border-gray-300 w-3/4 px-20">
              <div className="grid grid-cols-3 gap-20 justify-center">
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
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Search Button */}
              <div className="flex justify-center mt-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-[#A08252] text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-[#8a6e45] transition duration-200 mb-6"
                >
                  {isEditing ? "Cancel Edit" : "Edit Search"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}

      <div className="flex flex-cols-10 gap-4 justify-center">
        {buttons.map((label, index) => (
          <button
            key={index}
            type="submit"
            onClick={() => {
              setActiveButton(index);
              handleSearch(label);
            }}
            style={{
              backgroundColor: activeButton === index ? "#A08252" : "white",
              color: activeButton === index ? "white" : "#A08252",
            }}
            className={`${activeButton === index
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
