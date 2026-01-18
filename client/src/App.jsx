import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import HotelDetails from "@/pages/HotelDetails";
import BookingSuccess from "@/pages/BookingSuccess";
import FindHotels from "@/pages/FindHotels";
import About from "@/pages/About"; // Import
import Contact from "@/pages/Contact"; // Import

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/search" element={<FindHotels />} />
         <Route path="/hotel/:id" element={<HotelDetails />} />
         <Route path="/booking-success" element={<BookingSuccess />} />
         <Route path="/about" element={<About />} /> {/* Route */}
         <Route path="/contact" element={<Contact />} /> {/* Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;