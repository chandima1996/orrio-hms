import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import HotelDetails from "@/pages/HotelDetails"; // මේක import කරන්න

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
         {/* අලුත් route එක */}
         <Route path="/hotel/:id" element={<HotelDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;