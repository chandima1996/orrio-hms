import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BedDouble, Wifi, Wind, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/services/api";

const RoomCard = ({ room }) => {
  const { id: hotelId } = useParams(); // URL එකෙන් Hotel ID එක ගන්නවා
  const [loading, setLoading] = useState(false);

  // Booking Function
  const handleBookRoom = async () => {
    setLoading(true);
    try {
      // Default: 1 Night Booking (Date Picker එක පස්සේ දාමු)
      const response = await createCheckoutSession({
        hotelId: hotelId,
        roomId: room._id,
        numberOfNights: 1 
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 border-none shadow-md hover:shadow-xl dark:bg-slate-900/50 dark:border-slate-800">
      <div className="flex flex-col md:flex-row">
        
        {/* Room Image */}
        <div className="relative w-full h-64 overflow-hidden md:w-1/3 md:h-auto">
          <img 
            src={room.imageUrls?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32"} 
            alt={room.title} 
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Room Details */}
        <CardContent className="flex flex-col justify-between w-full p-6 md:w-2/3">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{room.title}</h3>
              <span className="text-xl font-bold text-primary">${room.price}</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{room.desc}</p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 mb-6 gap-y-2 gap-x-4">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Users className="w-4 h-4 mr-2 text-primary" /> Max Guests: {room.maxPeople}
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <BedDouble className="w-4 h-4 mr-2 text-primary" /> King Size Bed
              </div>
              {room.roomFacilities?.includes("WiFi") && (
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Wifi className="w-4 h-4 mr-2 text-primary" /> High-Speed Wifi
                </div>
              )}
              {room.roomFacilities?.includes("AC") && (
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Wind className="w-4 h-4 mr-2 text-primary" /> Air Conditioning
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button 
                size="lg" 
                className="font-bold text-white transition-transform shadow-lg bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95"
                onClick={handleBookRoom}
                disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? "Processing..." : "Select Room"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RoomCard;