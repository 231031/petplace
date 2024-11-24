// import { Card } from "flowbite-react";

import Card from "./Card"


const HotelList = ({hotelList}:any) => {
    return(
        <div>
            {hotelList.map((hotel, index) => (
                <Card key={index} hotel={hotel} />
                // <div>{hotel.hotel_name}</div>
            ))}
        </div>


    )
}
export default HotelList