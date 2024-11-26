import { useState } from "react";

interface CarouselDemoProps {
  images?: string[];
}

export function CarouselDemo({ images = [] }: CarouselDemoProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ฟังก์ชันเพื่อเลื่อนไปข้างหน้า
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length); // เพิ่ม index และวนลูปกลับไปที่ 0 ถ้าเกินจำนวนภาพ
  };

  // ฟังก์ชันเพื่อเลื่อนไปข้างหลัง
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // ลด index และวนลูปกลับไปที่ภาพสุดท้าย
  };

  return (
    <div className="relative w-[rem] h-[32rem]">
      <div className="w-full h-full">
        <img
          src={images[activeIndex]}  // ใช้ activeIndex เพื่อเลือกภาพปัจจุบัน
          alt={`Image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ปุ่ม Next และ Previous */}
      <button
        onClick={handlePrevious}  // เมื่อคลิกปุ่ม Previous จะเปลี่ยน index
        className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 opacity-25 right-0 w-20 flex flex-col h-full justify-center p-2 items-center hover:bg-white" 
      >
        Prev
      </button>
      <button
        onClick={handleNext}  // เมื่อคลิกปุ่ม Next จะเปลี่ยน index
        className="absolute top-1/2 right-0 w-20 opacity-25 transform -translate-y-1/2 z-10 flex flex-col h-full justify-center p-2 items-center hover:bg-white"
      >
        Next
      </button>

      {/* Dots */}
      <div className="absolute  left-1/2 transform -translate-x-1/2 flex space-x-2 flex items-center pt-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}  // เมื่อคลิกที่ dot ให้เปลี่ยน activeIndex
            className={`rounded-full cursor-pointer ${
              activeIndex === index ? "bg-navbar w-5 h-5" : "bg-gray-400 w-3 h-3"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
