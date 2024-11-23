import { useState } from 'react';

interface Pet {
    id: number;
    name: string;
    type: string;
    breed: string;
    weight: string;
    age: string;
}

interface PetCardProps {
    onPetSelect: (petId: number) => void; 
}

function PetCard({ onPetSelect }: PetCardProps) {
    const mockPets: Pet[] = [
        { id: 1, name: "Mali", type: "dog", breed: "chiwawa", weight: "2.5", age: "2" },
        { id: 2, name: "Meaow", type: "cat", breed: "persian", weight: "3.6", age: "1" },
        { id: 3, name: "Moodeng", type: "dog", breed: "poodle", weight: "5.2", age: "3" },
    ];

    const [selectedPets, setSelectedPets] = useState<number[]>([]);
    const [newPet, setNewPet] = useState({
        name: '',
        type: '',
        breed: '',
        weight: '',
        age: ''
    });

    const handlePetSelect = (petId: number) => {
        if (!selectedPets.includes(petId)) {
            const newSelection = [...selectedPets, petId];
            setSelectedPets(newSelection);
            onPetSelect(petId);
        }
    };
    
    const handleRemovePet = (petId: number) => {
        const newSelection = selectedPets.filter(id => id !== petId);
        setSelectedPets(newSelection);
        onPetSelect(petId);
    };

    const handleNewPetSubmit = () => {
        // TODO: เพิ่มการบันทึกสัตว์เลี้ยงใหม่
        console.log('New pet data:', newPet);
    };

    return (
        <div className="space-y-4">
            {/* แสดงฟอร์มเปล่าเมื่อยังไม่มีการเลือกสัตว์ */}
            {selectedPets.length === 0 && (
                <div className="p-3 rounded-lg shadow shadow-gray-400 flex m-5">
                    {/* Image section */}
                    <div className="flex items-center justify-center w-52 h-52 bg-gray-200 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
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
                                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
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
                                        // เมื่อเลือก type แล้วให้เปิดใช้งาน input อื่นๆ
                                        if (e.target.value) {
                                            const inputs = document.querySelectorAll('input[disabled]');
                                            inputs.forEach(input => input.removeAttribute('disabled'));
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
                                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
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
                                    onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
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
                                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
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
                            <option value="" disabled className='text-center'>Select your pet</option>
                            {mockPets.map(pet => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.name} - {pet.type} ({pet.breed})
                                </option>
                            ))}
                        </select>
                        {newPet.type && (
                            <button
                                onClick={handleNewPetSubmit}
                                className="bg-[#CBAD87] text-white rounded-3xl px-4 py-2 shadow shadow-gray-400 hover:bg-[#CBAD87]/90"
                            >
                                บันทึกข้อมูล
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ส่วนแสดงสัตว์เลี้ยงที่เลือกแล้ว */}
            {selectedPets.map((petId) => {
                const pet = mockPets.find(p => p.id === petId);
                if (!pet) return null;

                return (
                    <div key={pet.id} className="p-3 rounded-lg shadow shadow-gray-400 flex m-5">
                        {/* Image section - เหมือนเดิม */}
                        <div className="flex items-center justify-center w-52 h-52 bg-gray-200 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>

                        {/* Form section - ปรับ style ให้เหมือนฟอร์มแรก */}
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
                                        value={pet.type}
                                        disabled
                                    >
                                        <option>{pet.type}</option>
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <select
                                className="border bg-[#CBAD87] text-white rounded-3xl px-4 py-2 shadow shadow-gray-400"
                                onChange={(e) => handlePetSelect(Number(e.target.value))}
                                value=""
                            >
                                <option value="" disabled>เพิ่มสัตว์เลี้ยง</option>
                                {mockPets
                                    .filter(p => !selectedPets.includes(p.id))
                                    .map(pet => (
                                        <option key={pet.id} value={pet.id}>
                                            {pet.name} - {pet.type}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PetCard;