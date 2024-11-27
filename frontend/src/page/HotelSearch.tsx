import React, { useEffect, useState } from "react";
import HotelData from "../components/Hotel-Search/HotelData";
import { GetSearchCage, GetSearchCageByHotel } from "@/helper/cage";
import { FilterAnimal, FilterSearchCage } from "@/types/payload";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Profile } from "@/types/model";
import { Cage } from "@/types/response";

function HotelSearch() {
  const location = useLocation();
  const hotel = location.state?.hotels || [];
  const startDateFromState = location.state?.startDate || "";
  const endDateFromState = location.state?.endDate || "";
  // console.log("test ",hotel[0].cages.animal_type);
  // console.log("test ", hotel[0].cages[0].size);

  const [hotels, setHotels] = useState<any[]>([]);
  const [longitude, setLongtitude] = useState("");
  const [startDate, setStartDate] = useState(startDateFromState);
  const [endDate, setEndDate] = useState(endDateFromState);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [currentSort, setSort] = useState("");
  const navigate = useNavigate();
  const [selectedCageSizes, setSelectedCageSizes] = useState<{
    [key: string]: string;
  }>({});

  const petOptions = [
    "Dog",
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

  const handlePetChange = (pet) => {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((item) => item !== pet) : [...prev, pet]
    );
  };

  console.log("Currently selected pets:", selectedPets);

  const handleSearch = async (sort: string) => {
    const filterAnimal: FilterAnimal[] = selectedPets.map((pet) => ({
      animal_type: pet,
      cage_size: selectedCageSizes[pet] || "",
    }));

    let finalSort = currentSort;
    if (sort !== "") {
      setSort(sort);
      finalSort = sort;
    }

    const filterSearchCage = {
      longitude: "99.3986862",
      latitude: "18.3170581",
      start_time: startDate,
      end_time: endDate,
      sort: finalSort || "",
    };

    try {
      const results = await GetSearchCage(filterAnimal, filterSearchCage);
      setHotels(results);
      console.log("Results:", results);
      // navigate('/hotelsearch', {
      //   state: {
      //     hotels: results,
      //     startDate: startDate,
      //     endDate: endDate
      //   }
      // });
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleCageSizeChange = (pet: string, size: string) => {
    setSelectedCageSizes((prev) => ({
      ...prev,
      [pet]: size,
    }));
  };



  useEffect(() => {
    if (location.state) {
      setIsEditing(false);
      setHotels(location.state.hotels || []);
      setStartDate(location.state.startDate || "");
      setEndDate(location.state.endDate || "");
      setSelectedPets(location.state.selectedPets || []);
      setSelectedCageSizes(location.state.selectedCageSizes || []);
      console.log(location.state.selectedPets)
      console.log(location.state.selectedCageSizes)
    }
  }, []);

  const [searchClicked, setSearchClicked] = useState(false);

  // const [isClicked, setIsClicked] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const buttons = ["Sort By", "Distance", "Price", "review", "Hot Deal"]; // Button labels
  // const uniqueAnimalTypes = [
  //   ...new Set(
  //     hotel.flatMap((hotelItem) =>
  //       hotelItem.cages.map((cage) => cage.animal_type)
  //     )
  //   ),
  // ];
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
            // Original Search Section
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
                  <label className="block text-red-900 text-lg font-semibold mb-4"></label>
                  <div className="grid grid-cols-2 gap-4">
                    {petOptions.map((pet) => (
                      <div
                        key={pet}
                        className="flex items-center justify-between space-x-2"
                      >
                        {/* Checkbox and Label */}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={pet}
                            checked={selectedPets?.includes(pet)}
                            onChange={() => handlePetChange(pet)}
                            className="h-5 w-5 text-[#A08252] focus:ring-[#A08252] rounded-full"
                          />
                          <span className="text-[#5E4126] font-medium">
                            {pet}
                          </span>
                        </label>

                        {/* Dropdown for Cage Size */}
                        <select
                          value={selectedCageSizes[pet] || ""}
                          onChange={(e) =>
                            handleCageSizeChange(pet, e.target.value)
                          }
                          className="w-1/2 border border-[#A08252] rounded-lg px-2 py-1 text-[#5E4126] focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                        >
                          <option value="" disabled>
                            All size
                          </option>
                          <option value="s">Small (S)</option>
                          <option value="m">Medium (M)</option>
                          <option value="l">Large (L)</option>
                          <option value="xl">Extra Large (XL)</option>
                        </select>
                      </div>
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
                      backgroundColor:
                        activeButton === index ? "#A08252" : "white",
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

              <HotelData
                hotelList={hotels}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          ) : (
            // Edit Search Section
            <div className="w-full max-w-6xl mx-auto">
              <div className="rounded-2xl shadow-lg shadow-egg border border-gray-300 px-20">
                <div className="grid grid-cols-3 gap-20 justify-center">
                  <div className="text-xl p-2 mt-10">
                    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-4">
                      <label>Pet</label>
                      <div className="space-y-4">
                        {selectedPets?.map((animal) => (
                          <div
                            key={animal}
                            className="flex items-center space-x-4"
                          >
                            <label className="flex items-center space-x-2 cursor-pointer flex-grow">
                              <input
                                type="checkbox"
                                value={animal}
                                checked={selectedPets.includes(animal)}
                                onChange={() => handlePetChange(animal)}
                                className="h-5 w-5 text-[#A08252] focus:ring-[#A08252] rounded-full"
                              />
                              <span>{animal}</span>
                            </label>

                            <select
                              value={
                                selectedCageSizes[animal] ||
                                hotel
                                  ?.find((h) =>
                                    h.cages?.some(
                                      (cage) => cage.animal_type === animal
                                    )
                                  )
                                  ?.cages?.find(
                                    (cage) => cage.animal_type === animal
                                  )?.size ||
                                "" // Default to an empty string if no matching animal is found
                              }
                              onChange={(e) =>
                                handleCageSizeChange(animal, e.target.value)
                              }
                              className="border border-[#A08252] rounded-lg px-2 py-1 text-[#5E4126] focus:outline-none focus:ring-2 focus:ring-[#A08252] ml-2"
                            >
                              <option value="s">Small (S)</option>
                              <option value="m">Medium (M)</option>
                              <option value="l">Large (L)</option>
                              <option value="xl">Extra Large (XL)</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-xl p-2 mt-10">
                    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-4">
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
                    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-4">
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
                      backgroundColor:
                        activeButton === index ? "#A08252" : "white",
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

              <HotelData
                hotelList={hotels}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default HotelSearch;
