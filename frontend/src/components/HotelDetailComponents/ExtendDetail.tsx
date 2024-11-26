
import React from "react";

interface ExtendProps {
  facilityArray: string[];
  image?: string;
  size?: string;
  capacity?: string;
  price?: string;
}

export default function ExtendDetail({
  facilityArray = [],
  image = "public/images/homebg.jpg",
  size = "N/A",
  capacity = "N/A",
  price = "350B",
}: ExtendProps) {
  return (
    <div className="bg-bg rounded-lg flex flex-col w-full h-96 shadow shadow-gray-400">
      <div className="bg-bg shadow shadow-gray-400 w-auto h-full m-5 flex flex-col gap-y-2 p-5 rounded-lg">
        {/* Capsule Section */}
        <div className="flex">Capsule</div>

        {/* Image Section */}
        <div className="flex justify-center bg-green w-full h-full">
          <div
            className="bg-cover h-full w-72"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        </div>

        {/* Detail Section */}
        <div className="">Detail</div>

        {/* Information Section */}
        <div className="flex bg-green-500">
          <p className="w-1/2 p-5">
            dfasdfjgasdjglkasjdglkjasdlkgjlkadsjgljldsglsda
          </p>
          <div className="flex flex-col w-1/2 bg-blue-500 items-end p-5">
            <p>Size: {size}</p>
            <p>Capacity: {capacity}</p>
            <p>Price: {price}</p>
          </div>
        </div>

        {/* Room Facility Section */}
        <p>Room Facility</p>
        <div className="flex w-full">
          <div className="flex flex-wrap gap-x-2 w-1/2 p-5 bg-orange-400">
            {facilityArray.length > 0 ? (
              facilityArray.map((facility, index) => (
                <button
                  key={index}
                  className="w-28 h-10 bg-bg rounded-md shadow shadow-gray-400"
                >
                  {facility}
                </button>
              ))
            ) : (
              <p>No facilities available.</p>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex flex-col items-end p-5 bg-blue-300 w-1/2 gap-y-2">
            <p>Cancel</p>
            <div className="flex space-x-2">
              <button className="w-fit px-2 h-8 bg-bg rounded-full shadow">
                Add to Cart
              </button>
              <button className="w-fit px-2 h-8 rounded-full bg-yellow">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
