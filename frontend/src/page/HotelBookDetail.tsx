import { useState } from "react";

function HotelBookDetails() {
    const [select, setSelect] = useState(1);
    return (
        <div className="flex-col justify-between ">
            <div className="max-w-2xl w-full mx-auto">
                <ol className="flex justify-center">
                    <li className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
                        <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                            <svg className="w-3.5 h-3.5 text-blue-600 lg:w-4 lg:h-4 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                        </span>

                        <p className="text-center text-blue-600 dark:text-blue-300 mt-2">Step 1</p>
                    </li>
                    <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
                        <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                            <svg className="w-4 h-4 text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                            </svg>
                        </span>
                    </li>
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                            <svg className="w-4 h-4 text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            </svg>
                        </span>
                    </li>
                </ol>

            </div>

            <div className="p-20">
                <p className="text-2xl font-bold">Select Payment</p>
                <div className={`${select=== 1 ? "text-red-600":"text-green-600"} flex  `} >
                    <input type='checkbox'></input>
                        <p>Choice1</p>
                </div>
                <div className={`${select=== 2 ? "text-red-600":"text-green-600"} flex  `} >
                    <input type='checkbox'></input>
                        <p>Choice2</p>
                </div>
            </div>

        </div>
    )



}
export default HotelBookDetails;