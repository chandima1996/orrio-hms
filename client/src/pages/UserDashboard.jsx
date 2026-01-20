import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Settings, Heart, CalendarClock, Lock, MapPin, Phone, CreditCard, AlertCircle, Eye, XCircle, User, Hotel } from "lucide-react";
import { motion } from "framer-motion";
import HotelCard from "@/components/features/HotelCard";
import { fetchHotels, fetchMyBookings, cancelBooking, payForBooking } from "@/services/api"; 
import { format } from "date-fns";

const UserDashboard = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("bookings");
  
  
  const [hotels, setHotels] = useState([]); // Favorites
  const [bookings, setBookings] = useState([]); 
  const [loadingBookings, setLoadingBookings] = useState(true);
  
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  
  const [profileData, setProfileData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", idNumber: ""
  });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

 
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.publicMetadata?.phone || "",
        address: user.publicMetadata?.address || "",
        idNumber: user.publicMetadata?.idNumber || ""
      });
      loadBookings();
    }
  }, [user]);

  
  useEffect(() => {
    const loadFavorites = async () => {
      const data = await fetchHotels();
      setHotels(data.slice(0, 3)); 
    };
    loadFavorites();
  }, []);

  
  const loadBookings = async () => {
    if (user) {
      try {
        const data = await fetchMyBookings(user.id);
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setLoadingBookings(false);
      }
    }
  };

  const initiateCancel = (bookingId) => {
    setBookingToCancel(bookingId);
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel);
      await loadBookings(); // Refresh list
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
    } catch (error) {
      alert("Failed to cancel booking.");
    }
  };

  // Pay Now Flow
  const handlePayNow = async (bookingId) => {
    try {
      const response = await payForBooking(bookingId);
      if (response.url) window.location.href = response.url;
    } catch (error) {
      alert("Payment initiation failed.");
    }
  };

  // View Details
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  // Update Profile
  const handleProfileUpdate = async () => {
    try {
      await user.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        publicMetadata: {
            phone: profileData.phone,
            address: profileData.address,
            idNumber: profileData.idNumber
        }
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  const handlePasswordUpdate = () => {
   
    if (passwordData.new !== passwordData.confirm) {
        alert("New passwords do not match");
        return;
    }
    alert("Password update requires re-authentication (Security Feature).");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const getFilteredBookings = (filter) => {
    return bookings.filter(booking => booking.status === filter);
  };

  if (!isLoaded) return <div className="py-20 pt-32 text-center">Loading Dashboard...</div>;

  return (
    <MainLayout>
      <div className="min-h-screen pb-20 transition-colors duration-300 bg-slate-50 dark:bg-slate-950 pt-28">
        <div className="container px-4 mx-auto">
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            
            {/* --- SIDEBAR --- */}
            <div className="space-y-6 lg:col-span-1">
                <Card className="p-6 text-center bg-white border-none shadow-lg dark:bg-slate-900">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <img src={user?.imageUrl} alt="Profile" className="object-cover w-full h-full border-4 rounded-full border-slate-100 dark:border-slate-800" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full dark:border-slate-900"></div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user?.primaryEmailAddress?.emailAddress}</p>
                    <Badge variant="outline" className="mt-3 border-primary/20 text-primary bg-primary/5">Verified Member</Badge>
                </Card>

                <div className="p-2 overflow-hidden bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800">
                    <button onClick={() => setActiveTab("bookings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'bookings' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <CalendarClock className="w-5 h-5" /> My Bookings
                    </button>
                    <button onClick={() => setActiveTab("favorites")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'favorites' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <Heart className="w-5 h-5" /> Saved Hotels
                    </button>
                    <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <Settings className="w-5 h-5" /> Settings
                    </button>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="lg:col-span-3">
                
                {/* 1. BOOKINGS TAB */}
                {activeTab === "bookings" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Booking History</h2>
                        
                        <Tabs defaultValue="pending" className="w-full">
                            <TabsList className="w-full h-auto p-1 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl md:w-auto">
                                <TabsTrigger value="confirmed" className="px-6 py-2 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Confirmed</TabsTrigger>
                                <TabsTrigger value="pending" className="px-6 py-2 rounded-lg data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Pending</TabsTrigger>
                                <TabsTrigger value="cancelled" className="px-6 py-2 rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white">Cancelled</TabsTrigger>
                            </TabsList>

                            {["confirmed", "pending", "cancelled"].map((status) => (
                                <TabsContent key={status} value={status} className="mt-6 space-y-4">
                                    {loadingBookings ? (
                                        <div className="py-10 text-center">Loading your bookings...</div>
                                    ) : getFilteredBookings(status).length > 0 ? (
                                        getFilteredBookings(status).map((booking) => (
                                            <div key={booking._id} className="flex flex-col gap-6 p-5 transition-all bg-white border shadow-sm md:flex-row dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800 hover:shadow-lg">
                                                
                                               
                                                <img 
                                                    src={booking.roomId?.imageUrls?.[0] || booking.hotelId?.imageUrls?.[0] || ""} 
                                                    alt="Booking" 
                                                    className="object-cover w-full h-32 md:w-40 rounded-xl" 
                                                />
                                                
                                                <div className="flex flex-col justify-between flex-grow">
                                                    <div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                                    {booking.hotelId?.name || "Unknown Hotel"}
                                                                </h3>
                                                                <p className="text-sm font-medium text-slate-500">
                                                                    {booking.roomId?.title || "Unknown Room"}
                                                                </p>
                                                            </div>
                                                            <Badge className={`uppercase text-xs px-3 py-1 ${status === 'confirmed' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                                {status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                                                            <span className="flex items-center gap-1.5"><CalendarClock className="w-4 h-4" /> {format(new Date(booking.checkIn), "MMM dd")} - {format(new Date(booking.checkOut), "MMM dd, yyyy")}</span>
                                                            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> ${booking.totalAmount}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* ACTION BUTTONS */}
                                                    <div className="flex flex-wrap gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                                                        <Button size="sm" variant="outline" onClick={() => handleViewBooking(booking)} className="gap-2 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                                                            <Eye className="w-4 h-4" /> View
                                                        </Button>
                                                        
                                                        {status === 'pending' && (
                                                            <>
                                                                <Button size="sm" onClick={() => handlePayNow(booking._id)} className="gap-2 text-white border-none bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                                                                    <CreditCard className="w-4 h-4" /> Pay Now
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => initiateCancel(booking._id)} className="gap-2 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900 dark:hover:bg-red-900/40">
                                                                    <XCircle className="w-4 h-4" /> Cancel
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-10 text-center text-slate-500 dark:text-slate-400">No {status} bookings found.</div>
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </motion.div>
                )}

                {/* 2. FAVORITES TAB */}
                {activeTab === "favorites" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Saved Hotels</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {hotels.map(hotel => <HotelCard key={hotel._id} hotel={hotel} />)}
                        </div>
                    </motion.div>
                )}

                {/* 3. PROFILE SETTINGS */}
                {activeTab === "profile" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                       <Card className="bg-white border-none shadow-md dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-white">Personal Information</CardTitle>
                                <CardDescription>Update your personal details here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2"><Label className="dark:text-slate-300">First Name</Label><Input value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" /></div>
                                    <div className="space-y-2"><Label className="dark:text-slate-300">Last Name</Label><Input value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" /></div>
                                </div>
                                <div className="space-y-2"><Label className="dark:text-slate-300">Email Address</Label><Input value={profileData.email} disabled className="cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 opacity-70 dark:text-slate-400" /></div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2"><Label className="dark:text-slate-300">Phone Number</Label><Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" placeholder="+94 77..." /></div>
                                    <div className="space-y-2"><Label className="dark:text-slate-300">ID / Passport</Label><Input value={profileData.idNumber} onChange={(e) => setProfileData({...profileData, idNumber: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" /></div>
                                </div>
                                <div className="space-y-2"><Label className="dark:text-slate-300">Address</Label><Input value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" /></div>
                                <div className="flex justify-end mt-4"><Button onClick={handleProfileUpdate} className="bg-primary hover:bg-primary/90">Save Changes</Button></div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-none shadow-md dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white"><Lock className="w-5 h-5 text-primary" /> Security</CardTitle>
                                <CardDescription>Manage your password settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="dark:text-slate-300">Current Password</Label>
                                    <Input type="password" value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">New Password</Label>
                                        <Input type="password" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">Re-enter New Password</Label>
                                        <Input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button variant="outline" onClick={handlePasswordUpdate} className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">Change Password</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

            </div>
          </div>
        </div>

        {/* --- VIEW BOOKING DETAILS MODAL --- */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                        <Hotel className="w-6 h-6 text-primary" /> Booking Details
                    </DialogTitle>
                    <DialogDescription>Reference ID: {selectedBooking?._id}</DialogDescription>
                </DialogHeader>
                
                {selectedBooking && (
                    <div className="py-4 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-bold uppercase text-slate-500">Hotel</Label>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedBooking.hotelId?.name}</p>
                                    <p className="text-sm text-slate-500">{selectedBooking.hotelId?.city}</p>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold uppercase text-slate-500">Room Type</Label>
                                    <p className="font-medium text-slate-900 dark:text-white">{selectedBooking.roomId?.title}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-bold uppercase text-slate-500">Dates</Label>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {format(new Date(selectedBooking.checkIn), "MMM dd, yyyy")} - {format(new Date(selectedBooking.checkOut), "MMM dd, yyyy")}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold uppercase text-slate-500">Guests</Label>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {selectedBooking.guests?.adults} Adults, {selectedBooking.guests?.children} Children
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border bg-slate-50 dark:bg-slate-800 rounded-xl border-slate-100 dark:border-slate-700">
                            <h4 className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white">
                                <User className="w-4 h-4 text-primary" /> Guest Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-900 dark:text-slate-300">{user?.fullName}</span></div>
                                <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900 dark:text-slate-300">{user?.primaryEmailAddress?.emailAddress}</span></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl">
                            <span className="font-bold text-primary">Total Payment</span>
                            <span className="text-2xl font-bold text-primary">${selectedBooking.totalAmount}</span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>

        {/* --- CANCEL CONFIRMATION ALERT --- */}
        <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                        This action cannot be undone. This will permanently cancel your booking and you may lose your room reservation.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700">Keep Booking</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={confirmCancel} 
                        className="text-white bg-red-600 border-none hover:bg-red-700"
                    >
                        Yes, Cancel Booking
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </div>
    </MainLayout>
  );
};

export default UserDashboard; 