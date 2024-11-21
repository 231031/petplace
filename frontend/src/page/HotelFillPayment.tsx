import { Cage } from '@/types/response';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentSelect() {
    const [select, setSelect] = useState<number | null>(0);
    const navigate = useNavigate();
    const handleSelect = (choice: number) => {
        setSelect(choice);
    };
    const location = useLocation();
    const selectedCage = location.state.selectedCage;
    const handleCaegClick = (selectedCage: Cage) => {
        navigate('/hotelbooksuccess', { state: { selectedCage: selectedCage } });
    };
    console.log("kuy",selectedCage);
    return (
        <div>
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
                            <p className="text-xl font-bold mb-4">Credit/Debit Card</p>
                            <div className='grid grid-row-2 gap-2'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Card Type</label>
                                    <div className='grid grid-cols-4 gap-4'>
                                        <select className="w-full mt-1 border border-gray-300 text-gray-700 rounded-md p-2">
                                            <option value="" disabled selected hidden>Select type</option>
                                            <option value="master-card">Master Card</option>
                                            <option value="visa">Visa</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Card Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Enter name"
                                        />
                                    </div>


                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="XXXX-XXXX-XXXX"
                                        />
                                    </div>


                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="MM/YY"
                                        />
                                    </div>


                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">CVC</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="XXX"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-sm w-full mx-auto mb-10">
                    <div className="flex justify-between space-x-6">
                        <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400" onClick={() => { navigate(-1) }}>Back</button>
                        <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={() => { handleCaegClick(selectedCage)}}>Next</button>
                    </div>
                </div>


            </div>
        </div>
    );
}
