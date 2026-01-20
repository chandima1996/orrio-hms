import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const Counter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });

  useEffect(() => {
    if (inView) { motionValue.set(value); }
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Number(latest).toFixed(value % 1 === 0 ? 0 : 1) + suffix;
      }
    });
  }, [springValue, value, suffix]);

  
  return <span ref={ref} className="text-5xl font-extrabold text-yellow-400 md:text-6xl drop-shadow-md" />;
};

const stats = [
  {
    id: 1,
    label: "Registered Hotels",
    value: 150,
    suffix: "+",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
  },
  {
    id: 2,
    label: "Countries",
    value: 15,
    suffix: "+",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074",
  },
  {
    id: 3,
    label: "User Rating",
    value: 4.9,
    suffix: "/5",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
  },
];

const StatsSection = () => {
  return (
    <section className="py-24 transition-colors duration-300 border-t bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="container px-4 mx-auto">
        
        
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Our Growing Impact</h2>
          <div className="w-20 h-1 mx-auto bg-yellow-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="relative h-[280px] rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 transition-transform duration-700 bg-center bg-cover group-hover:scale-110" style={{ backgroundImage: `url(${stat.image})` }} />
              <div className="absolute inset-0 transition-colors duration-500 bg-black/60 group-hover:bg-black/50" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-2xl font-bold tracking-wide text-white uppercase">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;