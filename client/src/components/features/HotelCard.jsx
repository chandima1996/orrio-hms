import { Link } from "react-router-dom"; // Link එක import කළා
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

const HotelCard = ({ hotel }) => {
  return (
    <Link to={`/hotel/${hotel._id}`} className="block h-full">
      <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-md flex flex-col">
        {/* Image Section */}
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

        {/* Content Section */}
        <CardContent className="p-4 flex-grow">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center text-slate-500 mb-4">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{hotel.city}, {hotel.country}</span>
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

        {/* Footer / Price Section */}
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-slate-100 mt-auto bg-slate-50/50">
          <div className="flex flex-col pt-3">
            <span className="text-xs text-slate-500">Start from</span>
            <span className="text-lg font-bold text-primary">
              ${hotel.pricePerNight} <span className="text-sm text-slate-400 font-normal">/ night</span>
            </span>
          </div>
          <Button className="mt-3 group-hover:bg-primary/90">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default HotelCard;