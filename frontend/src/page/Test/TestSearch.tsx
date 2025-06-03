import { Cage, Profile } from "@/types/response";
import { useNavigate, useLocation } from 'react-router-dom';

function HotelSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const hotels = location.state?.hotels || [];

    const handleHotelClick = (hotel: Profile) => {
        // Navigate to "/hotelbookdetail" and pass the hotel data as state
        navigate('/test/selectroom', { state: { selectedHotel: hotel } });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Hotel Search Results</h1>
            <ul>
                {hotels.map((hotel: Profile, index: number) => (
                    <li
                        key={index}
                        className="mb-4 p-4 border border-gray-300 rounded-lg"
                        onClick={() => handleHotelClick(hotel)} // Add click handler
                        style={{ cursor: 'pointer' }} // Change cursor to indicate clickable items
                    >
                        <h2 className="text-xl font-semibold">{hotel.name}</h2>
                        <p className="text-black">Longitude: {hotel.longitude}</p>
                        <p className="text-black">Latitude: {hotel.latitude}</p>
                        <h3 className="text-lg font-semibold mt-2">Cages:</h3>
                        {hotel.cages ? (
                            <ul className="list-disc list-inside">
                                {hotel.cages.map((cage: Cage, cageIndex: number) => (
                                    <li key={cageIndex} className="ml-4">
                                        <p className="text-black">ID: {cage.id}</p>
                                        <p className="text-black">Size: {cage.size}</p>
                                        <p className="text-black">Price: {cage.price} THB</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-black">No cages available</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default HotelSearch;