import PetCard from "@/components/Hotel-Bookdetail/PetCard";
import { GetTypeAnimalByUserID } from "@/helper/animal_user";
import { GetHotelServiceByID } from "@/helper/hotel";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HotelBookAgain() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [hotelService, setHotelService] = useState<any>(null); // สถานะสำหรับเก็บข้อมูลโรงแรม
    const [hotelServiceID, sethotelServiceID] = useState<any>(null);
    const [selectedPets, setSelectedPets] = useState<number[]>([]);
    const [pets, setPets] = useState<any[]>([]);
    const [showPetForm, setShowPetForm] = useState<boolean>(true);


    const [error, setError] = useState<string | null>(null);
    console.log("aaa", hotelServiceID)

    useEffect(() => {
        const { hotelServiceID } = location.state || {};
        sethotelServiceID(hotelServiceID);
    }, [])

    useEffect(() => {
        const fetchHotelService = async () => {
            try {
                const serviceData = await GetHotelServiceByID(hotelServiceID);
                setHotelService(serviceData);
            } catch (err) {
                setError("ไม่สามารถดึงข้อมูลบริการโรงแรมได้");
                console.error(err);
            } 
            console.log("Test", hotelService);
        };
        fetchHotelService();
    }, [hotelServiceID]);




    const handleAddPetClick = () => {
        setShowPetForm(!showPetForm);
    };

    return (
        <div className="grid grid-row-3 gap-16">
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



            <div className="max-w-5xl w-full mx-auto">

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

        </div>
    )
}
export default HotelBookAgain;