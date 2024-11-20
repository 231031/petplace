// import { Card } from "flowbite-react";
import CardHotel from "./CardHotel";
import Card from "./Card";


const HotelList = ({hotelList}) => {
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