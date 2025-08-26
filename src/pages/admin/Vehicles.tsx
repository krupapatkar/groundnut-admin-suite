import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

export default function Vehicles() {

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    number: "",
    company_id: "",
    status: true,
  });

  const { toast } = useToast();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  // Load data from Supabase and setup real-time subscriptions
  useEffect(() => {
    loadSupabaseData();
    setupRealtimeSubscription();
  }, []);

  const loadSupabaseData = async () => {
    try {
      const [vehiclesResult, companiesResult] = await Promise.all([
        supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
        supabase.from('companies').select('*').order('name', { ascending: true })
      ]);
      
      if (vehiclesResult.data) {
        setVehicles(vehiclesResult.data);
      }
      if (companiesResult.data) {
        setCompanies(companiesResult.data);
      }
    } catch (error) {
      console.error('Error loading Supabase data:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('vehicles-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicles'
        },
         (payload) => {
           console.log('Real-time vehicle update:', payload);
           loadSupabaseData();
         }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.company_name && vehicle.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCompany = companies.find(company => company.id === formData.company_id);
    
    try {
      if (editingVehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update({
            number: formData.number,
            company_id: selectedCompany?.id || null,
            company_name: selectedCompany?.name || null,
            status: formData.status,
          })
          .eq('id', editingVehicle.id);

        if (error) throw error;
        
        toast({
          title: "Vehicle Updated",
          description: "Vehicle information has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('vehicles')
          .insert([{
            number: formData.number,
            company_id: selectedCompany?.id || null,
            company_name: selectedCompany?.name || null,
            status: formData.status,
          }]);

        if (error) throw error;
        
        toast({
          title: "Vehicle Added",
          description: "New vehicle has been successfully registered.",
        });
      }
    } catch (error) {
      console.error('Error handling vehicle:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the vehicle.",
        variant: "destructive",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      number: "",
      company_id: "",
      status: true,
    });
    setEditingVehicle(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    
    setFormData({
      number: vehicle.number,
      company_id: vehicle.company_id || "",
      status: vehicle.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (vehicle: any) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicle.id);

      if (error) throw error;

      toast({
        title: "Vehicle Deleted",
        description: "Vehicle has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the vehicle.",
        variant: "destructive",
      });
    }
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
                  value={formData.company_id || ""} 
                  onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
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
                  <TableCell>{vehicle.created_at?.split('T')[0] || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle)}>
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