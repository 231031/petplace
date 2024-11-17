
function Home  () {
    return (
        <div className="h-screen relative">
            {/* First Section */}
            <div className="w-full h-1/2 bg-gray-100 relative">
                <img
                    src="/images/loginbg.png"
                    className="w-full h-full object-cover object-center"
                />
                <img
                    src="/images/logo.png"
                    className="absolute top-0 left-16 w-64 h-64 z-20"
                />
                <div className ="absolute z-20 top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center">
                    <a href="/" className="text-2xl text-white">Grooming</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Delivery</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Hotel Booking</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Clinic</a>
                    <span className="text-2xl text-white px-8 ">|</span>
                    <a href="/" className="text-2xl text-white">Shop</a>
                </div>
                <div className="bg-white rounded-lg absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="font-semibold text-2xl px-8 py-2" style={{ color: '#A08252' }}>
                        Find your service
                    </div>
                </div>
            </div>

            {/* Second Section */}
            <div className="w-full h-1/2 p-4 bg-white flex justify-center items-center relative">
                <div className="w-1/4 rounded-lg absolute mt-4 top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4" style={{ backgroundColor: '#A08252' }}>
                    <a href="/" className="text-xl text-white p-2">Hotel</a>
                    <a href="/" className="text-xl text-white p-2">Care</a>
                    <a href="/" className="text-xl text-white p-2">Clinic</a>
                    <a href="/" className="text-xl text-white p-2">Delivery</a>
                </div>
            </div>
                
            {/* Third Section */}
            <div className="w-full h-1/2 p-4 bg-gray-700 border border-gray-400 shadow  flex justify-center items-center relative">
                <img
                src="https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b"
                className="w-full h-32 object-cover object-center rounded-lg"
                />
            </div>
        </div>

    )
}

export default Home;