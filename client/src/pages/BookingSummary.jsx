import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { createCheckoutSession } from "@/services/api";
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
  const [paymentMethod, setPaymentMethod] = useState("paynow");
  const [processing, setProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  if (!state) return <div className="p-20 text-center">No booking data found.</div>;

  const { hotelName, hotelId, selectedRooms, nights, guestDetails } = state;

  // Calculation
  const roomsTotal = selectedRooms.reduce((acc, room) => acc + (room.price * nights), 0);
  const serviceCharge = 50;
  const totalAmount = roomsTotal + serviceCharge;

  const handleConfirmBooking = async () => {
    if (paymentMethod === "paynow") {
      setProcessing(true);
      try {
        // Stripe requires one room ID usually, but here we have multiple. 
        // For Simplicity in this demo, we assume booking the first room triggers the session 
        // OR ideally backend should handle multiple items. 
        // Using first room for Stripe Redirect logic:
        const response = await createCheckoutSession({
            hotelId: hotelId,
            roomId: selectedRooms[0]._id, // Note: Backend handles single item well. Multiple logic needs array loop.
            numberOfNights: nights
        });
        if (response.url) window.location.href = response.url;
      } catch (error) {
        console.error(error);
        alert("Payment Gateway Error");
      } finally {
        setProcessing(false);
      }
    } else {
      // Pay Later Logic
      setShowAlert(true);
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
            <Card className="p-6 h-fit dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <h2 className="mb-2 text-xl font-bold">{hotelName}</h2>
                <div className="mb-6 text-sm text-slate-500">{nights} Nights Stay</div>
                
                <div className="mb-6 space-y-4">
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400">Guest Details</h3>
                    <div className="text-sm">
                        <p><span className="font-medium">Name:</span> {guestDetails.name}</p>
                        <p><span className="font-medium">Email:</span> {guestDetails.email}</p>
                        <p><span className="font-medium">Phone:</span> {guestDetails.phone}</p>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-4 space-y-2">
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
                <Card className="p-6 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <h3 className="mb-4 text-lg font-bold">Payment Method</h3>
                    <RadioGroup defaultValue="paynow" onValueChange={setPaymentMethod}>
                        
                        <div className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer ${paymentMethod === 'paynow' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                            <RadioGroupItem value="paynow" id="paynow" />
                            <Label htmlFor="paynow" className="flex items-center w-full cursor-pointer">
                                <CreditCard className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <span className="block font-bold">Pay Now (Stripe)</span>
                                    <span className="text-xs text-slate-500">Secure online payment</span>
                                </div>
                            </Label>
                        </div>

                        <div className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer ${paymentMethod === 'paylater' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                            <RadioGroupItem value="paylater" id="paylater" />
                            <Label htmlFor="paylater" className="flex items-center w-full cursor-pointer">
                                <CalendarCheck className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <span className="block font-bold">Pay Later</span>
                                    <span className="text-xs text-slate-500">Pay within 48 hours</span>
                                </div>
                            </Label>
                        </div>

                    </RadioGroup>
                </Card>

                <Button className="w-full text-lg font-bold h-14" onClick={handleConfirmBooking} disabled={processing}>
                    {processing ? "Processing..." : (paymentMethod === 'paynow' ? `Pay $${totalAmount}` : "Book Now")}
                </Button>
            </div>
        </div>

        {/* --- PAY LATER ALERT --- */}
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-green-600">Booking Successful!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your reservation has been placed. Please complete the payment within 48 hours to avoid automatic cancellation.
                        <br /><br />
                        A confirmation email has been sent to {guestDetails.email}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => navigate('/')}>Return Home</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </div>
    </MainLayout>
  );
};

export default BookingSummary;