import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Black gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/5" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 z-10 relative mt-16">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Animated Headline */}
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

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto"
            >
              Experience the future of hospitality. Orrio's AI curates hotels based on your vibe, budget, and preferences instantly.
            </motion.p>

            {/* Modern Search Bar UI */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 p-2 bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-4 h-14 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <MapPin className="text-slate-400 mr-3 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Location</span>
                  <input type="text" placeholder="Where are you going?" className="bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm w-full p-0 h-5" />
                </div>
              </div>

              <div className="flex-1 flex items-center px-4 h-14 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <Calendar className="text-slate-400 mr-3 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Dates</span>
                  <span className="text-sm text-slate-900">Check-in - Check-out</span>
                </div>
              </div>

              <div className="flex-1 flex items-center px-4 h-14 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <Users className="text-slate-400 mr-3 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Guests</span>
                  <span className="text-sm text-slate-900">2 Adults, 0 Children</span>
                </div>
              </div>

              <Button size="lg" className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/25">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;