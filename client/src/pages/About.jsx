import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, Users, Star, Clock, Headphones, Award } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      {/* --- HERO SECTION --- */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 transform scale-105 bg-fixed bg-center bg-cover"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
        
        {/* Modern Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900/90" />

        <div className="relative z-10 max-w-5xl px-4 pt-20 mx-auto space-y-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wider uppercase border rounded-full bg-white/5 border-white/10 backdrop-blur-md text-slate-300">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Since 2024
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl font-black leading-tight tracking-tighter text-white md:text-8xl drop-shadow-2xl">
            Redefining <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 animate-gradient">
              Luxury Travel
            </span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-xl font-light leading-relaxed text-slate-300">
            We merge cutting-edge AI technology with premium hospitality to curate experiences that aren't just trips, but memories.
          </motion.p>
        </div>
      </div>

      {/* --- OUR STORY & MISSION --- */}
      <section className="py-24 transition-colors bg-white dark:bg-slate-950">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-20 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold leading-tight md:text-5xl text-slate-900 dark:text-white">
                More than just a <br/>
                <span className="text-primary">Booking Platform</span>
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  Orrio began with a simple mission: to combine the power of Artificial Intelligence with the warmth of hospitality. We believe finding your perfect stay shouldn't be a chore—it should be the start of your adventure.
                </p>
                <p>
                  Our advanced AI algorithms analyze thousands of data points—from visual aesthetics to user reviews—to curate hotels that match not just your budget, but your vibe, your style, and your dreams.
                </p>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <h4 className="text-4xl font-bold text-slate-900 dark:text-white">150+</h4>
                  <p className="mt-1 text-sm tracking-wide uppercase text-slate-500">Premium Hotels</p>
                </div>
                <div>
                  <h4 className="text-4xl font-bold text-slate-900 dark:text-white">15k+</h4>
                  <p className="mt-1 text-sm tracking-wide uppercase text-slate-500">Happy Travelers</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl opacity-20 blur-2xl"></div>
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070" className="relative border shadow-2xl rounded-3xl border-slate-200 dark:border-slate-800" alt="About Orrio" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-slate-900 dark:text-white">Why Choose Orrio?</h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-800">We provide a full-service experience that goes beyond just booking a room.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: "AI-Powered Search", desc: "Our engine understands natural language to find exactly what you want." },
              { icon: ShieldCheck, title: "Secure Payments", desc: "Bank-grade encryption ensures your data is always safe." },
              { icon: Globe, title: "Global Coverage", desc: "Access to top-tier hotels in over 15 countries and counting." },
              { icon: Headphones, title: "24/7 Support", desc: "A dedicated team ready to assist you at any time of day." },
              { icon: Award, title: "Best Price Guarantee", desc: "We match or beat prices found on other major platforms." },
              { icon: Clock, title: "Instant Confirmation", desc: "No waiting. Get your booking voucher immediately via email." },
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 transition-all bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-primary/30 group"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-6 transition-colors duration-300 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary group-hover:text-white">
                  <service.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{service.title}</h3>
                <p className="leading-relaxed text-slate-500 dark:text-slate-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BIG BRAND FOOTER --- */}
      <section className="h-[50vh] bg-slate-900 dark:bg-black overflow-hidden relative flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[15vw] md:text-[18vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-950 dark:from-slate-800 dark:to-black select-none z-10"
            style={{ lineHeight: 0.8 }}
         >
            ORRIO
         </motion.h1>
         <div className="absolute bottom-10 text-slate-500 font-mono tracking-[0.5em] text-xs md:text-sm z-20">
            THE FUTURE OF HOSPITALITY
         </div>
      </section>
    </MainLayout>
  );
};

export default About;