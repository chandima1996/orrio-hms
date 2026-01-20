import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { createRoom, fetchHotels } from "@/services/api";
import { Loader2 } from "lucide-react";

// Pre-defined Room Types & Amenities
const roomTypesList = [
  "Standard Room", "Deluxe Room", "Suite", "Family Room", 
  "Presidential Suite", "Ocean View Room", "Garden Villa", "Penthouse"
];

const roomFacilitiesList = [
  "AC", "WiFi", "TV", "Hot Water", "Balcony", 
  "Ocean View", "Mini Bar", "Work Desk", "Bathtub", "Kitchenette"
];

const RoomForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  
  // Custom Type Logic
  const [useCustomType, setUseCustomType] = useState(false);
  const [customType, setCustomType] = useState("");

  const [formData, setFormData] = useState({
    hotelId: "", title: "", price: "", maxPeople: "", desc: "",
    roomFacilities: [], imageUrls: "", startNumber: "101", count: "5"
  });

  // Load Hotels
  useEffect(() => {
    const loadHotels = async () => {
      const data = await fetchHotels();
      setHotels(data);
    };
    loadHotels();
  }, []);

  const handleFacilityChange = (item) => {
    setFormData(prev => ({
      ...prev,
      roomFacilities: prev.roomFacilities.includes(item)
        ? prev.roomFacilities.filter(f => f !== item)
        : [...prev.roomFacilities, item]
    }));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.hotelId) return alert("Please select a hotel first.");
    if(!confirm("Are you sure you want to create this room type?")) return;

    setLoading(true);
    try {
        const payload = {
            ...formData,
            title: useCustomType ? customType : formData.title, // Use custom or selected
            imageUrls: formData.imageUrls.split(",").map(url => url.trim()),
            price: Number(formData.price),
            maxPeople: Number(formData.maxPeople)
        };
        
        await createRoom(formData.hotelId, payload);
        alert("Room Created Successfully!");
        
        // Reset Form
        setFormData({ ...formData, price: "", desc: "", imageUrls: "" });
        setCustomType("");
        setUseCustomType(false);
        
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error(error);
        alert("Failed to create room.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Add New Room Type</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Select Hotel */}
            <div className="space-y-2">
                <Label>Select Hotel</Label>
                <Select onValueChange={(val) => setFormData({...formData, hotelId: val})}>
                    <SelectTrigger className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700">
                        <SelectValue placeholder="Choose a hotel" />
                    </SelectTrigger>
                    <SelectContent>
                        {hotels.map(h => <SelectItem key={h._id} value={h._id}>{h.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Room Title (Dropdown + Custom) */}
            <div className="space-y-2">
                <Label>Room Type</Label>
                {!useCustomType ? (
                    <Select onValueChange={(val) => {
                        if(val === 'custom') setUseCustomType(true);
                        else setFormData({...formData, title: val});
                    }}>
                        <SelectTrigger className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700">
                            <SelectValue placeholder="Select Room Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {roomTypesList.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            <SelectItem value="custom" className="font-bold text-primary focus:bg-primary/10">+ Create New Type</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter custom room type" 
                            value={customType} 
                            onChange={e => setCustomType(e.target.value)} 
                            className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700" 
                        />
                        <Button variant="ghost" onClick={() => setUseCustomType(false)}>Cancel</Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="price">Price Per Night ($)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={handleChange} required className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxPeople">Max People</Label>
                    <Input id="maxPeople" type="number" value={formData.maxPeople} onChange={handleChange} required className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700" />
                </div>
            </div>

            {/* Room Generation Config */}
            <div className="grid grid-cols-1 gap-6 p-4 border md:grid-cols-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-slate-200 dark:border-slate-800">
                <div className="space-y-2">
                    <Label htmlFor="startNumber">Starting Room No.</Label>
                    <Input id="startNumber" type="number" placeholder="101" value={formData.startNumber} onChange={handleChange} required className="dark:bg-slate-800 dark:text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="count">Number of Rooms to Create</Label>
                    <Input id="count" type="number" placeholder="5" value={formData.count} onChange={handleChange} required className="dark:bg-slate-800 dark:text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={formData.desc} onChange={handleChange} required className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700" />
            </div>

            {/* Facilities */}
            <div className="space-y-3">
                <Label>Facilities</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border md:grid-cols-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-slate-200 dark:border-slate-800">
                    {roomFacilitiesList.map(item => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`rm-${item}`} 
                                checked={formData.roomFacilities.includes(item)} 
                                onCheckedChange={() => handleFacilityChange(item)} 
                                className="border-slate-400 dark:border-slate-600"
                            />
                            <label htmlFor={`rm-${item}`} className="text-sm dark:text-slate-300">{item}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrls">Image URLs (Comma separated)</Label>
                <Textarea id="imageUrls" value={formData.imageUrls} onChange={handleChange} required className="dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700" />
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-bold shadow-md" disabled={loading}>
                {loading ? <Loader2 className="mr-2 animate-spin" /> : "Create Room Type"}
            </Button>
        </form>
    </Card>
  );
};

export default RoomForm;