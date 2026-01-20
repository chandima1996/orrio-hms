import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

const Contact = () => {
  return (
    <MainLayout>
     
      <div className="relative flex items-center justify-center min-h-screen pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')" }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-slate-950" />

        <div className="container z-10 grid items-center grid-cols-1 gap-12 px-4 mx-auto lg:grid-cols-2">
          
         
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
                Let's Start a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  Conversation
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-slate-300">
                Have a question about a booking? Need help planning your trip? Or just want to say hi? We'd love to hear from you.
              </p>
            </motion.div>

            <div className="grid gap-6">
               {[
                  { icon: Mail, title: "Email Us", info: "support@orrio.com" },
                  { icon: Phone, title: "Call Us", info: "+1 (555) 123-4567" },
                  { icon: MapPin, title: "Visit Us", info: "123 Innovation Dr, Colombo 03, LK" },
               ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (index * 0.1) }}
                    className="flex items-center gap-4 p-4 transition-colors border bg-white/5 backdrop-blur-sm rounded-xl border-white/10 hover:bg-white/10"
                  >
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 shrink-0">
                        <item.icon className="w-5 h-5 text-blue-400" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.info}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
          </div>

         
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
             className="p-8 border shadow-2xl bg-white/10 backdrop-blur-xl md:p-10 rounded-3xl border-white/20"
          >
            <h2 className="mb-6 text-2xl font-bold text-white">Send us a Message</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-slate-300">First Name</label>
                  <Input placeholder="John" className="h-12 text-white bg-black/20 border-white/10 placeholder:text-white/30 focus-visible:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wide uppercase text-slate-300">Last Name</label>
                  <Input placeholder="Doe" className="h-12 text-white bg-black/20 border-white/10 placeholder:text-white/30 focus-visible:ring-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-slate-300">Email Address</label>
                <Input placeholder="john@example.com" className="h-12 text-white bg-black/20 border-white/10 placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-slate-300">Message</label>
                <Textarea placeholder="Tell us how we can help..." className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500 min-h-[120px] resize-none" />
              </div>
              <Button className="w-full text-lg font-bold border shadow-lg h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-white/10">
                Send Message <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>

        </div>
      </div>

     
      <section className="relative flex items-center justify-center py-20 overflow-hidden border-t bg-slate-900 dark:bg-black border-white/5">
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
      </section>
    </MainLayout>
  );
};

export default Contact;