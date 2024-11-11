import { Card, CardContent } from "../../components/ui/card"
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
  "https://cdn.prod.website-files.com/602562669ad14425e292589e/6426d4739df8daa248bddc43_IMG_5936-Edit.jpg",
]
export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xl">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
