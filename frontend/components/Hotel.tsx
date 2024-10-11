import Dropdown from '../components/Dropdown/Dropdown';
import Search from '../components/Search/Search';

// const options = [
//   'one', 'two', 'three'
// ];
// const defaultOption = options[0];
// <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;


function Hotel() {
  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-4 flex-row">
        <h1 className="flex justify-center mt-20  text-2xl font-bold tracking-tight text-gray-900">
          FIND YOUR PET HOTEL
        </h1>
        <div className="mx-20 bg-red-400">
          <div className="">
            <span className="bg-slate-400 flex mt-10">Pet</span>
            <div className="grid grid-cols-12 gap-y-4 bg-green-300">
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
                  Cat
                </label>
              </div>
            </div>
            <span className="bg-slate-400 flex mt-10">Date</span>

            <div className="">
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
            </div>
            <span className="bg-slate-400 flex mt-10">Location</span>
            {/* vvv
            <Dropdown 
            onOptionClick={(option) => {console.log(option)} }
            options={[
              '1',
              '2',
              '3'
            ]}
            
            />
            vvvv */}
          <Search/>
          </div>
        </div>
      </div>
      <div className="col-span-6 flex justify-center">04</div>
    </div>
  );
}

export default Hotel;
