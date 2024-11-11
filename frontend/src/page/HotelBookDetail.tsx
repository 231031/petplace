import { useState } from 'react';

export default function PaymentSelect() {
    const [select, setSelect] = useState<number | null>(0);

    const handleSelect = (choice: number) => {
        setSelect(choice);
    };

    return (
        <div>
            <p className="text-2xl font-bold max-w-6xl w-full mx-auto">Select Payment</p>
            <div className="flex flex-col gap-3 max-w-7xl mx-auto">


                <div className={`${select === 1 ? "opacity-100" : "opacity-50"} `}>
                    <div className="flex items-center">
                        <input
                            className="rounded-full"
                            type="checkbox"
                            onChange={() => handleSelect(1)}
                            checked={select === 1}
                        />
                        <div className="bg-gray-200 w-full p-6 ml-12">
                            <p className="text-xl font-bold mb-4">Credit/Debit Card</p>

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


                <div className={`${select === 2 ? "opacity-100" : "opacity-50"} `}>
                    <div className="flex items-center">
                        <input
                            className="rounded-full "
                            type="checkbox"
                            onChange={() => handleSelect(2)}
                            checked={select === 2}
                        />
                        <div className="bg-gray-200 w-full p-6 ml-12">
                            <p className="text-xl font-bold mb-4">QR Code</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
