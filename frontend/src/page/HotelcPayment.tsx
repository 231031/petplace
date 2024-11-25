import { Cage } from "@/types/response";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



export default function HotelcPayment() {
    const [select, setSelect] = useState<number | null>(0);
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCage = location.state?.selectedCage || [];

    const handleSelect = (choice: number) => {
        setSelect(choice);
    };
    const handleCaegClick = (selectedCage: Cage) => {
        navigate('/hotelfillpayment', { state: { selectedCage: selectedCage } });
    };

    return (
        <div className="h-screen">
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
                            <span className="w-8 h-8 bg-onstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">2</span>
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



            <p className="text-2xl font-bold max-w-6xl w-full mx-auto mt-5">Select Payment Method</p>
            <div className="flex flex-col gap-3 max-w-7xl mx-auto mt-5">
                <div className={`${select === 1 ? "opacity-100" : "opacity-50"} `}>
                    <div className="flex items-center">
                        <input
                            className="rounded-full"
                            type="checkbox"
                            onChange={() => handleSelect(1)}
                            checked={select === 1}
                        />
                        <div className="shadow shadow-gray-400 w-full p-6 ml-12">
                            <p className="text-xl font-bold mb-8">Credit/Debit Card</p>
                            <img src="https://madduckjewels.com/wp-content/uploads/2019/09/Visa-MasterCard-300x175-300x175.png" alt="Credit/Debit Card" className="w-60 h-36 shadow shadow-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="max-w-sm w-full mx-auto mb-10">
                    <div className="flex justify-between space-x-6">
                        <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400" onClick={() => { navigate(-1) }}>Back</button>
                        <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={() => {handleCaegClick(selectedCage)}}>Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
}