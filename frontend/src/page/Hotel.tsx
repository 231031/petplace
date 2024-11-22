import Search from "../components/Hotel-Search/Search";
import HotelData from "../components/Hotel-Search/HotelData";



function Hotel() {
  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-4 flex-row">
        <h1 className="flex justify-center mt-20  text-2xl font-bold tracking-tight text-gray-900">
          FIND YOUR PET HOTEL
        </h1>
        <div className="mx-20 ">
          <div className="">
            <span className="bg-slate-300 flex mt-10 ">
              <label className="ml-10">Pet</label>
              </span>
            <div className="grid grid-cols-12 gap-y-4 ">
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Dog
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Rabbit
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Chinchilla
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Cat
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Hamster
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Ferret
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Fish
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Hedgehog
                </label>
              </div>
              <div className="col-span-4 bg-red-500 text-center">
                <input
                  type="checkbox"
                  value=""
                  className="w-4 h-4 mx-flex text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 ml=20"
                />
                <label className="w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-900 ml-2">
                  Bird
                </label>
              </div>
            </div>
            <span className="bg-slate-300 flex mt-10 mb-10">
              <label className="ml-10">
              Date
                </label>
                </span>

            <div className=" ">
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  id="default-datepicker"
                  type="text"
                  className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                />
              </div>
            </div>

            <div className="my-5 w-1/2 h-auto p-4 bg-gray-100 border border-gray-200 rounded-lg flex justify-center items-center">
              Calendar
            </div>

            <div
              id="date-range-picker"
              date-rangepicker
              className="flex items-center"
            >
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  id="datepicker-range-start"
                  name="start"
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date start"
                />
              </div>
              <span className="mx-4 text-gray-500">to</span>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  id="datepicker-range-end"
                  name="end"
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date end"
                />
              </div>
            </div>
            <span className="bg-slate-300 flex mt-10">
              <label className="ml-10">Location</label></span>

            <Search />
          </div>
        </div>
      </div>
      <div className="col-span-6 flex row">
        <div className="">
          <div className="grid grid-cols-10 gap-4">
            <button
              type="submit"
              className="text-white mt-2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
              Sort By
            </button>

            <button
              type="submit"
              className="text-white mt-2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
              Distance
            </button>
            <button
              type="submit"
              className="text-white mt-2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
              Price
            </button>
            <button
              type="submit"
              className="text-white mt-2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
              Rating
            </button>
            <button
              type="submit"
              className="text-white mt-2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
              Hotdeal
            </button>
          </div>
          {/* <CardHotel/> */}
          <HotelData hotelList={undefined}/>
          {/* <div className="grid grid-cols-10 gap-4 bg-red-700">
            <div className="col-span-2">
              <img
                src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                className="w-full h-full object-cover object-center rounded-lg"
              />
              <div className="flex flex-row gap-4">
                <h5>cat</h5>
                <h5>rabbit</h5>
                <h5>hamster</h5>
              </div>
            </div>

            <div className="col-span-8">
              <h1>Hotel Name</h1>
              <h1>*****</h1>
              <h2>Distince, Province 0.5 km</h2>
              <h2>Facility:Air, Bed, Open toilet</h2>
              <h1 className="flex justify-end mr-10">Before include tax</h1>
            </div>
            <HotelData/>
          </div> */}

        </div>
      </div>
    </div>

  );
}

export default Hotel;
