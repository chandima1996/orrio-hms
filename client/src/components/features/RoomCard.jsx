import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble, Wifi, Wind } from "lucide-react";

const RoomCard = ({ room, viewMode = "list" }) => {
  const navigate = useNavigate();
  const isList = viewMode === "list";

  const handleViewRoom = () => {
    navigate(`/room/${room._id}`);
  };

  // --- 1. LIST VIEW (Horizontal) ---
  if (isList) {
    return (
        <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 dark:bg-slate-900/50 dark:border-slate-800 group h-[280px]">
        <div className="flex flex-col h-full md:flex-row">
            
            {/* Image */}
            <div className="relative w-full h-full overflow-hidden md:w-2/5 shrink-0">
            <img 
                src={room.imageUrls?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32"} 
                alt={room.title} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            </div>

            {/* Content */}
            <CardContent className="flex flex-col justify-between w-full p-6 md:w-3/5">
            <div>
                <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-primary line-clamp-1">{room.title}</h3>
                <span className="text-xl font-bold text-primary">${room.price}</span>
                </div>
                
                <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">{room.desc}</p>
                
                <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 font-normal text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                        <Users className="w-3.5 h-3.5 text-primary"/> Max: {room.maxPeople}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 font-normal text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                        <BedDouble className="w-3.5 h-3.5 text-primary"/> King Bed
                    </Badge>
                    {room.roomFacilities?.slice(0, 2).map((fac, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-normal text-slate-500">{fac}</Badge>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button 
                    size="lg" 
                    className="font-bold text-white transition-transform shadow-md bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95" 
                    onClick={handleViewRoom}
                >
                View Room
                </Button>
            </div>
            </CardContent>
        </div>
        </Card>
    );
  }

  // --- 2. GRID VIEW (Vertical) ---
  return (
    <Card className="h-[460px] flex flex-col overflow-hidden border-none shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-900 dark:border-slate-800 rounded-2xl group">
        
        {/* Image */}
        <div className="relative w-full h-56 overflow-hidden shrink-0">
            <img 
                src={room.imageUrls?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32"} 
                alt={room.title} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute px-3 py-1 text-sm font-bold text-white rounded-lg top-3 right-3 bg-black/60 backdrop-blur-md">
                ${room.price} <span className="text-[10px] font-normal opacity-80">/ night</span>
            </div>
        </div>

        {/* Content */}
        <CardContent className="flex flex-col flex-grow p-5">
            <h3 className="mb-2 text-xl font-bold transition-colors text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary">{room.title}</h3>
            
            <p className="flex-grow mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">{room.desc}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="px-2 font-normal bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><Users className="w-3 h-3 mr-1"/> {room.maxPeople}</Badge>
                <Badge variant="secondary" className="px-2 font-normal bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><BedDouble className="w-3 h-3 mr-1"/> Bed</Badge>
                {room.roomFacilities?.slice(0, 2).map((fac, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-normal text-slate-400 border-slate-200 dark:border-slate-700">{fac}</Badge>
                ))}
            </div>

            <Button 
                className="w-full h-12 mt-auto font-bold text-white transition-transform shadow-md bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl active:scale-95" 
                onClick={handleViewRoom}
            >
                View Room
            </Button>
        </CardContent>
    </Card>
  );
};

export default RoomCard;