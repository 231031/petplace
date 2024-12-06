import { useEffect, useState } from "react";
import HotelData from "@/components/Hotel-History/HotelData";
import { GetSearchCage } from "@/helper/cage";
import { FilterAnimal } from "@/types/payload";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet-control-geocoder";
import toast, { Toaster } from "react-hot-toast";
import Calendar from "react-calendar";
import { formatDateToString } from "@/helper/utils";

function HotelSearch() {
  const location = useLocation();
  const hotel = location.state?.hotels || [];
  const [formattedStartDate, setFormattedStartDate] = useState(""); // Store formatted date only
  const [formattedEndDate, setFormattedEndDate] = useState(""); // Store formatted date only
  const [hotels, setHotels] = useState<any[]>([]);
  const latitudeFromState = parseFloat(location.state?.latitude) || 0;
  const longitudeFromState = parseFloat(location.state?.longitude) || 0;
  const [latitude, setLatitude] = useState<number>(latitudeFromState);
  const [longitude, setLongitude] = useState<number>(longitudeFromState);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [currentSort, setSort] = useState("");
  const [selectedCageSizes, setSelectedCageSizes] = useState<{
    [key: string]: string;
  }>({});

  // Function to convert the Date object into 'YYYY-MM-DD' format for input
  const formatDateForInput = (date: Date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const buttons = ["Sort By", "Distance", "Price", "Rating", "Hot Deal"]; // Button labels
  // Handle pet selection change
  const handlePetChange = (pet) => {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((item) => item !== pet) : [...prev, pet]
    );
  };

  // Handle search action
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
      latitude: searchedPosition[0] || 0,
      longitude: searchedPosition[1] || 0,
      start_time: formatDateToString(startDate),
      end_time: formatDateToString(endDate),
      sort: finalSort || "",
    };

    try {
      const results = await GetSearchCage(filterAnimal, filterSearchCage);
      setHotels(results);
    } catch (error: any) {
      toast.error(error || "Please fill all information");
      console.error("Error fetching hotels:", error);
    }

    const dateObjectStart = new Date(startDate); // Parse the original start date string
    const formattedStartDate = formatDateForInput(dateObjectStart); // Format it for input display
    setFormattedStartDate(formattedStartDate); // Set the formatted start date for the input field
    const dateObjectEnd = new Date(endDate); // Parse the original start date string
    const formattedEndDate = formatDateForInput(dateObjectEnd); // Format it for input display
    setFormattedEndDate(formattedEndDate); // Set the formatted end date for the input field
  };

  // Geocoder component to search for locations
  const MapWithGeocoder = () => {
    const map = useMap();

    useEffect(() => {
      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false, // Do not mark automatically
      }).addTo(map);

      geocoder.on("markgeocode", (e) => {
        const latlng = e.geocode.center;
        setSearchedPosition([latlng.lat, latlng.lng]); // Store searched position
        map.setView(latlng, 13); // Center the map on the searched location
      });

      return () => {
        map.removeControl(geocoder);
      };
    }, [map]);

    return null;
  };

  const [geoError, setGeoError] = useState<string | null>(null); // Geolocation error
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  ); // Track marker position
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchedPosition, setSearchedPosition] = useState<
    [number, number] | null
  >(null); // Position from search or click
  const [error, setError] = useState(""); // Form error

  const [maplocation, setMapLocation] = useState({
    long: "",
    lat: "",
  });

  // Handle location change
  const handleLocationChange = (lat: number, lng: number) => {
    setMapLocation({ ...location, lat: lat.toString(), long: lng.toString() });
    setMarkerPosition([lat, lng]); // Update the marker position
  };

  // Marker component to display selected location
  const LocationMarker = () => {
    const map = useMap();
    useMapEvents({
      click(e) {
        setSearchedPosition([e.latlng.lat, e.latlng.lng]); // Store clicked position
      },
    });
    useEffect(() => {
      if (searchedPosition) {
        map.setView(searchedPosition, 13); // Set the map view to the marker's position
      }
    }, [searchedPosition, map]);
    return (
      <Marker position={searchedPosition || [13.736717, 100.523186]}>
        <Popup>Selected Location</Popup>
      </Marker>
    );
  };

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          handleLocationChange(latitude, longitude); // Update formData with initial position
        },
        (err) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setSearchedPosition([latitude, longitude]); // Default search position
        },
        () => {
          setError("Unable to retrieve your location.");
          setPosition([latitude, longitude]); // Default to Bangkok
          setSearchedPosition([latitude, longitude]); // Default search position
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setPosition([13.736717, 100.523186]);
      setSearchedPosition([13.736717, 100.523186]);
    }
  }, []);

  // Handle cage size change
  const handleCageSizeChange = (pet: string, size: string) => {
    setSelectedCageSizes((prev) => ({
      ...prev,
      [pet]: size,
    }));
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectionStage, setSelectionStage] = useState<"start" | "range">(
    "start"
  );

  // Auto-rendering on state change (initially based on startDateFromState and endDateFromState)
  useEffect(() => {
    if (startDate) {
      const dateObject = new Date(startDate); // Parse the original start date string
      const formattedDate = formatDateForInput(dateObject); // Format it for input display
      setFormattedStartDate(formattedDate); // Set the formatted start date for the input field
    }
  }, [startDate]); // Only re-run this effect when startDateFromState changes

  useEffect(() => {
    if (endDate) {
      const dateObject = new Date(endDate); // Parse the original end date string
      const formattedDate = formatDateForInput(dateObject); // Format it for input display
      setFormattedEndDate(formattedDate); // Set the formatted end date for the input field
    }
  }, [endDate]); // Only re-run this effect when endDateFromState changes

  // Handle date click
  const handleDateClick = (clickedDate: Date) => {
    if (selectionStage === "start") {
      // First click: Set start date
      setStartDate(clickedDate);
      setSelectionStage("range");
    } else {
      // Subsequent clicks: Handle range selection
      if (!startDate) {
        // Fallback if start date is somehow not set
        setStartDate(clickedDate);
        setSelectionStage("range");
        return;
      }

      // Ensure the new date is after the start date
      if (clickedDate >= startDate) {
        setEndDate(clickedDate);
        setSelectionStage("start"); // Reset to start for next selection
      } else {
        // If clicked date is before start date, reset and set as new start date
        setStartDate(clickedDate);
        setEndDate(null);
      }
    }
  };

  // Add custom classes to calendar tiles
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      // Highlight start date
      if (startDate && date.toDateString() === startDate.toDateString()) {
        return "highlight-start";
      }
      // Highlight end date
      if (endDate && date.toDateString() === endDate.toDateString()) {
        return "highlight-end";
      }
      // Highlight dates within the range
      if (startDate && endDate && date > startDate && date < endDate) {
        return "highlight-range";
      }
    }
    return null;
  };

  // Disable past dates in the calendar
  const tileDisabled = ({ date, view }) => {
    // Optional: Add logic to disable past dates or specific date ranges
    return view === "month" && date < new Date();
  };

  // Fetch initial data from location state
  useEffect(() => {
    if (location.state) {
      setIsEditing(false);
      setHotels(location.state.hotels || []);
      setStartDate(location.state.startDate || "");
      setEndDate(location.state.endDate || "");
      setSelectedPets(location.state.selectedPets || []);
      setSelectedCageSizes(location.state.selectedCageSizes || []);
    }
  }, []);



  return (
    <div className="">
      <div className="w-full h-1/2 p-4 bg-white flex justify-center items-center relative">
        <Toaster position="top-center" reverseOrder={false}></Toaster>
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
      <div className="">
        <div className="flex flex-cols-3 justify-center gap-20 ">

          {/* Conditional Rendering */}
          {isEditing ? (
            // Original Search Section
            <div className="w-3/4 border top-12 h-200 bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4 mb-6 ">
                {/* Location Section */}
                <div className="flex flex-col  p-2 border border-gray-300 mt-8 rounded-lg ">
                  <label className="text-xl text-semibold">Select on map</label>
                  {geoError && <div>{geoError}</div>}
                  <MapContainer
                    center={position || [13.736717, 100.523186]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                    <MapWithGeocoder />
                  </MapContainer>
                  <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-0 ">
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
                </div>

                
                <div className="grid grid-cols-1 gap-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-8">
                  <div className="flex col justify-center h-[28rem]">
                    <label
                      htmlFor="date"
                      className="block text-lg font-meduim mb-2 mt-2"
                    >
                      Date
                    </label>
                    <div className="p-4 rounded-lg mt-8 mb-1">
                      <Calendar
                        className="p-4 rounded-lg shadow-md text-navbar"
                        onClickDay={handleDateClick}
                        value={[startDate, endDate]}
                        tileClassName={tileClassName}
                        tileDisabled={tileDisabled}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="mb-1 flex flex-col space-y-3">
                      <div className="flex">
                        <span className="text-lg font-medium">Start :</span>
                        <p className="text-lg">
                          {startDate
                            ? startDate.toLocaleDateString()
                            : "Not selected"}
                        </p>
                      </div>
                      <div className="flex">
                        <span className="text-lg font-medium">End :</span>
                        <p className="text-lg">
                          {endDate
                            ? endDate.toLocaleDateString()
                            : "Not selected"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet Section */}

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
                    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-4 w-80">
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
                                // onChange={() => handlePetChange(animal)}
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
                    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-2 bg-white w-80 h-full">
                      <label>Location</label>
                      {geoError && <div>{geoError}</div>}
                      <MapContainer
                        center={position || [13.736717, 100.523186]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                        <MapWithGeocoder />
                      </MapContainer>
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
                          value={formattedStartDate}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                        />
                      </div>
                      <div>
                        End
                        <input
                          type="date"
                          id="end-date"
                          value={formattedEndDate}
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
                    className="bg-[#A08252] text-white text-lg font-semibold px-6 py-3 ml-14 rounded-lg hover:bg-[#8a6e45] transition duration-200 mb-6 "
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

              <HotelData
                hotelList={hotels}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelSearch;
