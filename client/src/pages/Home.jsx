import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import HotelCard from "@/components/features/HotelCard"; // අලුත්
import { fetchHotels } from "@/services/api"; // අලුත්
import { Skeleton } from "@/components/ui/skeleton"; // අලුත්

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Page එක load වෙද්දී data ගේන්න
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await fetchHotels();
        setHotels(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  return (
    <MainLayout>
      {/* --- HERO SECTION (මේක කලින් තිබ්බ එකමයි) --- */}
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

            {/* Search Bar UI (කලින් එකමයි) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 p-2 bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2"
            >
               {/* ... Search Inputs ටික මෙතන තියෙන්න ඕනේ කලින් වගේම ... */}
               {/* මම දිග වැඩි වෙන නිසා inputs code එක නැවත ලිව්වේ නෑ, ඔයා කලින් එකේ තිබ්බ එකම තියන්න */}
               <div className="flex-1 flex items-center px-4 h-14 bg-slate-50 rounded-xl">
                 <MapPin className="text-slate-400 mr-3 h-5 w-5" />
                 <input type="text" placeholder="Location" className="bg-transparent outline-none w-full" />
               </div>
               <Button size="lg" className="h-14 px-8 rounded-xl bg-primary text-lg">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURED HOTELS SECTION (අලුත් කොටස) --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Destinations</h2>
              <p className="text-slate-600 mt-2">Hand-picked hotels just for you</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              // Loading Skeletons (Data එනකන් පෙන්නන දේ)
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            ) : (
              // Real Data Cards
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
            )}
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default Home;