// import { Card } from "flowbite-react";

import Card from "./CardPass"


const HotelList = ({hotelList}:any) => {
    return(
        <div>
            {hotelList.map((hotel) => (
                <Card hotel={hotel}/>
                // <div>{hotel.hotel_name}</div>
            ))}  
        </div>

            
    )
}
export default HotelList