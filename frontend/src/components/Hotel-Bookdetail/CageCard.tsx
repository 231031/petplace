import CounterButton from "../Hotel-Bookdetail/CounterButton";

interface CageCardType {
    cage_type: string;
    size: string;
    price: string;
    facility: string;
    max_capacity: string;
    startDate: string;  
    endDate: string;    
}

function CageCard({ cage_type, size, price, facility, max_capacity,startDate,endDate }: CageCardType) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };
    return (
        <div>

            <div className="flex h-60 m-5 p-3 rounded-md shadow shadow-gray-400">
                <div className="basis-1/3 bg-cover h-full w-72 " style={{ backgroundImage: "url('/images/map.png')" }}></div>
                <div className="basis-1/3  flex flex-col space-y-5 pl-5 pt-4">
                    <h1 className="text-2xl">{cage_type}</h1>
                    <div>
                        <div className="grid grid-cols-11 gap-1">
                            <p className="bg-yellow text-center font-bold">{size}</p>
                            <p>Size</p>
                        </div>
                        <p>Accommodates: {max_capacity}</p>
                        <p>{facility}</p>
                    </div>
                </div>
                <div className="basis-1/3  space-y-5 pl-5 pt-4 flex flex-col items-end pr-5">
                    <CounterButton />
                    <div>
                        <p>Check in: {formatDate(startDate)}</p>
                        <p>Check out: {formatDate(endDate)}</p>
                    </div>
                    <p className="text-2xl font-bold">{price}$</p>
                </div>
            </div>
        </div>
    )
}

export default CageCard;