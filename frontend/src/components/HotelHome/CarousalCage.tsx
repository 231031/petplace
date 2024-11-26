import { CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface CarouselCages {
  images?: string[];
}

export function CarouselCage({ images = [] }: CarouselCages) {
  return (
    <Carousel className="relative  w-[30rem] h-[15rem]">
      <CarouselContent className="w-full h-[13rem]">
        {images.map((image, index) => (
          <CarouselItem key={index} className="w-full h-[10rem]">
            <div className="w-full h-[10rem]">
              <CardContent className="w-full h-[32rem] flex items-center justify-center">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* ปรับตำแหน่งของปุ่ม */}
      <CarouselPrevious className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 opacity-25" />
      <CarouselNext className="absolute top-1/2 right-10 opacity-25 transform -translate-y-1/2 z-10" />
    </Carousel>
  );
}
