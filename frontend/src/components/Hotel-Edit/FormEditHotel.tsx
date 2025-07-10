import { UploadRes } from "@/types/response";
import { UpdateCage } from "@/helper/cage";
import UploadImage from "@/components/UploadImage";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FormEditHotel = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [size, setSize] = useState({ length: "", width: "", height: "" });
  const [quantity, setQuantity] = useState("");
  const [petType, setPetType] = useState("");
  const [price, setPrice] = useState("");
  const [facilities, setFacilities] = useState<string[]>([
    "Air condition",
    "Live video",
    "Pet fountain",
  ]);
  const [newFacility, setNewFacility] = useState("");
  const [images, setImages] = useState<UploadRes[]>([]);
  const baseApi = import.meta.env.VITE_BASEAPI;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    fetch(`${baseApi}/cageroom/all/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch cage room data");
        return response.json();
      })
      .then((data) => {
        // console.log("Fetched cage room data:", data);
        // setProfile(data);
        setPetType(data.petType);
        setRoomName(data.roomName);
        setDescription(data.description);
        setCapacity(data.capacity);
        setSize({
          length: data.size.length,
          width: data.size.width,
          height: data.size.height,
        });
        setQuantity(data.quantity);
        setPrice(data.price);
        setFacilities(data.facilities);
        setImages(data.images);
      })
      .catch((error) => console.error("Error fetching cage room data:", error));
  }, []);

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId") || "";
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not authorized. Please log in.");
        // navigate("/login");
        return;
      }

      const payload = {
        id: parseInt(userId),
        animal_type: petType,
        cage_type: roomName,
        detail: description,
        facility: facilities.join(","),
        facility_array: facilities,
        height: parseFloat(size.height),
        image_array: images.map((image) => image.fileUrl),
        lenth: parseFloat(size.length),
        max_capacity: parseInt(capacity, 10),
        price: parseFloat(price),
        profile_id: parseInt(userId),
        quantity: parseInt(quantity, 10),
        size: `${size.length}x${size.width}x${size.height}`,
        width: parseFloat(size.width),
      };

      await UpdateCage(payload);
      toast.success("Cage updated successfully");
      //   console.log("log", res);
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Handle server response if it's JSON
        console.error("Server Response:", err.response.data);
        toast.error(
          `Error: ${err.response.data.message || "Failed to update profile"}`
        );
      } else {
        // Handle non-JSON response or other errors
        // console.error("Unexpected Error:", err.message || err);
        toast.error("Unexpected error occurred. Please try again.");
      }
    }
  };
  const handleAddFacility = () => {
    if (newFacility && !facilities.includes(newFacility)) {
      setFacilities([...facilities, newFacility]);
      setNewFacility("");
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((item) => item !== facility));
  };

  const handleImageUpload = (files: UploadRes[]) => {
    setImages([...images, ...files].slice(0, 10)); // Limit to 10 images
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
    setImages(updatedImages);
  };

  return (
    <div>
      <div className="flex flex-col gap-y-6 p-6 w-full max-w-4xl mx-auto">
        <div className="relative mb-10">
          <div className="absolute top-0 left-0 flex justify-center gap-x-4">
            <button
              className="text-gray-500 bg-egg py-1 px-2 rounded-lg"
              onClick={() => navigate("/hotel/edit")}
            >
              Hotel detail
            </button>
            <button className="text-white text-xl bg-navbar p-3 rounded-lg">
              Room detail
            </button>
          </div>
        </div>
        {/* Sub-tabs */}
        <div className="bg-bg p-4 rounded-lg shadow-lg flex flex-col gap-y-6">
          <div className="flex gap-x-4">
            <button className="text-white p-2 bg-navbar rounded-lg border-b-2 border-gold">
              Luxury room
            </button>
            <button className="text-gray-500 p-2">Max luxury room</button>
            <button className="text-gray-500 p-2">Extra luxury room</button>
            <button className="text-gray-500 p-2">Normal room</button>
          </div>

          {/* Form */}
          <div className="bg-bg p-4 rounded-lg shadow-lg flex flex-col gap-y-6">
            {/* Room Name and Description */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Room Name"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain"
                  className="w-full border border-gray-300 rounded-md p-2 h-20"
                />
              </div>
            </div>

            {/* Capacity, Quantity, and Size */}
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="How many pets can fit in this room?"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size: Length
                </label>
                <input
                  type="number"
                  value={size.length}
                  onChange={(e) => setSize({ ...size, length: e.target.value })}
                  placeholder="cm"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size: Width
                </label>
                <input
                  type="number"
                  value={size.width}
                  onChange={(e) => setSize({ ...size, width: e.target.value })}
                  placeholder="cm"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Size: Height
                </label>
                <input
                  type="number"
                  value={size.height}
                  onChange={(e) => setSize({ ...size, height: e.target.value })}
                  placeholder="cm"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Pet Type and Price */}
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="How many rooms you got?"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pet Type
                </label>
                <input
                  type="text"
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  placeholder="Select pet type"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price per night"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Room Pictures */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room Picture (Max. 10)
              </label>
              <div className="flex items-center gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex justify-center items-center"
                  >
                    <img
                      src={image.fileUrl}
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
                  limit={10 - images.length}
                  onComplete={handleImageUpload}
                />
              </div>
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="Add new facility"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <button
                  onClick={handleAddFacility}
                  className="bg-navbar text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md"
                  >
                    <span>{facility}</span>
                    <button
                      onClick={() => handleRemoveFacility(facility)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-center items-center">
        <div className="flex justify-center w-1/2 pt-4 pb-16">
          <button
            onClick={handleSubmit}
            className="bg-navbar text-white w-1/2 py-2 rounded-md mt-4"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default FormEditHotel;
