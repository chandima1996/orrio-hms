import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Travel Blogger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
    content: "Orrio made my trip to Sri Lanka absolutely seamless. The AI recommendations were spot on! I found a hidden gem in Ella.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Digital Nomad",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    content: "The booking process is incredibly fast. I love the minimalist design and how easy it is to filter by facilities.",
    rating: 5,
  },
  {
    name: "Amara Perera",
    role: "Local Explorer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    content: "Finally, a platform that understands local travel. The payment integration was smooth, and confirmation was instant.",
    rating: 4,
  },
  {
    name: "Michael Ross",
    role: "Business Traveler",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150",
    content: "I booked a last-minute stay in Colombo. The AI search saved me hours of browsing. Dark mode is a nice touch!",
    rating: 5,
  },
  {
    name: "Jessica Lee",
    role: "Photographer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150",
    content: "Visually stunning website and equally stunning hotels. Every property listed here seems to be hand-picked for quality.",
    rating: 5,
  },
  {
    name: "Tom Hardy",
    role: "Architect",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
    content: "The UI is just beautiful. It feels premium and trustworthy. Great job Orrio team on the design!",
    rating: 5,
  },
  {
    name: "Emma Watson",
    role: "Foodie",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150",
    content: "Found amazing hotels with great buffets thanks to the AI search. Very convenient for family trips.",
    rating: 4,
  },
  {
    name: "Raj Patel",
    role: "Backpacker",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
    content: "Budget options are great. Found a really nice hostel in Ella for a cheap price. Will use again.",
    rating: 5,
  },
];

const Testimonials = () => {
  // Autoplay with resume capability
  const plugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Loved by Travelers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            See what our community has to say about their Orrio experience.
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          // FIX: Mouse Leave Logic
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.play}
          opts={{
            align: "start",
            loop: true, // Infinite Loop
          }}
        >
          <CarouselContent className="-ml-4 py-4">
            {testimonials.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                
                <div className="h-full">
                  <Card className="h-full border-none shadow-lg bg-slate-50 dark:bg-slate-800/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
                    <CardContent className="p-8 flex flex-col h-full">
                      
                      <Quote className="w-10 h-10 text-primary/20 mb-4" />
                      
                      <p className="text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed flex-grow">
                        "{item.content}"
                      </p>

                      <div className="flex items-center gap-4 mt-auto">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                           {Array.from({ length: item.rating }).map((_, i) => (
                             <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                           ))}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </div>

              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

      </div>
    </section>
  );
};

export default Testimonials;