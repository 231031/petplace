import { CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface CarouselDemoProps {
  images?: string[];
}

export function CarouselDemo({ images = [] }: CarouselDemoProps) {
  return (
    <Carousel className="w-full h-[32rem]">
      <CarouselContent className="w-full h-[32rem] ">
        {images.map((image, index) => (
          <CarouselItem key={index} className="w-full h-full">
            <div className="w-full h-[32rem]">
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
