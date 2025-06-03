import CardBookAgain from "@/components/Hotel-BookAgain/CardBookAgain";
import PetCard from "@/components/Hotel-Bookdetail/PetCard";
import { GetTypeAnimalByUserID } from "@/helper/animal_user";
import { CheckAvailableCage, GetHotelServiceByID } from "@/helper/hotel";
import { formatDateToStringNew } from "@/helper/utils";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function HotelBookAgain() {
    const location = useLocation();
    const navigate = useNavigate();

    const [hotelService, setHotelService] = useState<any>(null); // สถานะสำหรับเก็บข้อมูลโรงแรม
    const [hotelServiceID, sethotelServiceID] = useState<any>(null);
    const [selectedPets, setSelectedPets] = useState<number[]>([]);
    const [selectedCage, setselectedCage] = useState<any>();
    const [pets, setPets] = useState<any[]>([]);
    const [showPetForm, setShowPetForm] = useState<boolean>(true);
    const [cage, serCage] = useState<any>(null);


    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (location.state) {
            sethotelServiceID(location.state.hotelServiceID);
        };
    }, [])

    useEffect(() => {
        const fetchHotelService = async () => {
            try {
                const serviceData = await GetHotelServiceByID(hotelServiceID);
                setHotelService(serviceData);
            } catch (err) {
                setError("ไม่สามารถดึงข้อมูลบริการโรงแรมได้");
                console.error(err);
            }
            console.log("Test", hotelService);
        };

        if (hotelServiceID) fetchHotelService();

    }, [hotelServiceID]);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const userId = localStorage.getItem('userId');
                console.log("userId", userId);
                if (!userId) return;

                const response = await GetTypeAnimalByUserID(Number(userId), hotelService.cage_room.animal_type);
                console.log("Pets data:", response);
                setPets(response);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        if (hotelService) {
            fetchPets();

            serCage(hotelService.cage_room);
            const selected = {
                id: hotelService.cage_room.id,
                profile_id: hotelService.cage_room.profile_id,
                cage_type: hotelService.cage_room.cage_type,
                price: hotelService.cage_room.price,
                size: hotelService.cage_room.size,
                width: hotelService.cage_room.width,
                height: hotelService.cage_room.height,
                lenth: hotelService.cage_room.lenth,
                facility: hotelService.cage_room.facility || "",
                max_capacity: hotelService.cage_room.max_capacity
            }
            setselectedCage(selected);
        }
    }, [hotelService]);

    console.log("Cage:", cage);
    const cage_type = hotelService?.cage_room?.cage_type; // ใช้ optional chaining
    const size = hotelService?.cage_room?.size; // ใช้ optional chaining
    const price = hotelService?.cage_room?.price; // ใช้ optional chaining
    const facility = hotelService?.cage_room?.facility; // ใช้ optional chaining
    const max_capacity = hotelService?.cage_room?.max_capacity; // ใช้ optional chaining
    const width = hotelService?.cage_room?.width; // ใช้ optional chaining
    const height = hotelService?.cage_room?.height; // ใช้ optional chaining
    const lenth = hotelService?.cage_room?.lenth; // ใช้ optional chaining
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const cageID = hotelService?.cage_room?.id;

    const handleHotelClick = () => {
        if (!selectedPets || selectedPets.length === 0) {
            toast.error("Please select at least 1 pet");
            setError("Please select at least 1 pet");
            console.log(error)
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select date first");
            console.log("test")
        } else {
            navigate('/hotelselectpayment', {
                state: {
                    selectedPets: selectedPets,
                    selectedCage: selectedCage,
                    hotelName: hotelService.cage_room.profile.name,
                    startDate: startDate,
                    endDate: endDate,
                    cageID: cageID
                }
            });
        }
    }

    const handleAddPetClick = () => {
        setShowPetForm(!showPetForm);
    };

    const [selectionStage, setSelectionStage] = useState<'start' | 'range'>('start');
    const handleDateClick = async (clickedDate: Date) => {
        if (selectionStage === 'start') {
            setStartDate(clickedDate);
            setSelectionStage('range');
        } else {
            if (!startDate) {
                setStartDate(clickedDate);
                setSelectionStage('range');
                return;
            }
            if (clickedDate >= startDate) {
                setEndDate(clickedDate);
                setSelectionStage('start');

                const payload = {
                    cage_id: cageID,
                    start_time: formatDateToStringNew(startDate),
                    end_time: formatDateToStringNew(clickedDate)
                };

                try {
                    const availableCage = await CheckAvailableCage(payload);
                    console.log("Available Cage Data:", availableCage);
                } catch (error) {
                    console.error("Error checking available cage:", error);
                }
            } else {
                setStartDate(clickedDate);
                setEndDate(null);
            }
        }
        console.log("Start Date:", startDate);
        console.log("End Date:", clickedDate);
    };
    const tileClassName = ({ date, view }: any) => {
        if (view === 'month') {
            if (startDate && date.toDateString() === startDate.toDateString()) {
                return 'highlight-start';
            }
            if (endDate && date.toDateString() === endDate.toDateString()) {
                return 'highlight-end';
            }
            if (
                startDate &&
                endDate &&
                date > startDate &&
                date < endDate
            ) {
                return 'highlight-range';
            }
        }
        return null;
    };

    const tileDisabled = ({ date, view }: any) => {
        return view === 'month' && date < new Date();
    };

    const [showCalendar, setShowCalendar] = useState(false);
    const handleShowCalendar = () => {
        setShowCalendar(true); // เปลี่ยนค่าเป็น true เพื่อแสดงปฏิทิน
    };
    const handleDone = () => {
        setShowCalendar(false);
    }
    const handleBack = () => {
        setShowCalendar(false);
    }
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };


    return (
        <div className="grid grid-row-3 gap-16">

            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-2xl w-full mx-auto mt-10">
                <ol className="flex items-center w-full text-xs text-gray-900 font-medium sm:text-base">
                    <li className="flex w-full relative text-black after:content-[''] after:w-full after:h-2 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-5 after:left-6">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-onstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">1</span>
                            <p className="text-center">Book Detail</p>
                        </div>
                    </li>
                    <li className="flex w-full relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-gray-200 before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5 after:content-[''] after:w-full after:h-2 after:bg-gray-200 after:inline-block after:absolute after:right-0 lg:after:top-5 after:top-5">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-nextstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">2</span>
                            <p className="text-center">Payment</p>
                        </div>
                    </li>
                    <li className="flex relative text-black before:content-[''] before:w-1/2 before:h-2 before:bg-gray-200 before:inline-block before:absolute before:left-0 lg:before:top-5 before:top-5">
                        <div className="block whitespace-nowrap z-10 relative">
                            <span className="w-8 h-8 bg-nextstep border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-black lg:w-10 lg:h-10 z-20">3</span>
                            <p className="text-center">Book Success</p>
                        </div>
                    </li>
                </ol>
            </div>

            {showCalendar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-semibold text-xl">Date</p>
                        <Calendar className="p-4 rounded-lg shadow-md text-navbar mt-3"
                            onClickDay={handleDateClick}
                            value={[startDate, endDate]}
                            tileClassName={tileClassName}
                            tileDisabled={tileDisabled} />
                        <div className="flex flex-col items-center mt-5">
                            <p>
                                Check in: <span className="text-gray-400 ml-1">{startDate ? formatDate(startDate.toString()) : "Not Selected"}</span>
                            </p>
                            <p>
                                Check out: <span className="text-gray-400 ml-1">{endDate ? formatDate(endDate.toString()) : "Not Selected"}</span>
                            </p>
                        </div>
                        <div className="flex justify-center space-x-5 mt-10 ">
                            <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400 " onClick={() => handleBack()}>Back</button>
                            <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={() => handleDone()}>Done</button>
                        </div>
                    </div>
                </div>
            )}



            <div className="max-w-5xl w-full mx-auto">
                <p className="text-2xl ">Room</p>
                <CardBookAgain
                    cage_type={cage_type ?? ""}
                    size={size ?? ""}
                    price={price ?? ""}
                    facility={facility ?? ""}
                    max_capacity={max_capacity ?? ""}
                    width={width ?? ""}
                    height={height ?? ""}
                    lenth={lenth ?? ""}
                    startDate={startDate ? startDate.toString() : ""}
                    endDate={endDate ? endDate.toString() : ""}
                    onCheckInClick={handleShowCalendar}
                />
                <div className="flex justify-between">
                    <p className="text-2xl ">Pet</p>
                    {selectedPets.length === 0 && (
                        <button
                            className="w-fit px-4 h-8 rounded-full shadow shadow-gray-400 bg-[#CBAD87] text-white"
                            onClick={handleAddPetClick}
                        >
                            Add Pet
                        </button>
                    )}
                </div>
                <PetCard
                    selectedPet={hotelService?.animal_hotel_services[0]}
                    pets={pets}
                    onPetSelect={(petId: number) => {
                        setSelectedPets(prev =>
                            prev.includes(petId)
                                ? prev.filter(id => id !== petId)
                                : [...prev, petId]
                        );
                        setShowPetForm(false);
                    }}
                    showPetForm={showPetForm}
                />
            </div>
            <div className="max-w-sm w-full mx-auto mb-10">
                <div className="flex justify-between space-x-6">
                    <button className="w-full px-2 h-8  rounded-full shadow shadow-gray-400 " onClick={() => navigate(-1)}>Back</button>
                    <button className="w-full px-2 h-8 bg-nextstep text-white rounded-full shadow shadow-gray-400" onClick={() => handleHotelClick()}>Next</button>
                </div>
            </div>
        </div>
    )
}
export default HotelBookAgain;