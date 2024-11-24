import Card from "./Card";
import { Profile } from "@/types/response";


const HotelList = ({hotelList,startDate,endDate} : {hotelList:Profile[],startDate:string,endDate:string}) => {
    return(
        <div>
            {hotelList.map((hotel) => (
                <Card hotel={hotel} startDate={startDate} endDate={endDate}/>
                // <div>{hotel.hotel_name}</div>
            ))}  
        </div>
            
    )
}
export default HotelList