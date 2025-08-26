import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/data";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

export default function Users() {
  const { users, addUser, updateUser, deleteUser } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    user_name: "",
    email_address: "",
    password: "",
    type: "USER" as "ADMIN" | "USER",
    mobile_number: "",
    country_code: "+91",
    status: true,
  });

  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        let supabaseId = editingUser.supabase_id;
        
        if (editingUser.supabase_id) {
          // Update existing record in Supabase
          const updatePayload: any = {
            user_name: formData.user_name,
            email_address: formData.email_address,
            type: formData.type,
            mobile_number: formData.mobile_number,
            country_code: formData.country_code,
            status: formData.status,
          };
          if (formData.password && formData.password.trim() !== "") {
            updatePayload.password = await bcrypt.hash(formData.password, 10);
          }
          const { error } = await supabase
            .from('users')
            .update(updatePayload)
            .eq('id', editingUser.supabase_id);
          if (error) throw error;
        } else {
          // Try to find existing record in Supabase by email or name
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .or(`email_address.eq.${editingUser.email_address},user_name.eq.${editingUser.user_name}`)
            .single();
            
          if (existingUser) {
            // Update existing record
            const updatePayload2: any = {
              user_name: formData.user_name,
              email_address: formData.email_address,
              type: formData.type,
              mobile_number: formData.mobile_number,
              country_code: formData.country_code,
              status: formData.status,
            };
            if (formData.password && formData.password.trim() !== "") {
              updatePayload2.password = await bcrypt.hash(formData.password, 10);
            }
            const { error } = await supabase
              .from('users')
              .update(updatePayload2)
              .eq('id', existingUser.id);
            if (error) throw error;
            supabaseId = existingUser.id;
          } else {
            // Create new record in Supabase
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            const { data, error } = await supabase
              .from('users')
              .insert([{
                user_name: formData.user_name,
                email_address: formData.email_address,
                password: hashedPassword,
                type: formData.type,
                mobile_number: formData.mobile_number,
                country_code: formData.country_code,
                status: formData.status,
              }])
              .select()
              .single();
            if (error) throw error;
            supabaseId = data?.id;
          }
        }

        // Update local store with supabase_id
        updateUser(editingUser.id, { 
          ...formData, 
          supabase_id: supabaseId 
        });
        toast({
          title: "User Updated",
          description: "User information has been successfully updated.",
        });
      } else {
        // Add new user to Supabase and keep local demo data
        const hashedPassword = await bcrypt.hash(formData.password, 10);
        const { data, error } = await supabase
          .from('users')
          .insert([{
            user_name: formData.user_name,
            email_address: formData.email_address,
            password: hashedPassword,
            type: formData.type,
            mobile_number: formData.mobile_number,
            country_code: formData.country_code,
            status: formData.status,
          }])
          .select()
          .single();

        if (error) throw error;

        const newUser: User = {
          id: Date.now(), // local id for demo list
          supabase_id: data?.id, // map to Supabase row
          ...formData,
          created_at: data?.created_at ? new Date(data.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };
        addUser(newUser);
        toast({
          title: "User Added",
          description: "New user has been successfully created.",
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      user_name: "",
      email_address: "",
      password: "",
      type: "USER",
      mobile_number: "",
      country_code: "+91",
      status: true,
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      user_name: user.user_name,
      email_address: user.email_address,
      password: "",
      type: user.type,
      mobile_number: user.mobile_number,
      country_code: user.country_code,
      status: user.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const user = users.find(u => u.id === id);
      
      // Always try to delete from Supabase
      if (user?.supabase_id) {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', user.supabase_id);
        if (error) throw error;
      } else if (user) {
        // For demo data without supabase_id, try to find and delete by email
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('email_address', user.email_address);
        // Don't throw error if record doesn't exist in Supabase
      }

      // Delete locally
      deleteUser(id);
      toast({
        title: "User Deleted",
        description: "User has been successfully removed.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">Manage system users and administrators</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">User Name</Label>
                <Input
                  id="user_name"
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_address">Email Address</Label>
                <Input
                  id="email_address"
                  type="email"
                  value={formData.email_address}
                  onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={editingUser ? "Leave blank to keep current password" : "Set user password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="type">User Type</Label>
                <Select value={formData.type} onValueChange={(value: "ADMIN" | "USER") => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="country_code">Code</Label>
                  <Input
                    id="country_code"
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="mobile_number">Mobile Number</Label>
                  <Input
                    id="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="status">Active Status</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? "Update" : "Create"} User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.user_name}</TableCell>
                  <TableCell>{user.email_address}</TableCell>
                  <TableCell>
                    <Badge variant={user.type === "ADMIN" ? "default" : "secondary"}>
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.country_code} {user.mobile_number}</TableCell>
                  <TableCell>
                    <Badge variant={user.status ? "default" : "destructive"}>
                      {user.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
