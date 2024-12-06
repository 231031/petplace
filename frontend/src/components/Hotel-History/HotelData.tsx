import Card from "./Card"


const HotelData = ({hotelList}:any) => {
    return(
        <div>
            {hotelList.map((hotel, index) => (
                <Card key={index} hotel={hotel} />
                // <div>{hotel.hotel_name}</div>
            ))}
        </div>


    )
}
export default HotelData;