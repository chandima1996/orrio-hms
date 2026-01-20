import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import HotelCard from "@/components/features/HotelCard";

const FeaturedHotels = ({ hotels, loading, searchQuery, onShowAll }) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

  return (
    <section className="py-24 transition-colors duration-300 bg-white border-t dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <div className="container px-4 mx-auto">
        
        
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900 dark:text-white">
            {searchQuery ? (
               <span>Results for <span className="text-primary">"{searchQuery}"</span></span>
            ) : (
               <span>Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Destinations</span></span>
            )}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Discover our hand-picked selection of luxury stays and hidden gems tailored just for you.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[420px] w-full rounded-xl dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="py-4 -ml-4">
              {hotels.map((hotel) => (
                <CarouselItem key={hotel._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <HotelCard hotel={hotel} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400">
            <p className="text-lg">No hotels found matching your description.</p>
            <Button variant="link" onClick={onShowAll} className="mt-2 text-primary">View all hotels</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHotels;