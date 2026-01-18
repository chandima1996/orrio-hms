import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Home, CalendarCheck } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const BookingSuccess = () => {
  const { width, height } = useWindowSize(); 
  const [showConfetti, setShowConfetti] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full p-8 text-center shadow-2xl border-t-4 border-t-green-500">
          
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full animate-bounce">
                <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-8">
            Yay! You have successfully booked your stay. We have sent a confirmation email with all the details.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8 text-left space-y-3">
             <div className="flex items-center gap-3 text-slate-700">
                <CalendarCheck className="w-5 h-5 text-primary" />
                <span className="font-medium">Your booking ID: #ORR-{Math.floor(Math.random() * 10000)}</span>
             </div>
             <p className="text-xs text-slate-400 pl-8">Save this for your reference</p>
          </div>

          <div className="space-y-3">
            <Link to="/">
                <Button className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800">
                    <Home className="mr-2 w-4 h-4" /> Go to Home
                </Button>
            </Link>
          </div>

        </Card>
      </div>
    </MainLayout>
  );
};

export default BookingSuccess;