import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { fetchHotelById } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Heart, Wifi, Car, Utensils, Phone, Mail, Share2, Waves, Dumbbell, Coffee, Monitor, Plus, Map } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import RoomCard from "@/components/features/RoomCard";
import HotelMap from "@/components/features/HotelMap";
import ReservationModal from "@/components/features/ReservationModal"; // Modal Import

// Icon Helper
const getAmenityIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi className="w-4 h-4" />;
  if (lowerName.includes("parking")) return <Car className="w-4 h-4" />;
  if (lowerName.includes("food") || lowerName.includes("restaurant") || lowerName.includes("bar")) return <Utensils className="w-4 h-4" />;
  if (lowerName.includes("pool")) return <Waves className="w-4 h-4" />;
  if (lowerName.includes("gym")) return <Dumbbell className="w-4 h-4" />;
  if (lowerName.includes("spa")) return <Coffee className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

const HotelDetails = () => {
  const { id } = useParams();
  const { isSignedIn } = useUser();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const data = await fetchHotelById(id);
        setHotel(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadHotel();
  }, [id]);

  // Loading State
  if (loading) {
    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-10 bg-slate-50 dark:bg-slate-950">
                <div className="container px-4 mx-auto space-y-4">
                    <Skeleton className="h-[50vh] w-full rounded-3xl dark:bg-slate-800" />
                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-4">
                            <Skeleton className="w-1/2 h-10 dark:bg-slate-800" />
                            <Skeleton className="w-full h-32 dark:bg-slate-800" />
                        </div>
                        <Skeleton className="w-full h-64 dark:bg-slate-800" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
  }

  if (!hotel) return <div className="py-20 text-center pt-28">Hotel not found</div>;

  // Calculate Starting Price
  const minPrice = hotel.rooms && hotel.rooms.length > 0 
    ? Math.min(...hotel.rooms.map(r => r.price)) 
    : 0;

  // Decimal Rating
  const formattedRating = Number(hotel.starRating).toFixed(1);

  // Share Function
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!"); 
  };

  return (
    <MainLayout>
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
        
        {/* Container with Padding for Navbar */}
        <div className="container px-4 pb-20 mx-auto pt-28">
            
            {/* --- 1. IMAGE CAROUSEL --- */}
            <div className="relative h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl mb-10 group bg-slate-200 dark:bg-slate-800">
                <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
                <CarouselContent className="h-full ml-0">
                    {hotel.imageUrls.map((img, idx) => (
                    <CarouselItem key={idx} className="h-full pl-0">
                        <img src={img} alt={hotel.name} className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105" />
                    </CarouselItem>
                    ))}
                </CarouselContent>
                </Carousel>
                
                {/* Header Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:p-12">
                <div className="flex flex-col items-end justify-between gap-4 md:flex-row">
                    <div>
                        <h1 className="mb-2 text-4xl font-bold text-white md:text-6xl drop-shadow-lg">{hotel.name}</h1>
                        <div className="flex items-center text-lg text-slate-300">
                            <MapPin className="w-5 h-5 mr-2 text-primary" /> {hotel.city}, {hotel.country}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center px-4 py-2 text-white border bg-white/20 backdrop-blur-md rounded-xl border-white/10">
                            <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                            <span className="text-xl font-bold">{formattedRating}</span>
                        </div>
                        {isSignedIn && (
                            <button 
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="p-3 transition-colors border bg-white/20 backdrop-blur-md rounded-xl border-white/10 hover:bg-white/30"
                            >
                            <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                            </button>
                        )}
                        <button 
                            onClick={handleShare}
                            className="p-3 transition-colors border bg-white/20 backdrop-blur-md rounded-xl border-white/10 hover:bg-white/30"
                        >
                            <Share2 className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            
            {/* --- 2. LEFT SIDE (DETAILS) --- */}
            <div className="space-y-10 lg:col-span-2">
                
                {/* Description */}
                <div className="p-8 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">About this place</h3>
                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                        {hotel.description}
                    </p>
                </div>

                {/* Amenities */}
                <div className="p-8 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
                    <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">What this place offers</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {hotel.facilities.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <div className="text-primary">{getAmenityIcon(item)}</div>
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- ROOMS LIST --- */}
                <div id="rooms-section">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 rounded-full bg-primary"></div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Available Room Types</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {hotel.rooms && hotel.rooms.length > 0 ? (
                            hotel.rooms.map((room) => (
                                <RoomCard key={room._id} room={room} />
                            ))
                        ) : (
                            <div className="p-10 text-center bg-white border border-dashed dark:bg-slate-900 rounded-3xl text-slate-500 border-slate-300 dark:border-slate-800">
                                <p>No rooms available for booking right now.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- 3. RIGHT SIDE (INFO CARD) --- */}
            <div className="lg:col-span-1">
                <div className="sticky space-y-6 top-28">
                    
                    {/* Reserve Card */}
                    <Card className="relative p-8 overflow-hidden text-white border-none shadow-xl rounded-3xl bg-slate-900">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full"></div>
                        
                        <div className="relative z-10">
                            <div className="mb-6">
                                <p className="mb-1 text-sm font-bold tracking-widest uppercase text-slate-400">Starting from</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">${minPrice}</span>
                                    <span className="text-slate-400">/ night</span>
                                </div>
                            </div>

                            <Separator className="mb-6 bg-slate-700" />

                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl"><MapPin className="w-5 h-5 text-blue-400" /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-0.5">Address</p>
                                        <p className="text-sm font-medium leading-tight">{hotel.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl"><Phone className="w-5 h-5 text-blue-400" /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-0.5">Phone</p>
                                        <p className="text-sm font-medium">{hotel.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl"><Mail className="w-5 h-5 text-blue-400" /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-0.5">Email</p>
                                        <p className="text-sm font-medium">{hotel.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                
                                {/* --- MODAL TRIGGER BUTTON --- */}
                                <ReservationModal hotel={hotel}>
                                    <Button className="w-full text-lg font-bold text-white border-none shadow-lg h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                                        Reservation
                                    </Button>
                                </ReservationModal>

                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <Plus className="w-3 h-3" /> Service Charges
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Map */}
                    <div className="relative z-0 overflow-hidden border shadow-lg h-72 rounded-3xl border-slate-200 dark:border-slate-800">
                        <HotelMap location={hotel.city} />
                        {/* Fake Overlay Button for interaction hint */}
                        <div className="absolute inset-0 flex items-center justify-center transition-colors pointer-events-none bg-black/20 hover:bg-black/10">
                            <Button className="font-bold shadow-lg pointer-events-auto bg-white/90 text-slate-900 hover:bg-white">
                                <Map className="w-4 h-4 mr-2" /> View on Map
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HotelDetails;