export default function Footer() {

    return (
        <div className="flex flex-col h-40 w-full bg-navbar justify-start pt-2 items-center">
            <div className="flex w-full h-">
                <div className="flex flex-col w-1/2 justify-center items-end pl-5 text-white">
                    <h1> Our Service</h1>
                    <p>Hotel Booking</p>
                    <p>Pet Care</p>
                    <p>Pet Clinic</p>
                </div>
                <div className="flex flex-col w-1/2 justify-center items-start pl-5 text-white">
                    <h1> Help</h1>
                    <p>Contact Us</p>
                    <p>FAQs</p>
                    <p>Term of use</p>
                </div>
            </div>
            <div className="w-1/3 h-1 bg-white mt-2"></div>
            <div className="flex  mt-2 gap-x-5 text-white">
                <p>Copy Right 2024</p>
                <p> Privacy Policy</p>
            </div>
        </div>
    )
}