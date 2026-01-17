import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { fetchHotelById } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Star, Wifi, Car, Utensils, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const HotelDetails = () => {
  const { id } = useParams(); // URL එකෙන් ID එක ගන්නවා
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({ from: new Date(), to: new Date() }); // Booking Dates

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

  if (loading) {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-10 space-y-4">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </MainLayout>
    );
  }

  if (!hotel) return <div>Hotel not found</div>;

  return (
    <MainLayout>
      {/* 1. Images Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div className="md:col-span-2 h-full">
                <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Side Images (If available, otherwise repeat main) */}
            <div className="hidden md:flex flex-col gap-4 h-full">
                <img src={hotel.imageUrls[1] || hotel.imageUrls[0]} className="h-1/2 object-cover" />
                <img src={hotel.imageUrls[2] || hotel.imageUrls[0]} className="h-1/2 object-cover" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          {/* 2. Left Side - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-slate-900">{hotel.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" /> {hotel.city}, {hotel.country}
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" /> {hotel.starRating} Star Hotel
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-xl font-bold mb-3">About this place</h3>
                <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
            </div>

            <Separator />

            <div>
                <h3 className="text-xl font-bold mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                    {hotel.facilities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-slate-700">
                            {/* Icon Logic (Simple logic for demo) */}
                            {item.includes("WiFi") ? <Wifi className="w-4 h-4" /> : 
                             item.includes("Parking") ? <Car className="w-4 h-4" /> :
                             <Utensils className="w-4 h-4" />}
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* 3. Right Side - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-xl border-slate-200 sticky top-24">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-2xl font-bold">${hotel.pricePerNight}</span>
                        <span className="text-slate-500"> / night</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 fill-slate-900 mr-1" /> 5.0 (Reviews)
                    </div>
                </div>

                {/* Date Picker */}
                <div className="border border-slate-200 rounded-lg mb-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal border-none h-12">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd")} - {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90">
                    Reserve
                </Button>
                
                <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
                
                <div className="mt-6 space-y-3 text-slate-600">
                    <div className="flex justify-between">
                        <span className="underline">${hotel.pricePerNight} x 5 nights</span>
                        <span>${hotel.pricePerNight * 5}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="underline">Service fee</span>
                        <span>$50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-slate-900 text-lg">
                        <span>Total</span>
                        <span>${(hotel.pricePerNight * 5) + 50}</span>
                    </div>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HotelDetails;