// import { Card } from "flowbite-react";

import CardPass from "./CardPass"


const HotelList = ({hotelList}:any) => {
    return(
        <div>
            {hotelList.map((hotel:any) => (
                <CardPass hotel={hotel}/>
                // <div>{hotel.hotel_name}</div>
            ))}  
        </div>

            
    )
}
export default HotelList