import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import HotelDetails from "@/pages/HotelDetails";
import BookingSuccess from "@/pages/BookingSuccess"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home  />} />
         <Route path="/hotel/:id" element={<HotelDetails />} />
         
         <Route path="/booking-success" element={<BookingSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;