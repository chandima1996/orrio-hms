import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// අංක Count වෙන පොඩි Component එක
const Counter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        // දශම ස්ථාන නැතුව පෙන්වන්න (Rating එකට විතරක් දශම ඕනේ නම් වෙනස් කරන්න පුළුවන්)
        ref.current.textContent = Number(latest).toFixed(value % 1 === 0 ? 0 : 1) + suffix;
      }
    });
  }, [springValue, value, suffix]);

  return <span ref={ref} className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg" />;
};

const stats = [
  {
    id: 1,
    label: "Registered Hotels",
    value: 150,
    suffix: "+",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070", // Hotel Image
  },
  {
    id: 2,
    label: "Countries",
    value: 15,
    suffix: "+",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074", // Map/Travel Image
  },
  {
    id: 3,
    label: "User Rating",
    value: 4.9, // Decimal Value
    suffix: "/5",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070", // Happy People Image
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="relative h-[250px] rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${stat.image})` }}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="text-xl text-white/90 font-medium mt-2 tracking-wide uppercase">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;