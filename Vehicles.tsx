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
import { Plus, Search, Edit, Trash2, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: number;
  number: string;
  company_id: number | null;
  company_name?: string;
  status: boolean;
  created_at: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      number: "TN-01-AB-1234",
      company_id: 1,
      company_name: "ABC Trading Co.",
      status: true,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      number: "KA-05-XY-5678",
      company_id: 2,
      company_name: "XYZ Enterprises",
      status: true,
      created_at: "2024-02-10",
    },
    {
      id: 3,
      number: "MH-12-CD-9012",
      company_id: 3,
      company_name: "Global Groundnut Ltd",
      status: false,
      created_at: "2024-03-05",
    },
  ]);

  // Mock companies data
  const companies = [
    { id: 1, name: "ABC Trading Co." },
    { id: 2, name: "XYZ Enterprises" },
    { id: 3, name: "Global Groundnut Ltd" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    company_id: null as number | null,
    status: true,
  });

  const { toast } = useToast();

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.company_name && vehicle.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const companyName = companies.find(company => company.id === formData.company_id)?.name;
    
    if (editingVehicle) {
      // Update existing vehicle
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === editingVehicle.id 
          ? { ...vehicle, ...formData, company_name: companyName }
          : vehicle
      ));
      toast({
        title: "Vehicle Updated",
        description: "Vehicle information has been successfully updated.",
      });
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: Date.now(),
        ...formData,
        company_name: companyName,
        created_at: new Date().toISOString().split('T')[0],
      };
      setVehicles([...vehicles, newVehicle]);
      toast({
        title: "Vehicle Added",
        description: "New vehicle has been successfully registered.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      number: "",
      company_id: null,
      status: true,
    });
    setEditingVehicle(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      number: vehicle.number,
      company_id: vehicle.company_id,
      status: vehicle.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    toast({
      title: "Vehicle Deleted",
      description: "Vehicle has been successfully removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicles Management</h1>
          <p className="text-muted-foreground">Manage transportation vehicles for companies</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVehicle(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Vehicle Number</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., TN-01-AB-1234"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_id">Company</Label>
                <Select 
                  value={formData.company_id?.toString() || ""} 
                  onValueChange={(value) => setFormData({ ...formData, company_id: value ? Number(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {editingVehicle ? "Update" : "Register"} Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              All Vehicles ({filteredVehicles.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vehicles..."
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
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.number}</TableCell>
                  <TableCell>{vehicle.company_name || "Not assigned"}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status ? "default" : "destructive"}>
                      {vehicle.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.created_at}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle.id)}>
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