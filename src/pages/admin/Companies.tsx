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
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Companies() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    location_id: "",
    status: true,
  });

  const { toast } = useToast();

  const [companies, setCompanies] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Load data from Supabase and setup real-time subscriptions
  useEffect(() => {
    loadSupabaseData();
    const cleanup = setupRealtimeSubscription();
    return cleanup; // Cleanup subscription on unmount
  }, []);

  const loadSupabaseData = async () => {
    try {
      const [companiesResult, citiesResult] = await Promise.all([
        supabase.from('companies').select('*').order('created_at', { ascending: false }),
        supabase.from('cities').select('*').order('name', { ascending: true })
      ]);
      
      if (companiesResult.data) {
        setCompanies(companiesResult.data);
      }
      if (citiesResult.data) {
        setCities(citiesResult.data);
      }
    } catch (error) {
      console.error('Error loading Supabase data:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('companies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Use a timeout to debounce multiple rapid changes
          setTimeout(() => {
            loadSupabaseData();
          }, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.location_name && company.location_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCity = cities.find(city => city.id === formData.location_id);
    
    try {
      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: formData.name,
            location_id: selectedCity?.id || null,
            location_name: selectedCity?.name || null,
            status: formData.status,
          })
          .eq('id', editingCompany.id);

        if (error) throw error;
        
        toast({
          title: "Company Updated",
          description: "Company information has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('companies')
          .insert([{
            name: formData.name,
            location_id: selectedCity?.id || null,
            location_name: selectedCity?.name || null,
            status: formData.status,
          }]);

        if (error) throw error;
        
        toast({
          title: "Company Added",
          description: "New company has been successfully created.",
        });
      }
    } catch (error) {
      console.error('Error handling company:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the company.",
        variant: "destructive",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location_id: "",
      status: true,
    });
    setEditingCompany(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    
    setFormData({
      name: company.name,
      location_id: company.location_id || "",
      status: company.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (company: any) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id);

      if (error) {
        if (error.code === '23503') {
          toast({
            title: "Cannot Delete Company",
            description: "This company has associated vehicles. Please remove all vehicles first.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Company Deleted",
        description: "Company has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the company.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies Management</h1>
          <p className="text-muted-foreground">Manage trading companies and partners</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCompany(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? "Edit Company" : "Add New Company"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_id">Location</Label>
                <Select 
                  value={formData.location_id || ""} 
                  onValueChange={(value) => setFormData({ ...formData, location_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
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
                  {editingCompany ? "Update" : "Create"} Company
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
              <Building2 className="h-5 w-5" />
              All Companies ({filteredCompanies.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
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
                <TableHead>Company Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.location_name || "Not set"}</TableCell>
                  <TableCell>
                    <Badge variant={company.status ? "default" : "destructive"}>
                      {company.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.created_at?.split('T')[0] || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(company)}>
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