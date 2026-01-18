import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Heart, Wifi, Car, Utensils, Waves, Dumbbell, Coffee, Monitor } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const getAmenityIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi className="w-3 h-3" />;
  if (lowerName.includes("parking")) return <Car className="w-3 h-3" />;
  if (lowerName.includes("food") || lowerName.includes("restaurant") || lowerName.includes("bar")) return <Utensils className="w-3 h-3" />;
  if (lowerName.includes("pool")) return <Waves className="w-3 h-3" />;
  if (lowerName.includes("gym")) return <Dumbbell className="w-3 h-3" />;
  if (lowerName.includes("spa")) return <Coffee className="w-3 h-3" />;
  return <Monitor className="w-3 h-3" />;
};

const HotelCard = ({ hotel, viewMode = "grid" }) => {
  const { isSignedIn } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const formattedRating = Number(hotel.starRating).toFixed(1);

  // Styles based on View Mode
  const isList = viewMode === "list";
  const cardClass = isList 
    ? "flex flex-row h-[280px]" 
    : "flex flex-col h-[450px]";
  
  const imageClass = isList 
    ? "w-2/5 h-full" 
    : "w-full h-56";

  return (
    <div className="relative w-full h-full group">
      {isSignedIn && (
        <button 
          onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          className="absolute z-20 p-2 transition-all rounded-full top-3 right-3 bg-white/20 backdrop-blur-md hover:bg-white/40 active:scale-95"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>
      )}

      <Link to={`/hotel/${hotel._id}`} className="block w-full h-full select-none">
        <Card className={`${cardClass} overflow-hidden border-none shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 rounded-2xl`}>
          
          {/* Image Slider */}
          <div className={`relative overflow-hidden shrink-0 ${imageClass}`}>
            <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-full ml-0">
                {hotel.imageUrls.map((img, idx) => (
                  <CarouselItem key={idx} className="h-full pl-0">
                    <img src={img} alt={`${hotel.name}`} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            <div className="absolute z-10 flex items-center px-2 py-1 border rounded-lg shadow-sm top-3 left-3 bg-black/60 backdrop-blur-md border-white/10">
              <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{formattedRating}</span>
            </div>
            
            {/* Price Overlay - REMOVED in List View as requested, kept in Grid view bottom-left of image only if you want, 
                BUT based on your request "Price ekak display wenna ba", I will remove price overlay completely from here too 
                OR if you only meant "remove price from list view footer", I will do that. 
                Assuming "hotel card eke price ekak display wenna ba" means remove everywhere on the card: */}
            
            {/* Price removed completely based on request */}

          </div>

          {/* Content */}
          <CardContent className={`p-5 flex flex-col flex-grow overflow-hidden relative ${isList ? 'justify-between' : ''}`}>
            
            <div>
              <h3 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-slate-100 group-hover:text-primary">
                {hotel.name}
              </h3>
              <div className="flex items-center mb-4 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                <span className="text-sm font-medium">{hotel.city}, {hotel.country}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap content-start gap-2 overflow-hidden">
              {hotel.facilities.slice(0, isList ? 6 : 4).map((facility, index) => (
                <Badge key={index} variant="secondary" className="font-medium text-xs py-1 px-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                  {getAmenityIcon(facility)}
                  {facility}
                </Badge>
              ))}
            </div>

            {isList && (
               <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{hotel.description}</p>
            )}

            {!isList && (
              <div className="pt-4 mt-auto">
                 <Button className="w-full font-bold text-white shadow-md bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                  View Details
                </Button>
              </div>
            )}
          </CardContent>

          {/* List View Specific Footer Action (PRICE REMOVED) */}
          {isList && (
             <div className="p-5 flex flex-col justify-center items-center min-w-[180px] border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Button className="w-full font-bold text-white transition-transform shadow-md bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-105">
                  View Details
                </Button>
             </div>
          )}

        </Card>
      </Link>
    </div>
  );
};

export default HotelCard;