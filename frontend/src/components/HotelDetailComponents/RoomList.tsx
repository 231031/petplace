export interface Room {
    room_type: string
    room_size: string
    room_size_digit: string
    room_accommodate: number
    room_facility: string
    room_img_url: string
    room_price: number
    room_cancel: string
}
const roomList: Room[] = [{
    room_type: "Capsule",
    room_size: "S",
    room_size_digit: "1.2 x 1.2 x 1.1",
    room_accommodate: 1,
    room_facility: "Air,Bed,Open toilet",
    room_img_url: "https://cdn.prod.website-files.com/602562669ad14425e292589e/6426d4739df8daa248bddc43_IMG_5936-Edit.jpg",
    room_price: 350,
    room_cancel: "8 Oct 2024"
}, {
    room_type: "Capsule",
    room_size: "S",
    room_size_digit: "1.2 x 1.2 x 1.1",
    room_accommodate: 1,
    room_facility: "Air,Bed,Open toilet",
    room_img_url: "https://cdn.prod.website-files.com/602562669ad14425e292589e/6426d4739df8daa248bddc43_IMG_5936-Edit.jpg",
    room_price: 350,
    room_cancel: "8 Oct 2024"
}
]

function RoomList() {
    return (
        <div>
            {roomList.map((room, index) => (
                <div className=" grid grid-cols-4">
                    <div className=" col-span-1 flex justify-center ">
                        <img src={room.room_img_url} className="p-2 h-[200px] w-[300px] rounded-xl " />
                    </div>
                    <div className="bg-white  flex flex-row justify-between   mt-3 rounded-md col-span-3" key={index}>

                        <div className="flex gap-5">

                            <div className="p-10">
                                <h1 className="font-bold text-xl ">{room.room_type}</h1>
                                <div className="flex gap-1">
                                    <h2 className=" bg-gray-400 w-max h-min">{room.room_size}</h2>
                                    <h2>Size</h2>
                                    <h3>{room.room_size_digit}</h3>
                                </div>
                                <h4>
                                    Accommodates: {room.room_accommodate}
                                </h4>
                                <h5>
                                    Facilities: {room.room_facility}
                                </h5>
                            </div>
                        </div>

                        <div className="">
                            <h1 className="font-bold text-xl text-right mb-5">{room.room_price}</h1>
                            <h2>free cancel before {room.room_cancel}</h2>
                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Book Now</button>
                        </div>




                    </div>
                </div>

            ))}

        </div>
    )
}
export default RoomList