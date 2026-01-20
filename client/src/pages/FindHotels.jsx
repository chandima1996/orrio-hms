import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { fetchHotels } from "@/services/api";
import HotelCard from "@/components/features/HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FindHotels = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("query") || "";
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  
 
  const [locationFilter, setLocationFilter] = useState(urlQuery);
  const [priceRange, setPriceRange] = useState([1000]); 
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortOption, setSortOption] = useState("recommended");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchHotels();
        setHotels(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

 
  const filteredHotels = useMemo(() => {
    let result = hotels;

    
    if (locationFilter) {
      result = result.filter(h => 
        h.city.toLowerCase().includes(locationFilter.toLowerCase()) || 
        h.country.toLowerCase().includes(locationFilter.toLowerCase()) ||
        h.name.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    
    result = result.filter(h => {
      
       if (!h.rooms || h.rooms.length === 0) return true; 
       
      
       const minPrice = Math.min(...h.rooms.map(r => r.price || 0));
       return minPrice <= priceRange[0];
    });

  
    if (selectedRating > 0) {
      result = result.filter(h => h.starRating >= selectedRating);
    }

 
    if (selectedAmenities.length > 0) {
      result = result.filter(h => 
        selectedAmenities.every(amenity => 
          h.facilities.some(f => f.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }

   
    if (sortOption === "ratingHighLow") {
      result.sort((a, b) => b.starRating - a.starRating);
    }
   

    return result;
  }, [hotels, locationFilter, priceRange, selectedRating, selectedAmenities, sortOption]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const amenitiesList = ["Wifi", "Pool", "Spa", "Gym", "Parking", "Restaurant", "Bar", "Beach"];

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <MainLayout>
      <div className="relative h-[450px] flex items-center justify-center overflow-hidden pt-20"> 
         <div 
           className="absolute inset-0 bg-fixed bg-center bg-no-repeat bg-cover"
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2070')" }}
         />
         <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
         
         <div className="relative z-10 px-4 space-y-6 text-center duration-700 animate-in fade-in zoom-in">
            <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl drop-shadow-2xl">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                 Discover Your Paradise
               </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl font-light text-slate-100 drop-shadow-md">
               Explore top-rated stays, curated luxury, and hidden gems all in one place.
            </p>
         </div>
      </div>

      <div className="min-h-screen py-10 transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            
            {/* Sidebar */}
            <aside className="w-full space-y-6 lg:w-1/4">
              <div className="sticky p-6 transition-colors bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800 top-24">
                <div className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-900 dark:text-white">
                   <SlidersHorizontal className="w-5 h-5" /> Filters
                </div>
                
                <Accordion type="multiple" defaultValue={["location", "price", "amenities"]} className="w-full">
                  <AccordionItem value="location" className="border-slate-200 dark:border-slate-800">
                    <AccordionTrigger className="text-slate-700 dark:text-slate-200 hover:no-underline">Location / Name</AccordionTrigger>
                    <AccordionContent>
                      <Input 
                        placeholder="Where do you want to go?" 
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price" className="border-slate-200 dark:border-slate-800">
                    <AccordionTrigger className="text-slate-700 dark:text-slate-200 hover:no-underline">Max Price: ${priceRange[0]}</AccordionTrigger>
                    <AccordionContent>
                      <Slider 
                        defaultValue={[1000]} 
                        max={2000} 
                        step={50} 
                        value={priceRange} 
                        onValueChange={setPriceRange}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>$0</span>
                        <span>$2000+</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rating" className="border-slate-200 dark:border-slate-800">
                     <AccordionTrigger className="text-slate-700 dark:text-slate-200 hover:no-underline">Star Rating</AccordionTrigger>
                     <AccordionContent>
                        <div className="space-y-3">
                           {[5, 4, 3].map((star) => (
                              <div key={star} className="flex items-center space-x-2 cursor-pointer group" onClick={() => setSelectedRating(star === selectedRating ? 0 : star)}>
                                 <Checkbox id={`star-${star}`} checked={selectedRating === star} className="border-slate-400 dark:border-slate-600" />
                                 <label className="flex items-center gap-1 text-sm font-medium leading-none cursor-pointer text-slate-700 dark:text-slate-300 group-hover:text-primary">
                                    {Array.from({length: star}).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                                    <span className="ml-1 text-xs">& Up</span>
                                 </label>
                              </div>
                           ))}
                        </div>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="amenities" className="border-slate-200 dark:border-slate-800">
                    <AccordionTrigger className="text-slate-700 dark:text-slate-200 hover:no-underline">Amenities</AccordionTrigger>
                    <AccordionContent>
                       <div className="grid grid-cols-2 gap-3">
                          {amenitiesList.map((amenity) => (
                             <div key={amenity} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={amenity} 
                                  checked={selectedAmenities.includes(amenity)}
                                  onCheckedChange={() => toggleAmenity(amenity)}
                                  className="border-slate-400 dark:border-slate-600"
                                />
                                <label htmlFor={amenity} className="text-sm font-medium leading-none cursor-pointer text-slate-700 dark:text-slate-300">{amenity}</label>
                             </div>
                          ))}
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button 
                   variant="outline" 
                   className="w-full mt-6 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
                   onClick={() => {
                      setLocationFilter("");
                      setPriceRange([1000]);
                      setSelectedRating(0);
                      setSelectedAmenities([]);
                   }}
                >
                   Reset Filters
                </Button>
              </div>
            </aside>

            {/* Content */}
            <div className="w-full lg:w-3/4">
               <div className="flex flex-col items-center justify-between gap-4 p-4 mb-6 transition-colors bg-white border shadow-sm md:flex-row dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
                  <p className="font-medium text-slate-600 dark:text-slate-400">
                     Showing <span className="font-bold text-slate-900 dark:text-white">{filteredHotels.length}</span> properties
                  </p>
                  
                  <div className="flex items-center gap-4">
                     <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                           <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                           <SelectItem value="recommended">Recommended</SelectItem>
                           <SelectItem value="ratingHighLow">Rating: High to Low</SelectItem>
                        </SelectContent>
                     </Select>

                     <div className="flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                           <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                           <List className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>

               {loading ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                     {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className={`rounded-2xl dark:bg-slate-800 ${viewMode === 'grid' ? 'h-[450px]' : 'h-[280px]'}`} />
                     ))}
                  </div>
               ) : paginatedHotels.length > 0 ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                     {paginatedHotels.map((hotel) => (
                        <HotelCard key={hotel._id} hotel={hotel} viewMode={viewMode} />
                     ))}
                  </div>
               ) : (
                  <div className="py-20 text-center bg-white border border-dashed dark:bg-slate-900 rounded-2xl border-slate-300 dark:border-slate-700">
                     <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800">
                        <Search className="w-10 h-10 text-slate-400" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">No hotels found</h3>
                     <p className="mt-2 text-slate-500">Try adjusting your filters.</p>
                  </div>
               )}

               {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                     <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800">
                        <ChevronLeft className="w-4 h-4" />
                     </Button>
                     <span className="px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
                     <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800">
                        <ChevronRight className="w-4 h-4" />
                     </Button>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindHotels;