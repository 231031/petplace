import { Cage } from "@/types/response";
import {useLocation, useNavigate } from "react-router-dom";

export default function HotelBookSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCage = location.state?.selectedCage;
    const handleBookSuccessClick = (selectedCage: Cage) => {
        navigate('/hotelhis', { state: { selectedCage: selectedCage } });
      };

    return (
        <div className="h-screen">
            <div className="max-w-2xl w-full mx-auto mt-10">
                <ol className="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base">
                    <li className="flex w-full relative text-black after:content-[''] after:w-full after:h-2 after:bg-yellow after:inline-block after:absolute lg:after:top-5 after:top-5 after:left-6">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-onstep  border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">1</span>
                            <p className="text-center">Book Detail</p>
                        </div>
                    </li>
                    <li className="flex w-full relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-yellow before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5 after:content-[''] after:w-full after:h-2 after:bg-yellow after:inline-block after:absolute after:right-0 lg:after:top-5 after:top-5">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-onstep  border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">2</span>
                            <p className="text-center">Payment</p>
                        </div>
                    </li>
                    <li className="flex relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-yellow before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-onstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">3</span>
                            <p className="text-center">Book Success</p>
                        </div>
                    </li>
                </ol>
            </div>

            <div className="max-w-2xl w-full  rounded-md  mx-auto mt-20 shadow shadow-gray-600">
                <div className="grid grid-rows-2 gap-10 justify-center">
                    <p className="text-4xl font-semibold mt-10">
                        Booking Success
                    </p>
                    <div className="flex justify-between space-x-1 text-sm">
                        <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400" onClick={()=>{navigate('/')}}>Find More Sevice</button>
                        <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={()=>{handleBookSuccessClick(selectedCage)}}>View History</button>
                    </div>
                </div>
            </div>

        </div>
    );
}