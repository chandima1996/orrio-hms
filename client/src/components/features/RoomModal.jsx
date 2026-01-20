import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble, Wifi, Wind, Maximize, Check } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const RoomModal = ({ room, open, onClose, onSelect }) => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white border-none shadow-2xl dark:bg-slate-950 rounded-2xl">
        
        {/* Image Slider */}
        <div className="relative w-full h-64 md:h-80 bg-slate-200 dark:bg-slate-900">
            <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-full ml-0">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                    room.imageUrls.map((img, idx) => (
                    <CarouselItem key={idx} className="h-full pl-0">
                        <img src={img} alt={room.title} className="object-cover w-full h-full" />
                    </CarouselItem>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No Images Available</div>
                )}
              </CarouselContent>
            </Carousel>
            <div className="absolute px-3 py-1 text-sm font-bold text-white rounded-full top-4 right-4 bg-black/60 backdrop-blur-md">
                ${room.price} / night
            </div>
        </div>

        <div className="p-6 space-y-6 md:p-8">
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-white">{room.title}</DialogTitle>
            </DialogHeader>

            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {room.desc}
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 border md:grid-cols-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Users className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium dark:text-white">{room.maxPeople} Guests</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <BedDouble className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium dark:text-white">King Bed</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <Maximize className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium dark:text-white">450 sqft</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <Wind className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium dark:text-white">AC</span>
                </div>
            </div>

            {/* Amenities List */}
            <div>
                <h4 className="mb-3 font-bold text-slate-900 dark:text-white">Room Amenities</h4>
                <div className="flex flex-wrap gap-2">
                    {room.roomFacilities?.map((fac, i) => (
                        <Badge key={i} variant="outline" className="flex gap-2 px-3 py-1 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            <Check className="w-3 h-3 text-green-500" /> {fac}
                        </Badge>
                    ))}
                </div>
            </div>

            
            <Button className="w-full h-12 text-lg font-bold shadow-lg" onClick={onSelect}>
                Select This Room
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;