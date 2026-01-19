import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, CalendarCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { createCheckoutSession, createBooking } from "@/services/api"; 
import { useUser } from "@clerk/clerk-react"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BookingSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser(); // Get logged-in user
  const [paymentMethod, setPaymentMethod] = useState("paynow");
  const [processing, setProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // If page accessed directly without data, show error
  if (!state) return <div className="p-20 pt-32 text-center">No booking data found. Please select a room first.</div>;

  const { hotelName, hotelId, selectedRooms, nights, guestDetails, guests, date } = state;

  // Calculate Totals
  const roomsTotal = selectedRooms.reduce((acc, room) => acc + (room.price * nights), 0);
  const serviceCharge = 50;
  const totalAmount = roomsTotal + serviceCharge;

  const handleConfirmBooking = async () => {
    if (!user) {
        alert("You must be signed in to complete the booking.");
        return;
    }

    setProcessing(true);
    
    // --- OPTION 1: PAY NOW (STRIPE) ---
    if (paymentMethod === "paynow") {
      try {
        const response = await createCheckoutSession({
            hotelId: hotelId,
            roomId: selectedRooms[0]._id, // Note: Currently handling single room type for Stripe
            numberOfNights: nights
        });
        if (response.url) window.location.href = response.url;
      } catch (error) {
        console.error(error);
        alert("Payment Gateway Error. Please try again.");
        setProcessing(false);
      }
    } 
    
    // --- OPTION 2: PAY LATER (SAVE TO DB) ---
    else {
      try {
        await createBooking({
            userId: user.id, // Clerk User ID
            hotelId: hotelId,
            roomId: selectedRooms[0]._id, // Handle array if expanding logic later
            checkIn: date.from,
            checkOut: date.to,
            guests: guests,
            totalAmount: totalAmount,
            status: "pending" // Set status to pending
        });
        
        setProcessing(false);
        setShowAlert(true); // Show success popup
      } catch (error) {
        console.error("Booking Creation Error:", error);
        alert("Failed to create booking. Please try again.");
        setProcessing(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 pt-32 pb-20 mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hotel
        </Button>

        <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Booking Summary</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* --- SUMMARY CARD --- */}
            <Card className="p-6 shadow-md h-fit dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{hotelName}</h2>
                <div className="mb-6 text-sm text-slate-500">{nights} Nights Stay</div>
                
                <div className="mb-6 space-y-4">
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400">Guest Details</h3>
                    <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                        <p><span className="font-medium">Name:</span> {guestDetails.name}</p>
                        <p><span className="font-medium">Email:</span> {guestDetails.email}</p>
                        <p><span className="font-medium">Phone:</span> {guestDetails.phone}</p>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-4 space-y-2 text-slate-700 dark:text-slate-300">
                    {selectedRooms.map((room, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span>{room.title} (x1)</span>
                            <span>${room.price * nights}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Service Charges</span>
                        <span>${serviceCharge}</span>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                </div>
            </Card>

            {/* --- PAYMENT SECTION --- */}
            <div className="space-y-6">
                <Card className="p-6 shadow-md dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Payment Method</h3>
                    <RadioGroup defaultValue="paynow" onValueChange={setPaymentMethod}>
                        
                        <div className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'paynow' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            <RadioGroupItem value="paynow" id="paynow" />
                            <Label htmlFor="paynow" className="flex items-center w-full cursor-pointer">
                                <CreditCard className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-white">Pay Now (Stripe)</span>
                                    <span className="text-xs text-slate-500">Secure online payment via Card</span>
                                </div>
                            </Label>
                        </div>

                        <div className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'paylater' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            <RadioGroupItem value="paylater" id="paylater" />
                            <Label htmlFor="paylater" className="flex items-center w-full cursor-pointer">
                                <CalendarCheck className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-white">Pay Later</span>
                                    <span className="text-xs text-slate-500">Pay at hotel or within 48 hours</span>
                                </div>
                            </Label>
                        </div>

                    </RadioGroup>
                </Card>

                <Button className="w-full text-lg font-bold shadow-lg h-14" onClick={handleConfirmBooking} disabled={processing}>
                    {processing ? <Loader2 className="mr-2 animate-spin" /> : (paymentMethod === 'paynow' ? `Pay $${totalAmount}` : "Book Now")}
                </Button>
            </div>
        </div>

        {/* --- SUCCESS ALERT (For Pay Later) --- */}
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-green-600 dark:text-green-500">Booking Successful!</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                        Your reservation has been placed successfully. Please complete the payment at the hotel or via the link sent to your email within 48 hours to avoid automatic cancellation.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => navigate('/dashboard/user')} className="text-white bg-slate-900 dark:bg-white dark:text-slate-900">
                        Go to Dashboard
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </div>
    </MainLayout>
  );
};

export default BookingSummary;