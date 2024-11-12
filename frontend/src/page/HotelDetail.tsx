
import { CarouselDemo } from "../components/HotelDetailComponents/CarousolDemo";
import RoomList from "../components/HotelDetailComponents/RoomList";

function HotelDetail() {
    return (
        <div className="h-screen relative ">
            <div className="flex-col justify-between p-24">
                <p className="text-3xl font-bold">HotelName</p>

                <div className=" flex justify-center mt-2 h-[240]">
                    <CarouselDemo/>
                </div>

                <p className="text-3xl mt-6">Details</p>
                <div className=" bg-gray-200 w-full h-32 rounded-md mt-2">
                    aaaaaaaa
                </div>

                <p className="text-3xl mt-6">Room</p>
                <div className=" bg-gray-200 w-full h-full rounded-md pl-2 pr-2 pb-2 pt-1">
                    <RoomList />
                </div>

                <div className=" flex mt-6  ">
                    <p className="text-3xl ">Review</p>
                    <div className=" my-auto text-3xl">AAAA</div>
                </div>
                <div className=" bg-gray-200 w-full h-32 rounded-md mt-2">

                </div>


            </div>

        </div>


    )
}

export default HotelDetail;