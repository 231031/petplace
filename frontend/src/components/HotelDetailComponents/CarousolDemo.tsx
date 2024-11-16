import { CardContent } from "../../components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"
const images = [
  "https://cdn.prod.website-files.com/602562669ad14425e292589e/6426d4739df8daa248bddc43_IMG_5936-Edit.jpg",
  "https://media-be.chewy.com/wp-content/uploads/2018/12/40406006_169458200622378_1790431879520964301_n-cat-rooms.jpg",
  "https://cdn.prod.website-files.com/602562669ad14425e292589e/6426d4739df8daa248bddc43_IMG_5936-Edit.jpg",
  "https://media-be.chewy.com/wp-content/uploads/2018/12/40406006_169458200622378_1790431879520964301_n-cat-rooms.jpg",
  "/images/loginbg.png",
]
export function CarouselDemo() {
  return (
    <Carousel className="w-full h-72">
      <CarouselContent className="w-full h-full ">
        {images.map((image, index) => (
          <CarouselItem key={index} className="w-full h-full">
            <div className="w-full h-72">
              <CardContent className="w-full h-full flex items-center justify-center">
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
  )
}
