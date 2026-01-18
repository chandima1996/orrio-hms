import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import HotelCard from "@/components/features/HotelCard";

const FeaturedHotels = ({ hotels, loading, searchQuery, onShowAll }) => {
  
  // Autoplay Config
  // stopOnInteraction: false කියන්නේ click කළාට පස්සෙත් Autoplay දිගටම යන්න ඕනේ කියන එක.
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Destinations"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {hotels.length} hotels found based on your preference
            </p>
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={onShowAll} className="dark:bg-slate-900 dark:text-white">
              Show All
            </Button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            // FIX: Mouse එක තිබ්බම නවතිනවා, ගත්තම ආයේ play වෙනවා
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            opts={{
              align: "start",
              loop: true, // Infinite Loop
            }}
          >
            <CarouselContent className="-ml-4 py-4">
              {hotels.map((hotel) => (
                <CarouselItem key={hotel._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <HotelCard hotel={hotel} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <p className="text-lg">No hotels found matching your description.</p>
            <Button variant="link" onClick={onShowAll} className="mt-2 text-primary">
              View all hotels
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHotels;