import CageCard from "@/components/Hotel-Bookdetail/CageCard";
import PetCard from "@/components/Hotel-Bookdetail/PetCard";
import { Cage } from "@/types/response";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetTypeAnimalByUserID } from '@/helper/animal_user';

function HotelBookdetail() {
    // Get search parameters from the URL
    const [searchParams] = useSearchParams();
    const cage_type = searchParams.get('cage_type');
    const size = searchParams.get('size');
    const price = searchParams.get('price');
    const facility = searchParams.get('facility');
    const max_capacity = searchParams.get('max_capacity');
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const lenth = searchParams.get('lenth');

    // State to manage selected pets and error messages
    const [selectedPets, setSelectedPets] = useState<number[]>([]);
    const [error, setError] = useState<string>('');

    // Get location and navigation hooks
    const location = useLocation();
    const navigate = useNavigate();

    // Get state from location
    const selectedCage = location.state?.selectedCage || [];
    // const selectedHotel = location.state?.selectedHotel || [];
    const startDate = location.state?.startDate || '';
    const endDate = location.state?.endDate || '';
    // const profile_name = location.state?.profile_name || '';

    // State to manage pets and pet form visibility
    const [pets, setPets] = useState<any[]>([]);
    const [showPetForm, setShowPetForm] = useState<boolean>(true);

    // Fetch pets when the component mounts
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;
                const response = await GetTypeAnimalByUserID(Number(userId), selectedCage.animal_type);
                setPets(response);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, []);

    // Toggle pet form visibility
    const handleAddPetClick = () => {
        setShowPetForm(!showPetForm);
    };

    // Handle hotel click and navigate to the payment page
    const handleHotelClick = (selectedCage: Cage) => {
        if (!selectedPets || selectedPets.length === 0) {
            setError('Please select at least one pet');
            console.log(error)
            return;
        }
        const hotelName = location.state?.profile_name || selectedCage.profile?.name || "Default Hotel";
        navigate('/hotelselectpayment', {
            state: {
                selectedCage: {
                    ...selectedCage,
                    cage_type: selectedCage.cage_type,
                    price: selectedCage.price,
                    size: selectedCage.size,
                    width: selectedCage.width,
                    height: selectedCage.height,
                    lenth: selectedCage.lenth,
                    facility: selectedCage.facility || "",
                    max_capacity: selectedCage.max_capacity
                },
                hotelName,
                selectedPets: selectedPets,
                startDate: startDate,
                endDate: endDate
            }
        });
    };

    return (
        <div className="grid grid-row-3 gap-16">
            {/* Step Indicator */}
            <div className="max-w-2xl w-full mx-auto mt-10">
                <ol className="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base">
                    <li className="flex w-full relative text-black after:content-[''] after:w-full after:h-2 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-5 after:left-6">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-onstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">1</span>
                            <p className="text-center">Book Detail</p>
                        </div>
                    </li>
                    <li className="flex w-full relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-gray-200 before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5 after:content-[''] after:w-full after:h-2 after:bg-gray-200 after:inline-block after:absolute after:right-0 lg:after:top-5 after:top-5">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-nextstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">2</span>
                            <p className="text-center">Payment</p>
                        </div>
                    </li>
                    <li className="flex relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-gray-200 before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-nextstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">3</span>
                            <p className="text-center">Book Success</p>
                        </div>
                    </li>
                </ol>
            </div>

            {/* Room and Pet Selection */}
            <div className="max-w-5xl w-full mx-auto">
                <p className="text-2xl ">Room</p>
                <CageCard
                    cage_type={cage_type ?? ""}
                    size={size ?? ""}
                    price={price ?? ""}
                    facility={facility ?? ""}
                    max_capacity={max_capacity ?? ""}
                    width={width ?? ""}
                    height={height ?? ""}
                    lenth={lenth ?? ""}
                    startDate={startDate ?? ""}
                    endDate={endDate ?? ""}
                />
                <div className="flex justify-between">
                    <p className="text-2xl ">Pet</p>
                    {selectedPets.length === 0 && (
                        <button
                            className="w-fit px-4 h-8 rounded-full shadow shadow-gray-400 bg-[#CBAD87] text-white"
                            onClick={handleAddPetClick}
                        >
                            Add Pet
                        </button>
                    )}
                </div>
                <PetCard
                    pets={pets}
                    onPetSelect={(petId: number) => {
                        setSelectedPets(prev =>
                            prev.includes(petId)
                                ? prev.filter(id => id !== petId)
                                : [...prev, petId]
                        );
                        setShowPetForm(false);
                    }}
                    showPetForm={showPetForm}
                />
            </div>

            {/* Navigation Buttons */}
            <div className="max-w-sm w-full mx-auto mb-10">
                <div className="flex justify-between space-x-6">
                    <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400 " onClick={() => navigate(-1)}>Back</button>
                    <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={() => handleHotelClick(selectedCage)}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default HotelBookdetail;