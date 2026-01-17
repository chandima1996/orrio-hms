import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { fetchHotelById, createCheckoutSession } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Star, Wifi, Car, Utensils, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format, differenceInCalendarDays, addDays } from "date-fns";

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // Payment processing state
  
  // Default date range (Today to Tomorrow)
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

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

  // දවස් ගාණ ගණනය කිරීම
  const nights = date?.from && date?.to 
    ? differenceInCalendarDays(date.to, date.from) 
    : 0;

  // මුළු ගාණ (Total Price)
  const totalPrice = hotel ? (hotel.pricePerNight * nights) : 0;
  const serviceFee = 50;
  const finalTotal = totalPrice + serviceFee;

  // Stripe Checkout Function
  const handleBooking = async () => {
    if (!hotel || nights <= 0) return;

    setProcessing(true);
    try {
        const response = await createCheckoutSession({
            hotelId: hotel._id,
            numberOfNights: nights
        });

        // Stripe එකට Redirect කිරීම
        if (response.url) {
            window.location.href = response.url;
        }
    } catch (error) {
        console.error("Booking failed", error);
        alert("Something went wrong. Please try again.");
        setProcessing(false);
    }
  };

  // Loading State
  if (loading) {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-10 space-y-4">
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </MainLayout>
    );
  }

  if (!hotel) return <div className="text-center py-20">Hotel not found</div>;

  return (
    <MainLayout>
      {/* 1. Images Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-full">
                <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                <img src={hotel.imageUrls[1] || hotel.imageUrls[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <img src={hotel.imageUrls[2] || hotel.imageUrls[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                <img src={hotel.imageUrls[3] || hotel.imageUrls[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <img src={hotel.imageUrls[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8 relative">
          {/* 2. Left Side - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{hotel.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-600">
                    <span className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" /> {hotel.city}, {hotel.country}
                    </span>
                    <span className="flex items-center text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" /> {hotel.starRating} Star Hotel
                    </span>
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
                        <div key={index} className="flex items-center gap-3 text-slate-700">
                            {item.toLowerCase().includes("wifi") ? <Wifi className="w-5 h-5 text-slate-400" /> : 
                             item.toLowerCase().includes("parking") ? <Car className="w-5 h-5 text-slate-400" /> :
                             <Utensils className="w-5 h-5 text-slate-400" />}
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* 3. Right Side - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
                <Card className="p-6 shadow-xl border-slate-200">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <span className="text-2xl font-bold">${hotel.pricePerNight}</span>
                            <span className="text-slate-500"> / night</span>
                        </div>
                        <div className="flex items-center text-sm underline font-medium cursor-pointer">
                            <Star className="w-4 h-4 fill-slate-900 mr-1" /> 5.0 reviews
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="grid gap-2 mb-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={`w-full justify-start text-left font-normal h-12 ${!date && "text-muted-foreground"}`}>
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
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button 
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-95"
                        onClick={handleBooking}
                        disabled={nights <= 0 || processing}
                    >
                        {processing ? <Loader2 className="animate-spin mr-2" /> : null}
                        {processing ? "Redirecting..." : "Reserve"}
                    </Button>
                    
                    <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
                    
                    {nights > 0 && (
                        <div className="mt-6 space-y-3 text-slate-600 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex justify-between">
                                <span className="underline">${hotel.pricePerNight} x {nights} nights</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="underline">Service fee</span>
                                <span>${serviceFee}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-slate-900 text-lg pt-2">
                                <span>Total</span>
                                <span>${finalTotal}</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HotelDetails;