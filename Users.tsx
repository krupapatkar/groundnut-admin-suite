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

interface User {
  id: number;
  user_name: string;
  email_address: string;
  type: "ADMIN" | "USER";
  mobile_number: string;
  country_code: string;
  status: boolean;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      user_name: "Admin User",
      email_address: "admin@groundnut.com",
      type: "ADMIN",
      mobile_number: "9876543210",
      country_code: "+91",
      status: true,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      user_name: "John Trader",
      email_address: "john@trader.com",
      type: "USER",
      mobile_number: "9876543211",
      country_code: "+91",
      status: true,
      created_at: "2024-02-10",
    },
    {
      id: 3,
      user_name: "Sarah Manager",
      email_address: "sarah@manager.com",
      type: "USER",
      mobile_number: "9876543212",
      country_code: "+91",
      status: false,
      created_at: "2024-03-05",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    user_name: "",
    email_address: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: "New user has been successfully created.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      user_name: "",
      email_address: "",
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
      type: user.type,
      mobile_number: user.mobile_number,
      country_code: user.country_code,
      status: user.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been successfully removed.",
      variant: "destructive",
    });
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