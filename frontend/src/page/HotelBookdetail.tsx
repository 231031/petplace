import CageCard from "@/components/Hotel-Bookdetail/CageCard";
import PetCard from "@/components/Hotel-Bookdetail/PetCard";
import { Cage, Profile } from "@/types/response";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function HotelBookdetail() {
    const [searchParams] = useSearchParams();
    const cage_type = searchParams.get('cage_type')
    const size = searchParams.get('size')
    const price = searchParams.get('price')
    const facility = searchParams.get('facility')
    const max_capacity = searchParams.get('max_capacity')

    const location = useLocation();
    const navigate = useNavigate();
    const selectedCage = location.state?.selectedCage || [];
    console.log("Hee",selectedCage);

    // const handleHotelClick = (hotel: Profile) => {
    //     navigate('/hotelcpayment', { state: { selectedHotel: hotel } });
    //   };
    const handleHotelClick = (selectedCage: Cage) => {
        navigate('/hotelcpayment', { state: { selectedCage: selectedCage } });
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
                <p className="text-2xl ">Room</p>
                <CageCard 
                cage_type={cage_type ?? ""} 
                size={size ?? ""}
                price={price ?? ""}
                facility={facility ?? ""} 
                max_capacity ={max_capacity ?? ""}

                />
                <div className="flex justify-between">
                    <p className="text-2xl ">Pet</p>
                    <button className="w-fit px-2 h-8  rounded-full shadow shadow-gray-400">Add Pet</button>
                </div>
                <PetCard />
            </div>
            <div className="max-w-sm w-full mx-auto mb-10">
                <div className="flex justify-between space-x-6">
                    <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400 "  onClick={()=>navigate(-1)}>Back</button>
                    <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={()=>handleHotelClick(selectedCage)}>Next</button>
                </div>
            </div>
        </div>
        
    )
}

export default HotelBookdetail;