import { AddAnimalsUser } from "@/helper/animal_user";
import { UploadRes } from "@/types/response";
import { useEffect, useState } from "react";
import UploadImage from "@/components/UploadImage";

interface Pet {
  id: number;
  name: string;
  animal_type: string;
  breed: string;
  weight: string;
  age: string;
  image_array: string[];
}

interface PetCardProps {
  pets: Pet[];
  onPetSelect: (petId: number) => void;
  showPetForm: boolean;
  selectedPet?: any;
}

function PetCard({
  pets,
  onPetSelect,
  showPetForm,
  selectedPet,
}: PetCardProps) {
  const [selectedPets, setSelectedPets] = useState<number[]>([]);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    breed: "",
    weight: "",
    age: "",
    gender: "Not specified",
    hair_type: "Not specified",
    image_array: [],
  });

  const [images, setImages] = useState<UploadRes[]>([]);
  const handleImageUpload = (uploadedFiles: UploadRes[]) => {
    setImages((prev) => [...prev, ...uploadedFiles]);
  };

  const handlePetSelect = (petId: number) => {
    if (!selectedPets.includes(petId)) {
      const newSelection = [...selectedPets, petId];
      setSelectedPets(newSelection);
      onPetSelect(petId);
    }
  };

  useEffect(() => {
    if (selectedPet) {
      handlePetSelect(selectedPet.animal_user.id);
    }
  }, [selectedPet]);

  const handleRemovePet = (petId: number) => {
    const newSelection = selectedPets.filter((id) => id !== petId);
    setSelectedPets(newSelection);
    onPetSelect(petId);
  };

  const handleNewPetSubmit = async () => {
    try {
      if (
        !newPet.name ||
        !newPet.type ||
        !newPet.breed ||
        !newPet.weight ||
        !newPet.age
      ) {
        alert("Please fill out all fields.");
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("Please log in before adding pets.");
      }

      const petPayload = [
        {
          user_id: Number(userId),
          name: newPet.name,
          animal_type: newPet.type,
          breed: newPet.breed,
          weight: parseFloat(newPet.weight.replace("kg", "").trim()),
          age: parseFloat(newPet.age.replace("y", "").trim()),
          gender: "Not specified",
          image_array: images.map((img) => img.fileUrl),
          hair_type: "Not specified",
        },
      ];

      await AddAnimalsUser(petPayload);

      setNewPet({
        name: "",
        type: "",
        breed: "",
        weight: "",
        age: "",
        gender: "ไม่ระบุ",
        hair_type: "ไม่ระบุ",
        image_array: [],
      });
      setImages([]);

      alert("เพิ่มสัตว์เลี้ยงสำเร็จ");
      window.location.reload();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสัตว์เลี้ยง:", error);
      alert("ไม่สามารถเพิ่มสัตว์เลี้ยงได้ กรุณาลองใหม่อีกครั้ง");
    }
  };
  // console.log("Received pets:", pets);

  return (
    <div className="space-y-4">
      {showPetForm && selectedPets.length === 0 && (
        <div className="p-3 rounded-lg shadow shadow-gray-400 flex m-5">
          {/* Image section */}
          <div className="flex flex-col items-center justify-center w-52 space-y-2">
            {/* แสดงรูปภาพที่อัพโหลด */}
            {images.map((image, index) => (
              <div key={index} className="relative w-52 h-52">
                <img
                  src={image.fileUrl}
                  alt="Pet preview"
                  className="w-full h-full object-cover rounded-lg "
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {/* ปุ่มอัพโหลด */}
            {images.length === 0 && (
              <div className="w-52 ">
                <UploadImage limit={1} onComplete={handleImageUpload} />
              </div>
            )}
          </div>

          {/* Form section */}
          <div className="ml-6 space-y-4">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <label className="block text-sm text-black">Pet name:</label>
                <input
                  type="text"
                  placeholder="ex. kitty"
                  className="border rounded-3xl p-2 h-10 mx-2 shadow shadow-gray-400"
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet({ ...newPet, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <label className="block text-sm text-black">Pet type:</label>
                <select
                  className="border rounded-3xl text-sm mx-2 shadow h-10 flex shadow-gray-400"
                  value={newPet.type}
                  onChange={(e) => {
                    setNewPet({ ...newPet, type: e.target.value });

                    if (e.target.value) {
                      const inputs =
                        document.querySelectorAll("input[disabled]");
                      inputs.forEach((input) =>
                        input.removeAttribute("disabled")
                      );
                    }
                  }}
                >
                  <option>Select type</option>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="block text-sm text-black">Pet breed:</label>
                <input
                  type="text"
                  placeholder="ex. persian"
                  className="h-10 mx-2 border rounded-3xl p-2 shadow shadow-gray-400"
                  disabled
                  value={newPet.breed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, breed: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <label className="block text-sm text-black">Weight:</label>
                <input
                  type="text"
                  placeholder="ex. 3.6kg"
                  className="h-10 mx-2 border rounded-3xl p-2 shadow shadow-gray-400"
                  disabled
                  value={newPet.weight}
                  onChange={(e) =>
                    setNewPet({ ...newPet, weight: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center">
                <label className="block text-sm text-black">Age:</label>
                <input
                  type="text"
                  placeholder="ex. 2.5y"
                  className="mx-2 border rounded-3xl shadow shadow-gray-400 h-10 w-20"
                  disabled
                  value={newPet.age}
                  onChange={(e) =>
                    setNewPet({ ...newPet, age: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Dropdown section */}
          <div className="ml-auto flex flex-col gap-4">
            <select
              className="border bg-[#CBAD87] text-white rounded-3xl px-4 py-2 shadow shadow-gray-400"
              onChange={(e) => handlePetSelect(Number(e.target.value))}
              value=""
            >
              <option value="" disabled className="text-center">
                Select your pet
              </option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} - {pet.animal_type} ({pet.breed})
                </option>
              ))}
            </select>
            {newPet.type && (
              <button
                onClick={handleNewPetSubmit}
                className="bg-[#CBAD87] text-white rounded-3xl px-4 py-2 shadow shadow-gray-400 hover:bg-[#CBAD87]/90"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {selectedPets.map((petId) => {
        const pet = pets.find((p) => p.id === petId);
        if (!pet) return null;

        return (
          <div
            key={pet.id}
            className="p-3 rounded-lg shadow shadow-gray-400 flex m-5"
          >
            <div className="flex items-center justify-center w-52 h-52 bg-gray-200 rounded-lg overflow-hidden">
              {pet.image_array && pet.image_array.length > 0 ? (
                <img
                  src={pet.image_array[0]}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-10 h-10 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </div>

            <div className="ml-6 space-y-4">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <label className="block text-sm text-black">Pet name:</label>
                  <input
                    type="text"
                    value={pet.name}
                    className="border rounded-3xl p-2 h-10 mx-2 shadow shadow-gray-400"
                    disabled
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <label className="block text-sm text-black">Pet type:</label>
                  <select
                    className="border rounded-3xl text-sm mx-2 shadow h-10 flex shadow-gray-400"
                    value={pet.animal_type}
                    disabled
                  >
                    <option>{pet.animal_type}</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="block text-sm text-black">Pet breed:</label>
                  <input
                    type="text"
                    value={pet.breed}
                    className="h-10 mx-2 border rounded-3xl p-2 shadow shadow-gray-400"
                    disabled
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <label className="block text-sm text-black">Weight:</label>
                  <input
                    type="text"
                    value={`${pet.weight} kg`}
                    className="h-10 mx-2 border rounded-3xl p-2 shadow shadow-gray-400"
                    disabled
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-sm text-black">Age:</label>
                  <input
                    type="text"
                    value={`${pet.age} year`}
                    className="mx-2 border rounded-3xl shadow shadow-gray-400 h-10 w-20"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Dropdown section */}
            <div className="ml-auto flex flex-col gap-4">
              <button
                onClick={() => handleRemovePet(pet.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <select
                className="border bg-[#CBAD87] text-white rounded-3xl px-4 py-2 shadow shadow-gray-400"
                onChange={(e) => handlePetSelect(Number(e.target.value))}
                value=""
              >
                <option value="" disabled>
                  Add a pet
                </option>
                {pets
                  .filter((p) => !selectedPets.includes(p.id))
                  .map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} - {pet.animal_type}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        );
      })}
      {selectedPets.length === 0 && !showPetForm && (
        <div className="p-3 rounded-lg shadow shadow-gray-400 flex m-5">
          <div className="flex items-center justify-center w-52 h-52 bg-gray-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-10 h-10 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div className="ml-6 space-y-4">
            <p className="text-gray-500">
              Please select a pet or add a new pet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetCard;
