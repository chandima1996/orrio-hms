import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { fetchRoomById } from "@/services/api"; 
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Users, BedDouble, Wifi, Wind, Check, ArrowLeft } from "lucide-react";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await fetchRoomById(id);
        setRoom(data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    loadRoom();
  }, [id]);

  if (loading) return <MainLayout><div className="pt-32 text-center">Loading...</div></MainLayout>;
  if (!room) return <MainLayout><div className="pt-32 text-center">Room not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 pt-28">
        <div className="container max-w-5xl px-4 mx-auto">
            
            <Button variant="ghost" className="pl-0 mb-6 hover:bg-transparent hover:text-primary" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hotel
            </Button>

            <h1 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white">{room.title}</h1>

            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-10">
                <Carousel plugins={[plugin.current]} className="w-full h-full" opts={{ loop: true }}>
                    <CarouselContent className="h-full ml-0">
                        {room.imageUrls.map((img, idx) => (
                            <CarouselItem key={idx} className="h-full pl-0">
                                <img src={img} className="object-cover w-full h-full" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="absolute px-6 py-2 text-xl font-bold text-white rounded-full top-6 right-6 bg-black/70 backdrop-blur-md">
                    ${room.price} / night
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                <div className="space-y-8 md:col-span-2">
                    <div>
                        <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Description</h3>
                        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{room.desc}</p>
                    </div>
                    
                    <div>
                        <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                            {room.roomFacilities.map((fac, i) => (
                                <Badge key={i} variant="secondary" className="flex gap-2 px-4 py-2 text-sm">
                                    <Check className="w-4 h-4 text-green-500" /> {fac}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800">
                        <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Room Highlights</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><Users className="w-5 h-5 text-primary"/> Max {room.maxPeople} Guests</div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><BedDouble className="w-5 h-5 text-primary"/> King Size Bed</div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><Wind className="w-5 h-5 text-primary"/> Air Conditioned</div>
                        </div>
                    </div>
                    <Button className="w-full text-lg font-bold h-14" onClick={() => navigate(-1)}>
                        Book This Room
                    </Button>
                </div>
            </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default RoomDetails;