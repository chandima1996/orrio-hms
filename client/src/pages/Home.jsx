import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react"; // Calendar, Users අයින් කළා දැනට ඕන නැති නිසා
import { motion } from "framer-motion";
import HotelCard from "@/components/features/HotelCard";
import { fetchHotels, searchHotelsAI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 1. මේක තමයි user ගහන වචන තියාගන්නේ

  // මුලින්ම page එක load වෙද්දී ඔක්කොම හෝටල් ගේන්න
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

  // 2. Search කරන වෙලාවට වැඩ කරන කොටස
  const handleSearch = async () => {
    console.log("Search Button Clicked! Searching for:", searchQuery); // Debugging line

    if (!searchQuery.trim()) {
      // මුකුත් ගහලා නැත්නම් ඔක්කොම හෝටල් ආයේ පෙන්නන්න
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
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/5" />
        </div>

        <div className="container mx-auto px-4 z-10 relative mt-16">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium inline-block mb-4">
                ✨ AI-Powered Hotel Booking
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Find your perfect stay <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  with AI Precision
                </span>
              </h1>
            </motion.div>

            {/* --- SEARCH BAR SECTION STARTS HERE --- */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 p-2 bg-white rounded-2xl shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2"
            >
              {/* Input Area */}
              <div className="flex-1 flex items-center px-4 h-14 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-transparent focus-within:border-primary/20">
                <MapPin className="text-slate-400 mr-3 h-5 w-5" />
                <div className="flex flex-col items-start w-full">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Describe your dream stay</span>
                  <input 
                    type="text" 
                    placeholder="Ex: Cheap hotel in Galle with a pool" 
                    className="bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm w-full p-0 h-6 font-medium"
                    
                    // වැදගත්ම කොටස් දෙක:
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button 
                size="lg" 
                className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/25 transition-all active:scale-95"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                {loading ? "Thinking..." : "Search"}
              </Button>
            </motion.div>
            {/* --- SEARCH BAR SECTION ENDS HERE --- */}

          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Destinations"}
              </h2>
              <p className="text-slate-600 mt-2">
                {hotels.length} hotels found based on your preference
              </p>
            </div>
            <Button variant="outline" onClick={loadAllHotels}>Show All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            ) : hotels.length > 0 ? (
              hotels.map((hotel) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))
            ) : (
               <div className="col-span-full text-center py-20 text-slate-500">
                  <p>No hotels found matching your description. Try something else!</p>
               </div>
            )}
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default Home;