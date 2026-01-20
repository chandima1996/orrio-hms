import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createHotel, updateHotel } from "@/services/api";
import { Loader2, Search, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet Icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const amenitiesList = [
  "Free WiFi", "Swimming Pool", "Spa & Wellness", "Fitness Center", "Bar / Lounge", 
  "Restaurant", "Free Parking", "Beach Access", "Room Service", "Airport Shuttle",
  "Family Rooms", "Non-smoking Rooms"
];

// Map Picker
const LocationPicker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if(position) map.flyTo(position, 13);
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const HotelForm = ({ onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Coordinates State (Default: Sri Lanka Center)
  const [coords, setCoordinates] = useState([7.8731, 80.7718]); 

  const [formData, setFormData] = useState({
    name: "", city: "", country: "", address: "", 
    description: "", starRating: 5, phone: "", email: "",
    facilities: [], imageUrls: ""
  });

  useEffect(() => {
    if (initialData) {
        setFormData({
            ...initialData,
            imageUrls: Array.isArray(initialData.imageUrls) ? initialData.imageUrls.join(", ") : initialData.imageUrls,
        });
        if(initialData.lat && initialData.lng) {
            setCoordinates([initialData.lat, initialData.lng]);
        }
    }
  }, [initialData]);

  // Handle Search Location
  const handleSearchLocation = async () => {
    if(!searchQuery) return;
    setIsSearching(true);
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
        const data = await res.json();
        if(data && data.length > 0) {
            const { lat, lon } = data[0];
            setCoordinates([parseFloat(lat), parseFloat(lon)]);
        } else {
            alert("Location not found");
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSearching(false);
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities };
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!confirm(`Are you sure you want to ${initialData ? 'update' : 'create'} this hotel?`)) return;

    setLoading(true);
    try {
        const payload = {
            ...formData,
            imageUrls: formData.imageUrls.split(",").map(url => url.trim()),
            starRating: parseInt(formData.starRating),
            lat: coords[0], 
            lng: coords[1]
        };

        if (initialData) {
            await updateHotel(initialData._id, payload);
            alert("Hotel Updated Successfully!");
        } else {
            await createHotel(payload);
            alert("Hotel Created Successfully!");
        }
        
        if (!initialData) {
            setFormData({ name: "", city: "", country: "", address: "", description: "", starRating: 5, phone: "", email: "", facilities: [], imageUrls: "" });
            setCoordinates([7.8731, 80.7718]); // Reset Map
        }
        if (onSuccess) onSuccess();

    } catch (error) {
        console.error(error);
        alert("Operation Failed.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Hotel' : 'Add New Hotel'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">Hotel Name</Label><Input id="name" value={formData.name} onChange={handleChange} required className="dark:bg-slate-800" /></div>
                <div className="space-y-2"><Label htmlFor="starRating">Star Rating (1-5)</Label><Input id="starRating" type="number" min="1" max="5" value={formData.starRating} onChange={handleChange} required className="dark:bg-slate-800" /></div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={formData.city} onChange={handleChange} required className="dark:bg-slate-800" /></div>
                <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={formData.country} onChange={handleChange} required className="dark:bg-slate-800" /></div>
            </div>
            
            <div className="space-y-2"><Label htmlFor="address">Full Address</Label><Input id="address" value={formData.address} onChange={handleChange} required className="dark:bg-slate-800" /></div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={handleChange} required className="dark:bg-slate-800" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleChange} required className="dark:bg-slate-800" /></div>
            </div>
            
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={handleChange} required className="dark:bg-slate-800 min-h-[100px]" /></div>
            <div className="space-y-2"><Label htmlFor="imageUrls">Image URLs (Comma separated)</Label><Textarea id="imageUrls" placeholder="url1, url2" value={formData.imageUrls} onChange={handleChange} required className="dark:bg-slate-800" /></div>
            
            <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border md:grid-cols-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-slate-200 dark:border-slate-800">
                    {amenitiesList.map(item => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={`fac-${item}`} checked={formData.facilities.includes(item)} onCheckedChange={() => handleFacilityChange(item)} />
                            <label htmlFor={`fac-${item}`} className="text-sm cursor-pointer dark:text-slate-300">{item}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAP PICKER */}
            <div className="space-y-3">
                <Label>Hotel Location (Search or Click on Map)</Label>
                
                <div className="flex gap-2 mb-2">
                    <Input placeholder="Search location (e.g. Galle Face Green)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="dark:bg-slate-800" />
                    <Button type="button" onClick={handleSearchLocation} disabled={isSearching}>{isSearching ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}</Button>
                </div>

                <div className="h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0">
                    <MapContainer center={coords} zoom={7} scrollWheelZoom={true} className="w-full h-full">
                        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker position={coords} setPosition={setCoordinates} />
                    </MapContainer>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" /> Selected Coordinates: {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
                </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 animate-spin" /> : (initialData ? 'Update Hotel' : 'Create Hotel')}
            </Button>
        </form>
    </Card>
  );
};

export default HotelForm;