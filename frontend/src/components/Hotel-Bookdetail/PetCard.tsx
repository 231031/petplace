function PetCard() {
    return (
        <div className="p-3 rounded-lg shadow shadow-gray-400 flex m-5 ">
            {/* Image section */}
            <div className="flex items-center justify-center w-52 h-52 bg-gray-200 rounded-lg">
                {/* Icon for download */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-10 h-10 text-gray-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </div>

            {/* Form section */}
            <div className="ml-6 space-y-4">
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <label className="block text-sm text-black">Pet name:</label>
                        <input
                            type="text"
                            placeholder="ex. kitty"
                            className="border rounded-3xl p-2 h-10 mx-2 shadow shadow-gray-400 "
                        />
                    </div>

                </div>
                <div className="flex space-x-4 ">
                    <div className="flex items-center">
                        <label className="block text-sm text-black ">Pet type:</label>
                        <select className="border- rounded-3xl p-2  mx-2 test-xs shadow shadow-gray-400">
                            <option>Select type</option>
                            <option>Dog</option>
                            <option>Cat</option>
                            <option>Bird</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <label className="block text-sm text-blaxk">Pet breed:</label>
                        <input
                            type="text"
                            placeholder="ex. persian"
                            className="h-10 mx-2 border rounded-3xl p-2 shadow shadow-gray-400 "
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <label className="block text-sm text-black">Weight:</label>
                        <input
                            type="text"
                            placeholder="ex. 3.6kg"
                            className="h-10 mx-2 border rounded-3xl p-2 w-full shadow shadow-gray-400"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="block text-sm text-black">Age:</label>
                        <input
                            type="text"
                            placeholder="ex. 2.5y"
                            className="mx-2 border rounded-3xl shadow shadow-gray-400 h-10 w-20"
                        />
                    </div>
                </div>
            </div>

            {/* Button section */}
            <div className="ml-auto flex items-start">
                <button className="bg-[#9B835F] text-white rounded-md py-2 px-4 hover:bg-[#7a684b]">
                    Select your pet
                </button>
            </div>
        </div>

    )
}
export default PetCard;