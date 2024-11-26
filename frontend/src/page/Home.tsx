import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { GetSearchCage } from "../helper/cage";
import { FilterAnimal, FilterSearchCage } from "../types/payload";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { GetAllFavCageByUserID } from "@/helper/user";
import { Cage } from "@/types/response";
import { useLocation } from "react-router-dom";
import L from 'leaflet';

function Home() {
    const [hotels, setHotels] = useState<any[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const navigate = useNavigate();
    const petOptions = ["Dog", "Cat", "Fish", "Bird", "Chinchilla", "Ferret", "Rabbit", "Hamster", "Hedgehog", "Sugar Glider"];
    const [selectedCageSizes, setSelectedCageSizes] = useState<{ [key: string]: string }>({});
    const [rooms, setRooms] = useState<any[]>([]);
    const [favRooms, setFavRooms] = useState<any[]>([]);
    const location = useLocation();
    const [cageDetails, setCageDetails] = useState<any[]>([]);

    const [error, setError] = useState(''); // Form error
    const [geoError, setGeoError] = useState<string | null>(null); // Geolocation error
    const [successMessage, setSuccessMessage] = useState('');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null); // Track marker position
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [maplocation, setMapLocation] = useState({
        long: '',
        lat: '',
    });

    const [searchedPosition, setSearchedPosition] = useState<[number, number] | null>(null); // Position from search or click

    // Create sets to collect unique values
    const uniqueAnimalTypes = new Set<string>();
    const uniqueFacilities = new Set<string>();
    
    // Iterate through rooms to populate sets
    rooms.forEach((room) => {
        if (room.animal_type) uniqueAnimalTypes.add(room.animal_type);
        if (room.facility) uniqueFacilities.add(room.facility);
    });

    const handleCageSelect = (cage: Cage) => {
        const queryParams = new URLSearchParams({
            size: cage.size,
            cage_type: cage.cage_type,
            facility: cage.facility,
            price: cage.price.toString(),
            max_capacity: cage.max_capacity.toString(), 
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

    const handleCageSizeChange = (pet: string, size: string) => {
        setSelectedCageSizes((prev) => ({
            ...prev,
            [pet]: size,
        }));
    };

    const handlePetChange = (pet: string) => {
        setSelectedPets((prev) =>
            prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
        );
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setMapLocation({ ...location, lat: lat.toString(), long: lng.toString() });
        setMarkerPosition([lat, lng]); // Update the marker position
    };
    
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setSearchedPosition([e.latlng.lat, e.latlng.lng]); // Store clicked position
            },
        });
        return (
            <Marker position={searchedPosition || [13.736717, 100.523186]}>
                <Popup>Selected Location</Popup>
            </Marker>
        );
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    handleLocationChange(latitude, longitude); // Update formData with initial position
                    
                },
                (err) => {
                    setError('Unable to retrieve your location.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");
        const fetchCageRooms = async () => {
            try {
              const id = localStorage.getItem("userId");
              const data = await GetAllFavCageByUserID(parseInt(id as string));
            //   console.log("FAV cage:", data);
              setFavRooms(data || []);
              console.log("FAV cage room:", favRooms);
            } catch (error) {
              console.error("Error fetching cage room data:", error);
            }
          };
        fetchCageRooms();

        fetch(`http://localhost:5000/api/cageroom/all/${id}`, {
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
            setRooms(data|| []);
          })
          .catch((error) => console.error("Error fetching cage room data:", error));
      }, []);
      
      useEffect(() => {
        const fetchCageDetails = async (cageId: number, token: string) => {
            try {
              const response = await fetch(`http://localhost:5000/api/cageroom/${cageId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              });
              if (!response.ok) throw new Error("Failed to fetch cage details");
              return await response.json();
            } catch (error) {
              console.error("Error fetching cage details:", error);
            }
          };
      if (favRooms.length > 0) {
        const token = localStorage.getItem("token");
        // Fetch details for each cage in the favorite rooms list
        const fetchAllCageDetails = async () => {
          const details = await Promise.all(
            favRooms.map(async (room) => {
              const data = await fetchCageDetails(room.cage_id, token as string);
              return data;
            })
          );
          setCageDetails(details);
          console.log("Cage details:", cageDetails);
          console.log("Cage room test:", cageDetails.map(cage => cage.animal_type));
        };
        fetchAllCageDetails();
      }
    },[]);

    useEffect(() => {
        // Fetch user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    setSearchedPosition([latitude, longitude]); // Default search position
                },
                () => {
                    setError('Unable to retrieve your location.');
                    setPosition([13.736717, 100.523186]); // Default to Bangkok
                    setSearchedPosition([13.736717, 100.523186]); // Default search position
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setPosition([13.736717, 100.523186]);
            setSearchedPosition([13.736717, 100.523186]);
        }
    }, []);

    const MapWithGeocoder = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false, // Do not mark automatically
            }).addTo(map);

            geocoder.on('markgeocode', (e) => {
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

    
    console.log(searchedPosition)

    const handleSearch = async () => {
        const filterAnimal: FilterAnimal[] = selectedPets.map((pet) => ({
            animal_type: pet,
            cage_size: selectedCageSizes[pet] || "",
        }));

        const filterSearchCage = searchedPosition ? {
            longitude: JSON.stringify(searchedPosition[1]),
            latitude: JSON.stringify(searchedPosition[0]),
            start_time: startDate,
            end_time: endDate
        } : null; // or provide a default value if needed
        

        try {
            const results = await GetSearchCage(filterAnimal, filterSearchCage);
            setHotels(results.data);
            console.log("Results:", results);
            navigate('/hotelsearch', {
                state: {
                    hotels: results,
                    startDate: startDate,
                    endDate: endDate
                }
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
                    // src="https://upcdn.io/FW25cHP/raw/uploads/2024/11/20/4kBdTokw6C-Breaking%20new%20Background.webp"
                    className="w-full h-full object-cover object-center"
                />
                <img
                    src="/images/logo.png"
                    className="absolute top-0 left-16 w-64 h-64 z-20"
                />
                <div className="absolute z-20 top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center">
                    <a href="/" className="text-2xl text-white">Grooming</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Delivery</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Hotel Booking</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Clinic</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Shop</a>
                </div>
                <div className="bg-white rounded-lg absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="font-semibold text-2xl px-8 py-2" style={{ color: '#A08252' }}>
                        Find your service
                    </div>
                </div>
            </div>

            {/* Second Section */}
            <div className="w-full h-full p-4 bg-white flex justify-center items-center relative">
                {/* Nav bar */}
                <div className="w-1/4 rounded-lg absolute z-20 mt-4 top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4"
                    style={{ backgroundColor: "#A08252" }}
                >
                    <a href="/" className="text-xl text-white p-2">Hotel</a>
                    <a href="/" className="text-xl text-white p-2">Care</a>
                    <a href="/" className="text-xl text-white p-2">Clinic</a>
                    <a href="/" className="text-xl text-white p-2">Delivery</a>
                </div>
                {/* Search box */}
                <div className="w-3/4 absolute top-12 h-200 bg-white p-8 rounded-lg shadow-lg">
                    {/* Location section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-0">
                            <label htmlFor="location" className="block text-[#A08252] text-lg font-semibold mb-4">
                            Location
                            </label>
                            <div className="flex flex-col w-3/12 gap-y-5 pl-5 ">
                                <div className="bg-bg rounded-xl flex  h-44 w-[37rem] shadow shadow-gray-400 p-1  ">
                                    <div className="h-full w-full rounded-lg">
                                        
                                        {geoError && <div>{geoError}</div>}
                                        <MapContainer
                                            center={position || [13.736717, 100.523186]}
                                            zoom={13}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <LocationMarker />
                                            <MapWithGeocoder/>
                                        </MapContainer>
                                    </div>
                                <div>
                            </div>
                        </div>
                    </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-8">
                            <div>
                                <label htmlFor="start-date" className="block text-lg font-semibold mb-2">
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
                                <label htmlFor="end-date" className="block text-lg font-semibold mb-2">
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
                        <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-0">
                            <label className="block text-[#A08252] text-lg font-semibold mb-4">
                                Pet
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {petOptions.map((pet) => (
                                    <div key={pet} className="flex items-center justify-between space-x-2">
                                        {/* Checkbox and Label */}
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={pet}
                                                checked={selectedPets.includes(pet)}
                                                onChange={() => handlePetChange(pet)}
                                                className="h-5 w-5 text-[#A08252] focus:ring-[#A08252] rounded-full"
                                            />
                                            <span className="text-[#5E4126] font-medium">{pet}</span>
                                        </label>

                                        {/* Dropdown for Cage Size */}
                                        <select
                                            value={selectedCageSizes[pet] || ""}
                                            onChange={(e) => handleCageSizeChange(pet, e.target.value)}
                                            className="w-1/2 border border-[#A08252] rounded-lg px-2 py-1 text-[#5E4126] focus:outline-none focus:ring-2 focus:ring-[#A08252]"
                                        >
                                            <option value="" disabled>
                                                All size
                                            </option>
                                            <option value="s">Small (S)</option>
                                            <option value="m">Medium (M)</option>
                                            <option value="l">Large (L)</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleSearch}
                            className="bg-[#A08252] text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-[#8a6e45] transition duration-200"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="bg-yellow rounded-lg absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="font-semibold text-white text-2xl px-8 py-2">
                        Favorite
                    </div>
                </div>
                <div>
                    <h1>Hotels</h1>
                </div>
            </div>


            {/* Third Section */}
            <div className="w-full h-3/4 p-4 bg-yellow shadow flex justify-center items-center relative overflow-hidden">
                {/* Top Navigation */}
                <div className="w-1/4 bg-white rounded-lg absolute z-20 top-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4">
                    <a href="/" className="text-xl text-yellow p-2">Hotel</a>
                    <a href="/" className="text-xl text-yellow p-2">Care</a>
                    <a href="/" className="text-xl text-yellow p-2">Clinic</a>
                    <a href="/" className="text-xl text-yellow p-2">Delivery</a>
                </div>

                {/* Hotel List */}
                <div className="w-3/4 max-w-6xl space-y-6 absolute z-10 top-10 mt-16 overflow-y-auto h-1/2 px-4">
                    {/* Single Hotel Card */}
                    {cageDetails.map((cage, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md flex justify-between items-center p-6"
                    >
                        {/* Hotel Image and Info */}
                        <div className="flex space-x-6">
                        {/* Image */}
                        <div className="w-40 h-40 rounded-lg overflow-hidden">
                            <img
                            src={cage.image || '/placeholder-image.png'} // Placeholder for missing images
                            alt="Cage Room"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Hotel Info */}

                        
                        <div>
                            <h2 className="text-lg text-[#333] mb-2 flex justify-between">
                            <span className="text-gray-600">Facilities:</span>{' '}
                            {[...uniqueFacilities].map((facility, index) => (
                                <p key={index} className="text-gray-600 ml-4">
                                {facility}
                                </p>
                            ))}
                            </h2>
                            {/* Location */}
                            <p className="text-gray-500 mb-2">
                            {/* {room.detail || 'No additional details provided'} */}
                            </p>
                            {/* Facilities */}
                            <p className="text-gray-600 text-sm flex">
                            {[...uniqueAnimalTypes].map((type, index) => (
                                <p key={index} className="border bg-[#A08252] px-4 py-2 rounded-lg text-white ml-4">
                                {type}
                                </p>
                            ))}
                            </p>
                        </div>
                        
                        </div>

                        {/* Capsule Info */}
                        <div className="flex-1 mx-8 border-l pl-6">
                            <h3 className="text-[#333] text-xl font-bold mb-2">Capsule</h3>
                                <div className="flex">
                                    <p className="text-sm text-gray-600 mt-2 mx-4">
                                        <span className="text-lg bg-[#A08252] text-white px-2 py-1 rounded-lg">
                                            {cage.size}
                                        </span>
                                        <span className="text-lg text-black px-2 py-1">
                                            Size: {cage.width} x {cage.lenth} x {cage.height} m
                                            <br />
                                            Accommodates: {cage.max_capacity}
                                            <br />
                                            Facility : {cage.facility}
                                        </span>
                                    </p>
                                </div>
                        </div>

                        {/* Price and Button */}
                        <div className="flex flex-col items-end space-y-4">
                        <span className="text-lg font-bold text-[#333]">
                            {cage.price} ฿
                        </span>
                        <button
                            className="bg-[#A08252] text-white text-sm px-6 py-2 rounded-lg hover:bg-[#8a6e45] transition"
                            onClick={() => handleCageSelect(cage)}
                        >
                            Book now
                        </button>
                        </div>
                    </div>
                    
                    ))}
                </div>

            </div>

        </div>

    )
}

export default Home;