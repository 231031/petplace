import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetSearchCage } from "../helper/cage";
import { FilterAnimal, FilterSearchCage } from "../types/payload";

function Home  () {
 
  
    const [hotels, setHotels] = useState<any[]>([]);
    const [longitude, setLongtitude] = useState("");
    // const [latitude, setLatitude] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const navigate = useNavigate();
    const petOptions = ["dog", "Cat", "Fish", "Bird", "Chinchilla", "Ferret", "Rabbit", "Hamster", "Hedgehog", "Sugar Glider"];
  
    
    const handlePetChange = (pet: string) => {
        setSelectedPets((prev) =>
          prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
        );
    };



    const handleSearch = async () => {
        const filterAnimal: FilterAnimal[] = selectedPets.map((pet) => ({
            animal_type: pet,
            cage_size: "m",
          }));
      
        const filterSearchCage: FilterSearchCage = {
            longitude: "99.3986862",
            latitude: "18.3170581",
            start_time: startDate,
            end_time: endDate
        };
      
          try {
            const results = await GetSearchCage(filterAnimal, filterSearchCage);
            setHotels(results.data);
            console.log("Results:", results);
            navigate('/hotelsearch', { state: { hotels: results } });
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
                <div className ="absolute z-20 top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center">
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
                <div className="w-3/4 absolute z-10 top-12 h-200 bg-white p-8 rounded-lg shadow-lg">
                    {/* Location section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white mt-8">
                            <label htmlFor="location" className="block text-lg font-semibold mb-2">
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
                            <label className="block text-red-900 text-lg font-semibold mb-4">
                                Pet
                            </label>
                            <div className="grid grid-cols-2 gap-4">
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
                
                {/* <ul>
                    {hotels.map((hotel, index) => (
                    <li key={index}>
                        <h2>{hotel.name}</h2>
                        <p>Location: {hotel.longitude}</p>
                        <p>Price: {hotel.price} THB</p>
                    </li>
                    ))}
                </ul> */}
            
            </div>
            </div>
    
                
            {/* Third Section */}
            <div className="w-full h-3/4 p-4 bg-yellow shadow  flex justify-center items-center relative">
                <div className="w-1/4 bg-white rounded-lg absolute z-20 mt-4 top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4"
                        >
                        <a href="/" className="text-xl text-yellow p-2">Hotel</a>
                        <a href="/" className="text-xl text-yellow p-2">Care</a>
                        <a href="/" className="text-xl text-yellow p-2">Clinic</a>
                        <a href="/" className="text-xl text-yellow p-2">Delivery</a>
                </div>

                {/* Hotel List */}
                <div className="w-3/4 max-w-6xl space-y-6 absolute z-10 mt-4">
                    {/* Single Hotel Card */}
                    {[1,2].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md flex justify-between items-center p-6"
                    >
                        {/* Hotel Image and Info */}
                        <div className="flex space-x-6">
                        {/* Image */}
                        <div className="w-40 h-40 rounded-lg overflow-hidden">
                            <img
                            src="https://via.placeholder.com/150"
                            alt="Hotel"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Hotel Info */}
                        <div>
                            <h2 className="text-lg font-bold text-[#333] mb-2">Hotel Name</h2>
                            {/* Rating */}
                            <div className="flex items-center mb-2">
                            <div className="text-yellow-500 text-sm flex space-x-1">
                                {[1, 2, 3, 4].map((star) => (
                                <span key={star}>★</span>
                                ))}
                                <span className="text-gray-400">★</span>
                            </div>
                            </div>
                            {/* Location */}
                            <p className="text-gray-500 mb-2">Distinct, Province · 0.5 km</p>
                            {/* Facilities */}
                            <p className="text-gray-600 text-sm">
                            Facility: Air, Bed, Open toilet
                            </p>
                            {/* Supported Pets */}
                            <div className="flex space-x-2 mt-4">
                            {["Cat", "Rabbit", "Hamster"].map((pet) => (
                                <span
                                key={pet}
                                className="text-xs bg-[#A08252] text-white px-3 py-1 rounded-lg"
                                >
                                {pet}
                                </span>
                            ))}
                            </div>
                        </div>
                        </div>

                        {/* Capsule Info */}
                        <div className="flex-1 mx-8 border-l pl-6">
                        <h3 className="text-[#333] font-bold mb-2">Capsule</h3>
                        <span className="text-xs bg-[#A08252] text-white px-3 py-1 rounded-lg">
                            S
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                            Size 1.2 x 1.2 x 1.1 m
                            <br />
                            Accommodates: 1
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Facility: Air, Bed, Open toilet
                        </p>
                        <a href="/" className="text-[#A08252] text-sm underline mt-2 block">
                            More detail
                        </a>
                        </div>

                        {/* Price and Button */}
                        <div className="flex flex-col items-end space-y-4">
                        <span className="text-lg font-bold text-[#333]">350 ฿</span>
                        <button className="bg-[#A08252] text-white text-sm px-6 py-2 rounded-lg hover:bg-[#8a6e45] transition">
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