import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ui/ScrollToTop"; // Import ScrollToTop

import Home from "@/pages/Home";
import HotelDetails from "@/pages/HotelDetails";
import BookingSuccess from "@/pages/BookingSuccess";
import FindHotels from "@/pages/FindHotels";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BookingSummary from "@/pages/BookingSummary";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

// Static Pages
import { Careers, Blog, HelpCenter, Terms, Privacy, FAQ } from "@/pages/StaticPages";
import RoomDetails from "./pages/RoomDetails";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* මෙය හැම Route change එකකදීම උඩට Scroll කරයි */}
      
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/search" element={<FindHotels />} />
         <Route path="/hotel/:id" element={<HotelDetails />} />
         <Route path="/booking-summary" element={<BookingSummary />} />
         <Route path="/booking-success" element={<BookingSuccess />} />
         
         {/* Dashboards */}
         <Route path="/dashboard/user" element={<UserDashboard />} />
         <Route path="/dashboard/admin" element={<AdminDashboard />} />
         
         {/* Static Pages */}
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/careers" element={<Careers />} />
         <Route path="/blog" element={<Blog />} />
         <Route path="/help" element={<HelpCenter />} />
         <Route path="/terms" element={<Terms />} />
         <Route path="/privacy" element={<Privacy />} />
         <Route path="/faq" element={<FAQ />} />
         <Route path="/room/:id" element={<RoomDetails />} />
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  );
}

export default App;