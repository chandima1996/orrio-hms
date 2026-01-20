import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Users, Check, Edit2 } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { Badge } from "@/components/ui/badge";

const ReservationModal = ({ hotel, children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step1Locked, setStep1Locked] = useState(false);
  const [step2Locked, setStep2Locked] = useState(true); 
  const [step3Locked, setStep3Locked] = useState(true);

  const [date, setDate] = useState({ from: new Date(), to: new Date() });
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [roomCount, setRoomCount] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState([]); 
  const [guestDetails, setGuestDetails] = useState({ name: "", email: "", phone: "", nic: "" });

  const totalGuests = parseInt(guests.adults) + parseInt(guests.children);
  const nights = date?.from && date?.to ? differenceInCalendarDays(date.to, date.from) : 0;

  const handleSaveStep1 = () => {
    if (!date?.from || !date?.to || nights <= 0) return alert("Select valid dates");
    if (roomCount <= 0) return alert("Select rooms");
    setStep1Locked(true);
    setStep2Locked(false); 
    setSelectedRooms([]); 
  };

  const filteredRooms = hotel.rooms?.filter(room => {
    const avgCapacity = Math.ceil(totalGuests / roomCount);
    return room.maxPeople >= avgCapacity;
  }) || [];

  const toggleRoomSelection = (room) => {
    if (selectedRooms.find(r => r._id === room._id)) {
      setSelectedRooms(prev => prev.filter(r => r._id !== room._id));
    } else {
      if (selectedRooms.length < roomCount) {
        setSelectedRooms(prev => [...prev, room]);
      }
    }
  };

  const handleSaveStep2 = () => {
    if (selectedRooms.length !== parseInt(roomCount)) return alert(`Select exactly ${roomCount} room(s).`);
    setStep2Locked(true);
    setStep3Locked(false);
  };

  const handleProceed = () => {
    if (!guestDetails.name || !guestDetails.email || !guestDetails.phone || !guestDetails.nic) return alert("Fill all details");
    setOpen(false);
    navigate("/booking-summary", {
      state: { hotelName: hotel.name, hotelId: hotel._id, date, guests, roomCount, selectedRooms, guestDetails, nights }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Make a Reservation</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* STEP 1 */}
          <div className={`p-5 rounded-2xl border ${step1Locked ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-primary shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">1. Dates & Occupancy {step1Locked && <Check className="w-5 h-5 text-green-500" />}</h3>
              {step1Locked && <Button variant="ghost" size="sm" onClick={() => { setStep1Locked(false); setStep2Locked(true); setStep3Locked(true); }}><Edit2 className="w-4 h-4 mr-1" /> Edit</Button>}
            </div>
            {!step1Locked ? (
              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label className="dark:text-slate-300">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start w-full font-normal text-left bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {date?.from ? (date.to ? `${format(date.from, "LLL dd")} - ${format(date.to, "LLL dd")}` : format(date.from, "LLL dd")) : <span>Pick dates</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900" align="start">
                      <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="dark:text-slate-300">Adults</Label><Input type="number" min="1" value={guests.adults} onChange={(e) => setGuests({...guests, adults: e.target.value})} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                  <div><Label className="dark:text-slate-300">Children</Label><Input type="number" min="0" value={guests.children} onChange={(e) => setGuests({...guests, children: e.target.value})} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                </div>
                <div><Label className="dark:text-slate-300">Rooms</Label><Input type="number" min="1" max="10" value={roomCount} onChange={(e) => setRoomCount(e.target.value)} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                <Button className="w-full font-bold" onClick={handleSaveStep1} disabled={!date?.from || !date?.to}>Next: Select Rooms</Button>
              </div>
            ) : <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{nights} Nights • {totalGuests} Guests • {roomCount} Rooms</div>}
          </div>

          {/* STEP 2 */}
          <div className={`p-5 rounded-2xl border transition-all ${step2Locked ? (selectedRooms.length > 0 ? 'bg-slate-50 dark:bg-slate-900 border-green-500/30' : 'opacity-60 border-slate-200 dark:border-slate-800') : 'bg-white dark:bg-slate-900 border-primary shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">2. Select Rooms {selectedRooms.length === parseInt(roomCount) && step2Locked && <Check className="w-5 h-5 text-green-500" />}</h3>
              {step2Locked && selectedRooms.length > 0 && <Button variant="ghost" size="sm" onClick={() => { setStep2Locked(false); setStep3Locked(true); }}><Edit2 className="w-4 h-4 mr-1" /> Edit</Button>}
            </div>
            {!step2Locked && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Select rooms for {totalGuests} guests:</p>
                {filteredRooms.length > 0 ? (
                    <div className="grid gap-3">
                    {filteredRooms.map((room) => {
                        const isSelected = selectedRooms.find(r => r._id === room._id);
                        return (
                        <div key={room._id} onClick={() => toggleRoomSelection(room)} className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary/50'}`}>
                            <div className="flex items-center justify-between">
                            <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">{room.title}</h4><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Max: {room.maxPeople} | ${room.price}</p></div>
                            {isSelected && <Badge className="bg-primary">Selected</Badge>}
                            </div>
                        </div>
                        )
                    })}
                    </div>
                ) : <p className="text-sm text-red-500">No rooms found. Try increasing room count.</p>}
                <div className="flex items-center justify-between mt-2">
                   <span className="text-xs font-bold text-primary">{selectedRooms.length} / {roomCount} selected</span>
                   <Button onClick={handleSaveStep2} disabled={selectedRooms.length !== parseInt(roomCount)} className="font-bold">Next: Details</Button>
                </div>
              </div>
            )}
            {step2Locked && selectedRooms.length > 0 && <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{selectedRooms.map(r => r.title).join(", ")}</div>}
          </div>

          {/* STEP 3 */}
          <div className={`p-5 rounded-2xl border transition-all ${step3Locked ? 'opacity-60 border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-primary shadow-sm'}`}>
             <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">3. Primary Guest Details</h3>
             {!step3Locked && (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div><Label className="dark:text-slate-300">Name</Label><Input value={guestDetails.name} onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                      <div><Label className="dark:text-slate-300">NIC</Label><Input value={guestDetails.nic} onChange={(e) => setGuestDetails({...guestDetails, nic: e.target.value})} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><Label className="dark:text-slate-300">Email</Label><Input value={guestDetails.email} onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                      <div><Label className="dark:text-slate-300">Phone</Label><Input value={guestDetails.phone} onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})} className="bg-slate-50 dark:bg-slate-800 dark:text-white" /></div>
                   </div>
                   <Button className="w-full h-12 mt-4 text-lg text-white bg-gradient-to-r from-blue-600 to-violet-600" onClick={handleProceed}>Proceed to Summary</Button>
                </div>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;