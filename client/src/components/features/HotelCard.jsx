import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Heart, Wifi, Car, Utensils, Waves, Dumbbell, Coffee, Monitor } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useSettings } from "@/context/SettingsContext"; 
import { formatPrice } from "@/utils/formatPrice"; 

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
  const { favorites, handleToggleFavorite, currency } = useSettings();
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  
  const formattedRating = Number(hotel.starRating).toFixed(1);
  const isFavorite = favorites.includes(hotel._id);
  const minPrice = hotel.rooms && hotel.rooms.length > 0 ? Math.min(...hotel.rooms.map(r => r.price)) : 0;

  const isList = viewMode === "list";
  const cardClass = isList ? "flex flex-row h-[280px]" : "flex flex-col h-[460px]";
  const imageClass = isList ? "w-2/5 h-full" : "w-full h-56";

  return (
    <div className="relative w-full h-full group">
      {isSignedIn && (
        <button onClick={(e) => { e.preventDefault(); handleToggleFavorite(hotel._id); }} className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all active:scale-95 group/fav">
          <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-white group-hover/fav:text-red-400"}`} />
        </button>
      )}

      <Link to={`/hotel/${hotel._id}`} className="block w-full h-full select-none">
        <Card className={`${cardClass} overflow-hidden border-none shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800 rounded-2xl`}>
          
          <div className={`relative overflow-hidden shrink-0 ${imageClass}`}>
            <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-full ml-0">
                {hotel.imageUrls.map((img, idx) => (
                  <CarouselItem key={idx} className="h-full pl-0">
                    <img src={img} alt={hotel.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center shadow-sm border border-white/10">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1.5" />
              <span className="text-xs font-bold tracking-wide text-white">{formattedRating}</span>
            </div>
          </div>

          <CardContent className={`p-5 flex flex-col flex-grow overflow-hidden relative ${isList ? 'justify-between' : ''}`}>
            <div>
              <h3 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-slate-100 group-hover:text-primary line-clamp-1">{hotel.name}</h3>
              <div className="flex items-center mb-4 text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70 shrink-0" />
                <span className="text-sm font-medium line-clamp-1">{hotel.city}, {hotel.country}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap content-start gap-2 overflow-hidden">
              {hotel.facilities.slice(0, isList ? 6 : 4).map((facility, index) => (
                <Badge key={index} variant="secondary" className="font-medium text-[10px] py-1 px-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                  {getAmenityIcon(facility)} {facility}
                </Badge>
              ))}
              {hotel.facilities.length > (isList ? 6 : 4) && <span className="text-[10px] text-slate-400 self-center pl-1 font-medium">+{hotel.facilities.length - (isList ? 6 : 4)} more</span>}
            </div>

            {isList && <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">{hotel.description}</p>}

            {!isList && (
              <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/50">
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Starting from</span>
                    <span className="text-xl font-extrabold text-primary">{formatPrice(minPrice, currency)}</span>
                 </div>
                 <Button className="px-6 font-bold text-white transition-transform rounded-full shadow-md hover:scale-105 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">View</Button>
              </div>
            )}
          </CardContent>

          {isList && (
             <div className="p-5 flex flex-col justify-center items-center min-w-[180px] border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="mb-4 text-center">
                    <p className="mb-1 text-xs font-medium tracking-wide uppercase text-slate-500">Starting from</p>
                    <p className="text-2xl font-extrabold text-primary">{formatPrice(minPrice, currency)}</p>
                </div>
                <Button className="w-full font-bold text-white transition-transform shadow-md bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:scale-105">View Details</Button>
             </div>
          )}
        </Card>
      </Link>
    </div>
  );
};

export default HotelCard;