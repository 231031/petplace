import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetSearchCage } from "../../helper/cage";
import { FilterAnimal, FilterSearchCage } from "../../types/payload";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Cage } from "@/types/response";
import { useLocation } from "react-router-dom";
import { GetTokenChangeRoleToClient, RemoveFavCage } from "../../helper/user";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import L from "leaflet";
import { formatDateToString } from "../../helper/utils";
import { BASE_API } from "@/config/config";

function Home() {
  // State to manage hotels data
  // const [hotels, setHotels] = useState<any[]>([]);
  // State to manage date selection stage
  const [selectionStage, setSelectionStage] = useState<"start" | "range">(
    "start"
  );
  // State to manage start and end dates
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
  const tileClassName = ({ date, view }: any) => {
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
  const tileDisabled = ({ date, view }: any) => {
    return view === "month" && date < new Date();
  };

  // State to manage selected pets and cage sizes
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const navigate = useNavigate();
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
  const [selectedCageSizes, setSelectedCageSizes] = useState<{
    [key: string]: string;
  }>({});
  // const [rooms, setRooms] = useState<any[]>([]);
  const location = useLocation();
  const [error, setError] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null); // Geolocation error
  // const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null); // Track marker position
  const [position, setPosition] = useState<[number, number] | null>(null);
  // const [maplocation, setMapLocation] = useState({
  //     long: '',
  //     lat: '',
  // });

  const [searchedPosition, setSearchedPosition] = useState<
    [number, number] | null
  >(null); // Position from search or click

  // Create sets to collect unique values
  // const uniqueAnimalTypes = new Set<string>();
  // const uniqueFacilities = new Set<string>();

  // Iterate through rooms to populate sets
  // rooms.forEach((room) => {
  //     if (room.animal_type) uniqueAnimalTypes.add(room.animal_type);
  //     if (room.facility) uniqueFacilities.add(room.facility);
  // });

  // Handle cage selection
  const handleCageSelect = (cage: Cage) => {
    const queryParams = new URLSearchParams({
      size: cage.size,
      cage_type: cage.cage_type,
      facility: cage.facility,
      price: cage.price.toString(),
      max_capacity: cage.max_capacity.toString(),
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
    }).toString();

    // Navigate with query parameters
    navigate(`/hotelbookdetail?${queryParams}`, {
      state: {
        selectedCage: cage,
        selectedHotel: location.state?.selectedHotel,
        profile_name: location.state?.profile_name,
        startDate: startDate,
        endDate: endDate,
      },
    });
  };

  // Handle removing favorite cage
  const handleRemoveFavorite = async (cage: Cage) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You need to log in to delete favorites.");
      return;
    }

    const favPayload = {
      cage_id: cage.id,
      user_id: Number(userId),
    };
    try {
      await RemoveFavCage(favPayload);
      window.location.reload();
    } catch (error) {
      console.error("Error delete your favorites:", error);
      alert("Failed to delete favorites cage. Please try again.");
    }
  };

  // Handle cage size change
  const handleCageSizeChange = (pet: string, size: string) => {
    setSelectedCageSizes((prev) => ({
      ...prev,
      [pet]: size,
    }));
  };

  // Handle pet change
  const handlePetChange = (pet: string) => {
    setSelectedPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  };

  // Handle location change
  // const handleLocationChange = (lat: number, lng: number) => {
  // setMapLocation({ ...location, lat: lat.toString(), long: lng.toString() });
  // setMarkerPosition([lat, lng]); // Update the marker position
  // };

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

  // Get token to change role
  const getTokenChangeRole = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return;
    }
    try {
      const response = await GetTokenChangeRoleToClient(parseInt(userId));
      if (response) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", "client");
      }
    } catch (error) {
      console.error("failed to get token", error);
    }
  };

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          // handleLocationChange(latitude, longitude); // Update formData with initial position
        },
        () => {
          setError("Unable to retrieve your location.");
          console.log(error);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
    if (location.state && location.state.role) {
      getTokenChangeRole();
    }
  }, []);

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeoError(null);
          setPosition([latitude, longitude]);
          setSearchedPosition([latitude, longitude]); // Default search position
        },
        () => {
          setError("Unable to retrieve your location.");
          setPosition([13.736717, 100.523186]); // Default to Bangkok
          setSearchedPosition([13.736717, 100.523186]); // Default search position
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setPosition([13.736717, 100.523186]);
      setSearchedPosition([13.736717, 100.523186]);
    }
  }, []);

  // State to manage favorite data and loading state
  const [favData, setFavData] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);

  // Fetch favorite cages
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Retrieve user ID from localStorage
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId) throw new Error("User ID is not available");

        const [latitude, longitude] = position || [13.736717, 100.523186];

        // Construct the API URL
        const apiUrl = `${BASE_API}/user/fav/${userId}?latitude=${latitude}&longitude=${longitude}`;

        // Fetch data
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        setFavData(data); // Update state with fetched data
      } catch (err) {
        console.error("Error fetching user favorites:", err);
      }
      // finally {
      //     setLoading(false); // Stop the loading spinner
      // }
    };

    fetchFavorites();
  }, [position]);

  // Geocoder component to search for locations
  const MapWithGeocoder = () => {
    const map = useMap();

    useEffect(() => {
      const geocoder = (L.Control as any)
        .geocoder({
          defaultMarkGeocode: false,
        })
        .addTo(map);

      geocoder.on("markgeocode", (e: any) => {
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

  console.log(searchedPosition);

  // Handle search for cages
  const handleSearch = async () => {
    const filterAnimal: FilterAnimal[] = selectedPets.map((pet) => ({
      animal_type: pet,
      cage_size: selectedCageSizes[pet] || "",
    }));

    const filterSearchCage: FilterSearchCage = {
      longitude: searchedPosition ? JSON.stringify(searchedPosition[1]) : "",
      latitude: searchedPosition ? JSON.stringify(searchedPosition[0]) : "",
      start_time: formatDateToString(startDate),
      end_time: formatDateToString(endDate),
    };

    try {
      const results = await GetSearchCage(filterAnimal, filterSearchCage);
      navigate("/hotelsearch", {
        state: {
          hotels: results,
          startDate: startDate,
          endDate: endDate,
          selectedPets: selectedPets,
          selectedCageSizes: selectedCageSizes,
          longitude: searchedPosition
            ? JSON.stringify(searchedPosition[1])
            : "",
          latitude: searchedPosition ? JSON.stringify(searchedPosition[0]) : "",
        },
      });
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  return (
    <div className="h-screen relative">
      {/* First Section */}
      <div className="w-full h-1/2 bg-gray-100 relative">
        <img
          src="/images/loginbg.png"
          className="w-full h-full object-cover object-center"
        />
        <img
          src="/images/logo.png"
          className="absolute top-0 left-16 w-64 h-64 z-20"
        />
        <div className="absolute z-20 top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-4 md:gap-0">
          <a href="/" className="text-lg md:text-2xl text-white">
            Grooming
          </a>
          <span className="hidden md:inline text-2xl text-white px-4 md:px-8">
            |
          </span>
          <a href="/" className="text-lg md:text-2xl text-white">
            Delivery
          </a>
          <span className="hidden md:inline text-2xl text-white px-4 md:px-8">
            |
          </span>
          <a href="/" className="text-lg md:text-2xl text-white">
            Hotel Booking
          </a>
          <span className="hidden md:inline text-2xl text-white px-4 md:px-8">
            |
          </span>
          <a href="/" className="text-lg md:text-2xl text-white">
            Clinic
          </a>
          <span className="hidden md:inline text-2xl text-white px-4 md:px-8">
            |
          </span>
          <a href="/" className="text-lg md:text-2xl text-white">
            Shop
          </a>
        </div>
        <div className="bg-white rounded-3xl absolute px-8 py-2 -bottom-2 left-1/2 transform -translate-x-1/2 z-10">
          <div
            className="font-medium text-xl md:text-2xl px-4 md:px-8 py-2 "
            style={{ color: "#A08252" }}
          >
            Find your service
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="w-full h-full p-4 bg-white flex justify-center items-center relative mb-6">
        {/* Nav bar */}
        <div
          className="w-full md:w-1/2 lg:w-1/4 rounded-lg absolute z-20 mt-4 top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2 md:space-x-4"
          style={{ backgroundColor: "B3802E" }}
        >
          <a href="/" className="text-sm md:text-xl text-white p-2">
            Hotel
          </a>
          <a href="/" className="text-sm md:text-xl text-white p-2">
            Care&Clinic
          </a>
          <a href="/" className="text-sm md:text-xl text-white p-2">
            Delivery
          </a>
        </div>
        {/* Search box */}
        <div className="h-7/8 md:w-11/12 lg:w-3/4 absolute z-10 top-16 bg-white p-4 md:p-8 rounded-lg shadow-lg">
          {/* Location section */}
          <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 h-60 w-full border border-gray-300 rounded-lg shadow-md bg-white mt-8">
              <label
                htmlFor="location"
                className="block text-lg font-meduim mb-2 mt-2"
              >
                Location
              </label>
              <div className="flex flex-col w-full gap-y-5">
                <div className="bg-bg rounded-xl h-44 w-full shadow shadow-gray-400 p-1">
                  <div className="h-full w-full rounded-lg">
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
                  <div></div>
                </div>
                <div className="p-4 h-full border border-gray-300 rounded-lg shadow-md bg-white">
                  <label className="block text-[#A08252] text-lg font-medium mb-4">
                    Pet
                  </label>
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
                            checked={selectedPets.includes(pet)}
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
                          className="w-28 bg-[#F2C680] border border-[#F2C680] rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                        >
                          <option value="" disabled>
                            All size
                          </option>
                          <option value="s">S</option>
                          <option value="m">M</option>
                          <option value="l">L</option>
                          <option value="xl">XL</option>
                        </select>
                      </div>
                    ))}
                  </div>
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
                      {endDate ? endDate.toLocaleDateString() : "Not selected"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="mt-2 bg-[#B3802E] text-white text-xl font-medium px-16 py-1 rounded-3xl hover:bg-[#8a6e45] transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-[#DCC4A5] rounded-2xl py-2 px-8 absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="font-semibold text-white text-2xl px-8 py-2">
            Favorite
          </div>
        </div>
      </div>

      {/* Third Section */}
      <div className="w-full h-3/4 p-4 bg-[#DCC4A5] shadow flex justify-center items-center relative overflow-hidden">
        {/* Top Navigation */}
        <div className="w-1/4 bg-white rounded-lg absolute z-20 top-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4">
          <a href="/" className="text-xl text-yellow p-2">
            Hotel
          </a>
          <a href="/" className="text-xl text-yellow p-2">
            Care
          </a>
          <a href="/" className="text-xl text-yellow p-2">
            Clinic
          </a>
          <a href="/" className="text-xl text-yellow p-2">
            Delivery
          </a>
        </div>

        {/* Hotel List */}
        <div className="w-3/4 max-w-6xl space-y-6 absolute z-10 top-10 mt-16 overflow-y-auto h-2/3 px-4">
          {/* Single Hotel Card */}
          {favData.map((fav, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md flex justify-between items-center p-6"
            >
              {/* Hotel Image and Info */}
              <div className="flex space-x-6">
                {/* Image */}
                <div className="w-40 h-40 rounded-lg overflow-hidden">
                  {fav.cage_room.profile.image_array &&
                  fav.cage_room.profile.image_array.length > 0 ? (
                    <img
                      src={fav.cage_room.profile.image_array[0]}
                      alt="Cage Room"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img></img>
                  )}
                </div>

                {/* Hotel Info */}
                <div>
                  <h2 className="text-xl font-semi text-[#333]">
                    {fav.cage_room.profile.name || "Unknown Hotel"}
                  </h2>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">
                      {i < Math.floor(fav.cage_room.profile.avg_review) ? (
                        <i
                          className="fa-solid fa-star"
                          style={{ color: "#DBA54D" }}
                        ></i> // Full star
                      ) : i < fav.cage_room.profile.avg_review ? (
                        <i
                          className="fa-solid fa-star-half-alt"
                          style={{ color: "#DBA54D" }}
                        ></i> // Half star
                      ) : (
                        <i
                          className="fa-regular fa-star"
                          style={{ color: "#DBA54D" }}
                        ></i> // Empty star
                      )}
                    </span>
                  ))}
                  <div className="text-gray-500 mb-2 flex justify-between">
                    <span>{fav.cage_room.profile.address || ""}</span>
                    <span className="px-2">
                      {fav.cage_room.profile.Distance
                        ? (
                            Math.floor(fav.cage_room.profile.Distance * 10) / 10
                          ).toFixed(1)
                        : ""}{" "}
                      km
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">Facilities:</span>{" "}
                    {fav.cage_room.profile.facility || "No facilities listed"}
                  </p>
                  <div className="flex space-x-2">
                    <p className="bg-navbar text-white text-sm px-2 py-1 rounded">
                      {fav.cage_room.animal_type || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capsule Info */}
              <div className="flex-1 mx-8 border-l pl-6 flex items-start space-x-6">
                {/* Image Section */}
                <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                  {fav.cage_room.image_array &&
                  fav.cage_room.image_array.length > 0 ? (
                    <img
                      src={fav.cage_room.image_array[0]}
                      alt="Cage Room"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img></img>
                  )}
                </div>
                {/* Information Section */}
                <div className="flex flex-col space-y-2">
                  <h3 className="text-[#333] text-xl font-semi">Capsule</h3>
                  <div className="flex items-center space-x-2">
                    <p className="bg-navbar text-white text-sm px-2 py-1 rounded">
                      {fav.cage_room.size || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: ({fav.cage_room.width} x {fav.cage_room.lenth} x{" "}
                      {fav.cage_room.height} m)
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-meduim">Accomodates :</span>{" "}
                    {fav.cage_room.max_capacity || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-meduim">Facilities:</span>&nbsp;
                    {fav.cage_room.facility || "N/A"}
                  </p>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex flex-col items-end space-y-4">
                <span className="text-lg font-bold text-[#333]">
                  {fav.cage_room.price} ฿
                </span>
                <div className="flex space-x-4">
                  <button
                    className="bg-white text-sm text-black px-3 py-2 rounded-2xl border border-black focus:outline-none focus:ring-2 focus:ring-black"
                    onClick={() => handleRemoveFavorite(fav.cage_room)}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-[#CBAD87] text-sm text-white px-3 py-2 rounded-2xl"
                    onClick={() => handleCageSelect(fav.cage_room)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
