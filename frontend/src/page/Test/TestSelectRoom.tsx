import { Cage } from '@/types/response';
import { useLocation, useNavigate } from 'react-router-dom';



function HotelBookDetail() {
    const location = useLocation();
    const navigate = useNavigate();    
    const selectedHotel = location.state?.selectedHotel;
    const handleCageSelect = (cage: Cage) => {
        const queryParams = new URLSearchParams({
            size: cage.size,
            cage_type: cage.cage_type,  // Replace with dynamic value if needed
            facility: cage.facility,
            price: cage.price.toString(),
            max_capacity: cage.max_capacity.toString()     // Replace with dynamic value if needed
        }).toString();
    
        // Navigate with query parameters
        navigate(`/hotelbookdetail?${queryParams}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Hotel Booking Details</h1>
            {selectedHotel ? (
                <div>
                    <h2 className="text-xl font-semibold">{selectedHotel.name}</h2>
                    <p className="text-black">Longitude: {selectedHotel.longitude}</p>
                    <p className="text-black">Latitude: {selectedHotel.latitude}</p>
                    <h3 className="text-lg font-semibold mt-2">Cages:</h3>
                    {selectedHotel.cages ? (
                        <ul className="list-disc list-inside">
                            {selectedHotel.cages.map((cage: Cage, index: number) => (
                                <li key={index}>
                                    <p className="text-black">ID: {cage.id}</p>
                                    <p className="text-black">Size: {cage.size}</p>
                                    <p className="text-black">Price: {cage.price} THB</p>
                                    <button 
                                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                                        onClick={() => handleCageSelect(cage)}
                                    >
                                        Select Cage
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No cages available</p>
                    )}
                </div>
            ) : (
                <p>No hotel selected</p>
            )}
        </div>
    );
}

export default HotelBookDetail;
