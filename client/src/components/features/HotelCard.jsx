import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

const HotelCard = ({ hotel }) => {
  return (
    <Link to={`/hotel/${hotel._id}`} className="block h-full select-none">
      {/* 
         FIX 1: h-[420px] - අපි කාඩ් එකට ස්ථිර උසක් දෙනවා.
         FIX 2: select-none - Mouse එකෙන් අදිනකොට text select නොවෙන්න.
      */}
      <Card className="h-[420px] flex flex-col overflow-hidden group cursor-pointer border-none shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900 dark:border-slate-800">
        
        {/* Image Section - Fixed Height (h-48 = 192px) */}
        <div className="relative h-48 w-full overflow-hidden shrink-0">
          <img
            src={hotel.imageUrls[0]}
            alt={hotel.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">{hotel.starRating}</span>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex flex-col flex-grow overflow-hidden">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{hotel.city}, {hotel.country}</span>
          </div>
          
          {/* 
             FIX 3: Facilities Container Fixed Height 
             h-14 දාලා overflow hidden කරනවා. එතකොට පේළි ගොඩක් ගියත් කාඩ් එක දික් වෙන්නේ නෑ.
          */}
          <div className="flex flex-wrap gap-2 h-14 content-start overflow-hidden">
            {hotel.facilities.map((facility, index) => (
              <Badge key={index} variant="secondary" className="font-normal text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {facility}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* Footer / Price Section - Fixed at Bottom */}
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50/50 dark:bg-slate-900/50 h-16 shrink-0">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400">Start from</span>
            <span className="text-lg font-bold text-primary">
              ${hotel.pricePerNight} <span className="text-sm text-slate-400 font-normal">/ night</span>
            </span>
          </div>
          <Button size="sm" className="group-hover:bg-primary/90">View</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default HotelCard;