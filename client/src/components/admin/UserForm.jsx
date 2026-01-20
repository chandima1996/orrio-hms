import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { createUser } from "@/services/api"; // Add this to api.js

const UserForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", role: "user", password: "" // Password optional if clerk used directly
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await createUser(formData);
        alert("User Created!");
        onSuccess();
        setFormData({ firstName: "", lastName: "", email: "", role: "user", password: "" });
    } catch (err) {
        alert("Failed to create user");
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
       <h2 className="mb-4 text-xl font-bold dark:text-white">Create New User</h2>
       <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2"><Label>First Name</Label><Input value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})} className="dark:bg-slate-800"/></div>
             <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={e=>setFormData({...formData, lastName:e.target.value})} className="dark:bg-slate-800"/></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="dark:bg-slate-800"/></div>
          <div className="space-y-2">
             <Label>Role</Label>
             <Select value={formData.role} onValueChange={(val)=>setFormData({...formData, role:val})}>
                <SelectTrigger className="dark:bg-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="user">User</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
             </Select>
          </div>
          <Button type="submit" className="w-full">Create User</Button>
       </form>
    </Card>
  );
};
export default UserForm;