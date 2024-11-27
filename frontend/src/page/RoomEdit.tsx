import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import toast from "react-toastify";
import { UpdateCage, RemoveCage } from "../helper/cage";
import { UploadRes } from "@/types/response";
import UploadImage from "../components/UploadImage";
import { mapCageSize } from "../helper/cage";
// import { Toast } from "node_modules/react-toastify/dist/components";


const RoomDetailPage = () => {
    const [cageRoomData, setCageRoomData] = useState<any[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<string>('');
    const [selectedCage, setSelectedCage] = useState<string>('');
    const [filteredCageData, setFilteredCageData] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        // const userId = localStorage.getItem("userId");
        const profileId = localStorage.getItem("profile_id");

        const fetchCageRoomType = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/cageroom/type/${profileId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch cage room data");
                const data = await response.json();
                setCageRoomData(data);
            } catch (error) {
                console.error("Error fetching cage room data:", error);
            }
        };

        fetchCageRoomType();
    }, [selectedAnimal, selectedCage]);

    useEffect(() => {
        if (selectedCage) {
            fetchCageRoomById(parseInt(selectedCage));
        }
    }, [selectedAnimal, selectedCage]);

    const fetchCageRoomById = async (cageRoomId: number) => {
        if (cageRoomId) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/api/cageroom/${cageRoomId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch cage room data");
                const data = await response.json();
                setFilteredCageData(data);
            } catch (error) {
                // console.error("Error fetching cage room data from pet and type:", error);
            }
        }

    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            const payload = {
                animal_type: selectedAnimal,
                cage_type: filteredCageData.cage_type,
                detail: filteredCageData.detail,
                facility: filteredCageData.facility,
                facility_array: filteredCageData.facility_array,
                height: parseFloat(filteredCageData.height),
                image: filteredCageData.image,
                image_array: filteredCageData.image_array,
                lenth: parseFloat(filteredCageData.lenth),
                max_capacity: parseInt(filteredCageData.max_capacity),
                price: parseFloat(filteredCageData.price),
                profile_id: parseInt(filteredCageData.profile_id),
                quantity: parseInt(filteredCageData.quantity),
                size: filteredCageData.size,
                width: parseFloat(filteredCageData.width),
                id: parseInt(filteredCageData.id),
            };

            const res = await UpdateCage(payload);
            window.location.reload();
        } catch (err: any) {
            // alert(err);
            window.location.reload();
        }
    };

    const [showModal, setShowModal] = useState(false);

    const handleDeleteCage = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }
            const payload = {
                animal_type: selectedAnimal,
                cage_type: filteredCageData.cage_type,
                detail: filteredCageData.detail,
                facility: filteredCageData.facility,
                facility_array: filteredCageData.facility_array,
                height: parseFloat(filteredCageData.height),
                image: filteredCageData.image,
                image_array: filteredCageData.image_array,
                lenth: parseFloat(filteredCageData.lenth),
                max_capacity: parseInt(filteredCageData.max_capacity),
                price: parseFloat(filteredCageData.price),
                profile_id: parseInt(filteredCageData.profile_id),
                quantity: parseInt(filteredCageData.quantity),
                size: filteredCageData.size,
                width: parseFloat(filteredCageData.width),
                id: parseInt(filteredCageData.id),
            };

            const res = await RemoveCage(payload);
            window.location.reload();
        } catch (err: any) {
            // alert(err);
            window.location.reload();
        }
    }

    const handleAddFacility = () => {
        const currentFacilities = filteredCageData.facility_array || [];
        const newFacility = filteredCageData.facility;
        const updatedFacilities = [...currentFacilities, newFacility];
        setFilteredCageData({ ...filteredCageData, facility_array: updatedFacilities, facility: '' });
    }


    const handleRemoveFacility = (facility: string) => {
        const updatedFacilities = (filteredCageData.facility_array || []).filter((f: string) => f !== facility);
        setFilteredCageData({ ...filteredCageData, facility_array: updatedFacilities });
    }

    const handleImageUpload = (files: UploadRes[]) => {
        const currentImages = filteredCageData.image_array || [];
        //map the new images to the current images
        const newImageArray = files.map((file) => (file.fileUrl));
        const updatedImages = [...currentImages, ...newImageArray];

        // Limit to 10 images
        const limitedImageArray = updatedImages.slice(0, 10);

        setFilteredCageData({
            ...filteredCageData,
            image_array: limitedImageArray,
            image: filteredCageData.image
        });
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = (filteredCageData.image_array || []).filter((_: any, imgIndex: number) => imgIndex !== index);
        setFilteredCageData({
            ...filteredCageData,
            image_array: updatedImages,
            image: updatedImages[0]?.fileUrl || ''
        });
    };

    const handleCreateRoom = () => {
        const token = localStorage.getItem("token");
        const profileId = localStorage.getItem("profile_id");
        console.log("profileId", profileId);

        const payload = {
            animal_type: selectedAnimal,
            cage_type: filteredCageData.cage_type,
            detail: filteredCageData.detail,
            facility: filteredCageData.facility,
            facility_array: filteredCageData.facility_array,
            height: parseFloat(filteredCageData.height),
            image: filteredCageData.image,
            image_array: filteredCageData.image_array,
            lenth: parseFloat(filteredCageData.lenth),
            max_capacity: parseInt(filteredCageData.max_capacity),
            price: parseFloat(filteredCageData.price),
            profile_id: parseInt(profileId || '0'),
            quantity: parseInt(filteredCageData.quantity),
            size: filteredCageData.size,
            width: parseFloat(filteredCageData.width),
        };

        fetch(`http://localhost:5000/api/cageroom`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("data", data);
                setFilteredCageData(data);
                window.location.reload();
            })
            .catch((error) => {
                // console.error("Error creating new room:", error);
            });
    };

    return (
        <div className="bg-bg h-[65rem]">
            <div className="flex justify-center pb-10">
                <div className="flex w-3/4 items-center flex-col gap-y-2">
                    {/* section1 */}
                    <div className="pt-10 space-x-1">
                        <button
                            className="bg-[#FFFBF5] border shadow-lg h-10 w-20 rounded-md text-navbar"
                            onClick={() => navigate('/hotelhome')}
                        >
                            View
                        </button>
                        <button className="bg-nextstep border shadow-lg h-10 w-20 rounded-md text-white">Edit</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-y-6 p-6 w-full max-w-4xl mx-auto">
                <div className="relative mb-10">
                    <div className="absolute top-0 left-0 flex justify-center gap-x-4">
                        <button className="text-gray-500 bg-egg border shadow-lg py-1 px-2 rounded-lg" onClick={() => navigate('/hotel/edit')}>
                            Hotel Detail
                        </button>
                        <button className="text-white text-xl bg-nextstep border shadow-lg p-3 rounded-lg">Cage Detail</button>
                    </div>
                </div>
                {/* Sub-tabs */}
                <div className="bg-bg p-4 rounded-lg shadow-lg flex flex-col gap-y-6">
                    <div className="flex gap-x-4">
                        <select
                            className="text-gray-500 bg-[#FFFBF5] border border-gray-400 p-2 rounded-lg"
                            value={selectedAnimal}
                            onChange={(e) => setSelectedAnimal(e.target.value)}
                        >
                            <option value="" disabled>Select Pet</option>
                            {
                                (cageRoomData && cageRoomData.length > 0) ? (

                                    cageRoomData.map((animal: { animal_type: string }) => (
                                        <option key={animal.animal_type} value={animal.animal_type}>
                                            {animal.animal_type}
                                        </option>
                                    ))

                                ) : (
                                    <option></option>
                                )
                            }

                        </select>
                        <select
                            className="text-gray-500 bg-[#FFFBF5] border border-gray-400 p-2 rounded-lg"
                            value={selectedCage}
                            onChange={(e) => setSelectedCage(e.target.value)}
                            disabled={!selectedAnimal}
                        >
                            <option value="" disabled>Select Cage</option>
                            {selectedAnimal &&
                                cageRoomData
                                    .find((animal: { animal_type: string }) => animal.animal_type === selectedAnimal)
                                    ?.cage.map((cage: { cage_id: number, cage_type: string }) => (
                                        <option key={cage.cage_id} value={cage.cage_id}>
                                            {cage.cage_type}
                                        </option>
                                    ))}
                        </select>
                        <button
                            className={`text-gray-500 p-2 rounded-lg ${!selectedAnimal || selectedCage ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleCreateRoom}
                            disabled={!selectedAnimal || selectedCage}
                        >
                            Create New Cage
                        </button>
                    </div>
                </div>

                {selectedAnimal && (
                    <div className="bg-bg p-4 rounded-lg shadow-lg flex flex-col gap-y-6">
                        {/* Room Name and Description */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Room Name</label>
                                <input
                                    type="text"
                                    value={filteredCageData.cage_type}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, cage_type: e.target.value })}
                                    placeholder="Room Name"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={filteredCageData.detail}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, detail: e.target.value })}
                                    placeholder="Briefly explain"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2 h-20"
                                />
                            </div>
                        </div>

                        {/* Capacity, Quantity, and Size */}
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                <input
                                    type="number"
                                    value={filteredCageData.max_capacity}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, max_capacity: e.target.value })}
                                    placeholder="How many pets can fit in this room?"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">Size</label>
                                <div className="mt-1">
                                    <span className="text-gray-900">
                                        {mapCageSize(parseFloat(filteredCageData.max_capacity))}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size: Length</label>
                                <input
                                    type="number"
                                    value={filteredCageData.lenth}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, lenth: e.target.value })}
                                    placeholder="cm"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size: Width</label>
                                <input
                                    type="number"
                                    value={filteredCageData.width}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, width: e.target.value })}
                                    placeholder="cm"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size: Height</label>
                                <input
                                    type="number"
                                    value={filteredCageData.height}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, height: e.target.value })}
                                    placeholder="cm"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                        </div>

                        {/* Pet Type and Price */}
                        <div className="grid grid-cols-4 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    value={filteredCageData.quantity}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, quantity: e.target.value })}
                                    placeholder="How many rooms you got?"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pet Type</label>
                                <select
                                    value={filteredCageData.animal_type}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, animal_type: e.target.value })}
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                >
                                    <option value="" disabled>Select pet type</option>
                                    <option value="dog">dog</option>
                                    <option value="cat">cat</option>
                                    <option value="bird">bird</option>
                                    <option value="ferret">ferret</option>
                                    <option value="rabbit">rabbit</option>
                                    <option value="hamster">hamster</option>
                                    <option value="fish">fish</option>
                                    <option value="chinchilla">chinchilla</option>
                                    <option value="hedgehog">hedgehog</option>
                                    <option value="sugarglider">sugar glider</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={filteredCageData.price}
                                    onChange={(e) => setFilteredCageData({ ...filteredCageData, price: e.target.value })}
                                    placeholder="Price per night"
                                    className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                />
                            </div>
                        </div>

                        <div>
                            {/* Room Pictures */}
                            <label className="block text-sm font-medium text-gray-700">Room Picture (Max. 10)</label>
                            <div className="flex items-center gap-4">
                                {(filteredCageData.image_array || []).map((image: string, index: number) => (
                                    <div
                                        key={index}
                                        className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex justify-center items-center"
                                    >
                                        <img
                                            src={image}
                                            alt={`Uploaded ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-navbar text-white text-xs rounded-lg px-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <UploadImage
                                    limit={10 - (filteredCageData.image_array?.length || 0)}
                                    onComplete={handleImageUpload}
                                />
                            </div>
                            {/* Facilities */}
                            <div>
                                <label className="mt-4 block text-sm font-medium text-gray-700">Facility</label>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={filteredCageData.facility}
                                        onChange={(e) => setFilteredCageData({ ...filteredCageData, facility: e.target.value })}
                                        placeholder="Add new facility"
                                        className="w-full bg-[#FFFBF5] border border-gray-400 rounded-md p-2"
                                    />
                                    <button
                                        onClick={handleAddFacility}
                                        className="bg-nextstep text-white px-4 py-2 rounded-md"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {(filteredCageData.facility_array || []).map((facility: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-[#FFFBF5] border border-gray-400 px-4 py-2 rounded-md"
                                        >
                                            <span>{facility}</span>
                                            <button
                                                onClick={() => handleRemoveFacility(facility)}
                                                className="text-gray-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                {selectedCage && (
                    <div className="flex justify-center items-center">
                        <div className="flex justify-center w-1/2 pb-16 gap-x-2">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-[#FFFBF5] border shadow-lg text-navbar w-1/2 py-2 rounded-md mt-4"
                            >
                                Delete
                            </button>

                            {showModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                                    <div className="bg-[#FFFBF5] rounded-lg p-6 shadow-lg max-w-sm w-full">
                                        <p className="text-[#5E4126] text-center font-medium mb-4">
                                            Confirm Delete this room<br />
                                            <span className="text-sm text-gray-600">Notice that you can’t recover it.</span>
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="bg-white text-[#5E4126] border border-[#5E4126] px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteCage();
                                                    setShowModal(false);
                                                }}
                                                className="bg-[#5E4126] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#4a3620]"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="bg-nextstep text-white w-1/2 py-2 rounded-md mt-4"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDetailPage;