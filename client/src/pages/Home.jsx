import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchHotels } from "@/services/api";
import { toast } from "sonner"; // Alert Import

import FeaturedHotels from "@/components/features/FeaturedHotels";
import Testimonials from "@/components/features/Testimonials";
import StatsSection from "@/components/features/StatsSection";

const Home = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070", 
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049", 
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadAllHotels = async () => {
        setLoading(true);
        try {
            const data = await fetchHotels();
            setHotels(data);
        } catch (error) { console.log(error); } finally { setLoading(false); }
    };
    loadAllHotels();
  }, []);

  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    
    const isValid = /^[a-zA-Z\s]+$/.test(searchQuery);
    if (!isValid) {
        toast.error("Invalid Search", { description: "Please enter a valid location (Letters only)." });
        return;
    }
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <MainLayout>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
             <img src={heroImages[currentImageIndex]} alt="Hero" className="object-cover w-full h-full"/>
             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900/10 dark:from-black/90 dark:via-black/70 dark:to-slate-900/40" />
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-10 px-4 mx-auto mt-16">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium inline-block mb-6 shadow-lg">✨ AI-Powered Hotel Booking</span>
              <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl drop-shadow-xl">Find your perfect stay <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">with AI Precision</span></h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex flex-col max-w-3xl gap-2 p-2 mx-auto mt-12 border shadow-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl md:flex-row border-white/20">
              <div className="relative flex items-center flex-1 px-4 transition-colors border border-transparent h-14 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 focus-within:border-primary/50 group">
                <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                <div className="flex flex-col items-start w-full pr-8">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Describe your dream stay</span>
                  <input type="text" placeholder="Ex: Galle" className="w-full h-6 p-0 text-sm font-medium bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                </div>
                {searchQuery && <button onClick={clearSearch} className="absolute p-1 transition-colors rounded-full right-4 hover:bg-slate-200 dark:hover:bg-slate-600"><X className="w-4 h-4 text-slate-500" /></button>}
              </div>
              <Button size="lg" className="px-8 text-lg transition-all shadow-lg h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-primary/25 active:scale-95" onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Search className="w-5 h-5 mr-2" />} {loading ? "Thinking..." : "Search"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <FeaturedHotels hotels={hotels} loading={loading} searchQuery="" onShowAll={() => navigate('/search')} />
      <StatsSection />
      <Testimonials />
    </MainLayout>
  );
};

export default Home;