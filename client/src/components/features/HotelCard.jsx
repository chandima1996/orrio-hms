import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

const HotelCard = ({ hotel }) => {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-md">
    
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hotel.imageUrls[0]}
          alt={hotel.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-sm font-bold text-slate-900">{hotel.starRating}</span>
        </div>
      </div>

   
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{hotel.name}</h3>
        <div className="flex items-center text-slate-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.city}, {hotel.country}</span>
        </div>
        <div className="flex flex-wrap gap-2">
            {hotel.facilities.slice(0, 3).map((facility, index) => (
                <Badge key={index} variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-600">
                    {facility}
                </Badge>
            ))}
            {hotel.facilities.length > 3 && (
                <span className="text-xs text-slate-400 self-center">+{hotel.facilities.length - 3} more</span>
            )}
        </div>
      </CardContent>

     
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-slate-100 mt-2 bg-slate-50/50">
        <div className="flex flex-col pt-3">
          <span className="text-xs text-slate-500">Start from</span>
          <span className="text-lg font-bold text-primary">${hotel.pricePerNight} <span className="text-sm text-slate-400 font-normal">/ night</span></span>
        </div>
        <Button className="mt-3">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;