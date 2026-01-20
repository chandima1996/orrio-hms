import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { fetchAdminStats, deleteUser, deleteHotel, deleteRoom, cancelBooking } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Hotel, BedDouble, CalendarCheck, Activity, Trash2, PlusCircle, LayoutGrid, List, Edit, Eye, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";

import HotelForm from "@/components/admin/HotelForm";
import RoomForm from "@/components/admin/RoomForm";
import UserForm from "@/components/admin/UserForm";

const AdminDashboard = () => {
  const [data, setData] = useState({ users: [], hotels: [], rooms: [], bookingsList: [], bookings: {} });
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState({ hotel: 'list', room: 'list', user: 'list' });
  const [editItem, setEditItem] = useState(null);
  
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminStats();
      setData(res);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleEdit = (type, item) => {
    setEditItem(item);
    setViewState({ ...viewState, [type]: 'edit' });
  };

  const confirmDelete = (type, id) => {
    setDeleteType(type);
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAction = async () => {
    try {
      if (deleteType === 'user') await deleteUser(deleteId);
      if (deleteType === 'hotel') await deleteHotel(deleteId);
      if (deleteType === 'room') await deleteRoom(deleteId);
      if (deleteType === 'booking') await cancelBooking(deleteId);
      await loadDashboardData();
      setIsDeleteDialogOpen(false);
    } catch (error) { alert("Failed to delete item."); }
  };

  const chartData = [
    { name: 'Pending', count: data.bookings?.pending || 0, color: '#eab308' },
    { name: 'Confirmed', count: data.bookings?.confirmed || 0, color: '#22c55e' },
    { name: 'Cancelled', count: data.bookings?.cancelled || 0, color: '#ef4444' },
  ];

  if (loading || !data) return <div className="pt-40 text-center">Loading Dashboard...</div>;

  return (
    <MainLayout>
      <div className="min-h-screen pb-20 transition-colors duration-300 bg-slate-50 dark:bg-slate-950 pt-28">
        <div className="container px-4 mx-auto">
            
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    <Activity className="w-4 h-4" /> System Active
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Users" value={data.totalUsers} icon={Users} color="text-blue-500 bg-blue-50 dark:bg-blue-900/20" />
                <StatsCard title="Total Hotels" value={data.totalHotels} icon={Hotel} color="text-purple-500 bg-purple-50 dark:bg-purple-900/20" />
                <StatsCard title="Total Rooms" value={data.totalRooms} icon={BedDouble} color="text-orange-500 bg-orange-50 dark:bg-orange-900/20" />
                <StatsCard title="Total Bookings" value={data.bookings?.total || 0} icon={CalendarCheck} color="text-green-500 bg-green-50 dark:bg-green-900/20" />
            </div>

            <Card className="p-6 mb-12 shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="px-0 pt-0"><CardTitle className="text-slate-900 dark:text-white">Booking Analytics</CardTitle></CardHeader>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} /><XAxis dataKey="name" stroke="#888888" /><YAxis stroke="#888888" /><Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} /><Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>{chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar></BarChart></ResponsiveContainer>
                </div>
            </Card>

            <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="flex-wrap w-full h-auto p-1 mb-6 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 md:w-auto">
                    <TabsTrigger value="bookings" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Manage Bookings</TabsTrigger>
                    <TabsTrigger value="hotels" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Manage Hotels</TabsTrigger>
                    <TabsTrigger value="rooms" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Manage Rooms</TabsTrigger>
                    <TabsTrigger value="users" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Manage Users</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings" className="focus-visible:ring-0">
                    <Card className="overflow-hidden bg-white shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Hotel</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {data.bookingsList?.map(b => (
                                        <tr key={b._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-mono text-xs">{b._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-6 py-4">{b.hotelId?.name} - {b.roomId?.title}</td>
                                            <td className="px-6 py-4 text-xs">{format(new Date(b.checkIn), "MMM dd")}</td>
                                            <td className="px-6 py-4"><Badge className={b.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}>{b.status}</Badge></td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <Button size="icon" variant="outline" onClick={() => { setSelectedBooking(b); setIsBookingModalOpen(true); }}><Eye className="w-4 h-4" /></Button>
                                                {b.status === 'pending' && <Button size="icon" variant="destructive" onClick={() => confirmDelete('booking', b._id)}><XCircle className="w-4 h-4" /></Button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="hotels">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">{viewState.hotel === 'list' ? 'Registered Hotels' : (viewState.hotel === 'edit' ? 'Edit Hotel' : 'Add New Hotel')}</h2>
                        <Button onClick={() => { setViewState({...viewState, hotel: viewState.hotel === 'list' ? 'create' : 'list'}); setEditItem(null); }}>
                            {viewState.hotel === 'list' ? <><PlusCircle className="w-4 h-4 mr-2"/> Add Hotel</> : "Back to List"}
                        </Button>
                    </div>
                    {viewState.hotel !== 'list' ? <HotelForm initialData={editItem} onSuccess={() => { setViewState({...viewState, hotel: 'list'}); loadDashboardData(); }} /> : 
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{data.hotels?.map(hotel => (
                        <Card key={hotel._id} className="dark:bg-slate-900 border-slate-200 dark:border-slate-800"><CardContent className="p-4"><h3 className="text-lg font-bold dark:text-white">{hotel.name}</h3><div className="flex justify-end gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleEdit('hotel', hotel)}><Edit className="w-4 h-4"/></Button><Button size="sm" variant="destructive" onClick={() => confirmDelete('hotel', hotel._id)}><Trash2 className="w-4 h-4"/></Button></div></CardContent></Card>
                    ))}</div>}
                </TabsContent>

                {/* (Rooms and Users tabs same logic as Hotels) */}
                <TabsContent value="rooms">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">{viewState.room === 'list' ? 'Rooms' : (viewState.room === 'edit' ? 'Edit Room' : 'Add Room')}</h2>
                        <Button onClick={() => { setViewState({...viewState, room: viewState.room === 'list' ? 'create' : 'list'}); setEditItem(null); }}>{viewState.room === 'list' ? <><PlusCircle className="w-4 h-4 mr-2"/> Add Room</> : "Back to List"}</Button>
                    </div>
                    {viewState.room !== 'list' ? <RoomForm initialData={editItem} onSuccess={() => { setViewState({...viewState, room: 'list'}); loadDashboardData(); }} /> : 
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{data.rooms?.map(room => (
                        <Card key={room._id} className="dark:bg-slate-900 border-slate-200 dark:border-slate-800"><CardContent className="p-4"><h3 className="text-lg font-bold dark:text-white">{room.title}</h3><Badge>${room.price}</Badge><div className="flex justify-end gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => handleEdit('room', room)}><Edit className="w-4 h-4"/></Button><Button size="sm" variant="destructive" onClick={() => confirmDelete('room', room._id)}><Trash2 className="w-4 h-4"/></Button></div></CardContent></Card>
                    ))}</div>}
                </TabsContent>

                <TabsContent value="users">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">{viewState.user === 'list' ? 'Users' : 'Create User'}</h2>
                        <Button onClick={() => setViewState({...viewState, user: viewState.user === 'list' ? 'create' : 'list'})}>{viewState.user === 'list' ? <><PlusCircle className="w-4 h-4 mr-2"/> Create</> : "Back to List"}</Button>
                    </div>
                    {viewState.user === 'create' ? <UserForm onSuccess={() => { setViewState({...viewState, user: 'list'}); loadDashboardData(); }} /> : 
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"><tr><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">{data.users?.map(u => (<tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-6 py-4">{u.email}</td><td className="px-6 py-4">{u.role}</td><td className="px-6 py-4 text-right"><Button variant="ghost" size="icon" className="text-red-500" onClick={() => confirmDelete('user', u._id)}><Trash2 className="w-4 h-4" /></Button></td></tr>))}</tbody></table></div></Card>}
                </TabsContent>
            </Tabs>
        </div>

        {/* BOOKING MODAL */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader><DialogTitle>Booking Details</DialogTitle><DialogDescription>ID: {selectedBooking?._id}</DialogDescription></DialogHeader>
                {selectedBooking && <div className="space-y-4"><div><span className="font-bold">Total:</span> ${selectedBooking.totalAmount}</div></div>}
            </DialogContent>
        </Dialog>

        {/* DELETE ALERT */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <AlertDialogHeader><AlertDialogTitle>Confirm Delete</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAction} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <Card className="shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800"><CardContent className="flex items-center justify-between p-6"><div><p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p><h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3></div><div className={`p-3 rounded-full ${color}`}><Icon className="w-6 h-6" /></div></CardContent></Card>
);

export default AdminDashboard;