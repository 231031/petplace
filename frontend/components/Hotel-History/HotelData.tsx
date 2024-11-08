// import { Card } from "flowbite-react";

import Card from "./Card"



export interface Hotel {
    hotel_id : number
    hotel_name : string
    hotel_address : string
    hotel_facility : string
    img_url : string
}

const hotelList:Hotel[] = [
    {
        hotel_id: 1,
        hotel_name: "A Hotel",
        hotel_address: "A Street",
        hotel_facility: "Facility:Air, Bed, Open toilet",
        img_url: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg"
    },
    {
        hotel_id: 2,
        hotel_name: "B Hotel",
        hotel_address: "B Street",
        hotel_facility: "Facility:Air, Bed, Open toilet",
        img_url: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg"
    },
    {
        hotel_id: 3,
        hotel_name: "C Hotel",
        hotel_address: "C Street",
        hotel_facility: "Facility:Air, Bed, Open toilet",
        img_url: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg"
    },
]

const HotelList = () => {
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