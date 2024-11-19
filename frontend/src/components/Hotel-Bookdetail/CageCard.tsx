import CounterButton from "../Hotel-Bookdetail/CounterButton";
function CageCard() {

    return (
        <div>
            <div className="flex h-60 m-5 p-3 rounded-md shadow shadow-gray-400">
                <div className="basis-1/3 bg-cover h-full w-72 " style={{ backgroundImage: "url('/images/map.png')" }}></div>
                <div className="basis-1/3  flex flex-col space-y-5 pl-5 pt-4">
                    <h1 className="text-2xl">Capsule</h1>
                    <div>
                        <p>S Size 1.2 x 1.2 x 1.1 m</p>
                        <p>Accommodates: 1</p>
                        <p>Facility: Air, Bed, Open toilet</p>
                    </div>
                    <a>More detail</a>
                </div>
                <div className="basis-1/3  space-y-5 pl-5 pt-4 flex flex-col items-end pr-5">
                    <CounterButton />
                    <div>
                        <p>Check in 09-10-2024</p>
                        <p>Check out 10-10-2024</p>
                    </div>
                    <p className="text-2xl font-bold">1000$</p>
                </div>
            </div>
        </div>
    )
}

export default CageCard;