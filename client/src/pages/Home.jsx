import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchHotels, searchHotelsAI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";


// Features Import
import FeaturedHotels from "@/components/features/FeaturedHotels";
import Testimonials from "@/components/features/Testimonials";
import StatsSection from "@/components/features/StatsSection";

const Home = () => {
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

  // Slideshow Effect (5 Seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initial Data Load
  useEffect(() => {
    loadAllHotels();
  }, []);

  const loadAllHotels = async () => {
    setLoading(true);
    try {
      const data = await fetchHotels();
      setHotels(data);
    } catch (error) {
      console.log("Error loading hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadAllHotels();
      return;
    }
    setLoading(true);
    try {
      const data = await searchHotelsAI(searchQuery);
      setHotels(data);
    } catch (error) {
      console.log("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* --- HERO SECTION --- */}
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
             <img src={heroImages[currentImageIndex]} alt="Hero" className="w-full h-full object-cover"/>
             {/* Gradient Overlay for better text visibility */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900/10 dark:from-black/90 dark:via-black/70 dark:to-slate-900/40" />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-4 z-10 relative mt-16">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium inline-block mb-4 shadow-lg">
                ✨ AI-Powered Hotel Booking
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-xl">
                Find your perfect stay <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  with AI Precision
                </span>
              </h1>
            </motion.div>

            {/* Search Bar */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 p-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2 border border-white/20">
              <div className="flex-1 flex items-center px-4 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-transparent focus-within:border-primary/50">
                <MapPin className="text-slate-400 mr-3 h-5 w-5" />
                <div className="flex flex-col items-start w-full">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Describe your dream stay</span>
                  <input 
                    type="text" 
                    placeholder="Ex: Cheap hotel in Galle with a pool" 
                    className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm w-full p-0 h-6 font-medium" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
                  />
                </div>
              </div>
              <Button size="lg" className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/25 transition-all active:scale-95" onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                {loading ? "Thinking..." : "Search"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURED HOTELS --- */}
      <FeaturedHotels 
        hotels={hotels} 
        loading={loading} 
        searchQuery={searchQuery} 
        onShowAll={loadAllHotels} 
      />

      {/* --- STATS SECTION (Animation) --- */}
      <StatsSection />

      {/* --- TESTIMONIALS --- */}
      <Testimonials />

    </MainLayout>
  );
};

export default Home;