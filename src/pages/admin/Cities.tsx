import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import type { City } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

export default function Cities() {
  const { cities, addCity, updateCity, deleteCity } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: true,
  });

  const { toast } = useToast();

  const filteredCities = cities
    .filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCity) {
        let supabaseId = editingCity.supabase_id;
        
        if (editingCity.supabase_id) {
          // Update existing record in Supabase
          const { error } = await supabase
            .from('cities')
            .update({
              name: formData.name,
              status: formData.status,
            })
            .eq('id', editingCity.supabase_id);
          if (error) throw error;
        } else {
          // Try to find existing record in Supabase by name
          const { data: existingCity } = await supabase
            .from('cities')
            .select('id')
            .eq('name', editingCity.name)
            .single();
            
          if (existingCity) {
            // Update existing record
            const { error } = await supabase
              .from('cities')
              .update({
                name: formData.name,
                status: formData.status,
              })
              .eq('id', existingCity.id);
            if (error) throw error;
            supabaseId = existingCity.id;
          } else {
            // Create new record in Supabase
            const { data, error } = await supabase
              .from('cities')
              .insert([{
                name: formData.name,
                status: formData.status,
              }])
              .select()
              .single();
            if (error) throw error;
            supabaseId = data?.id;
          }
        }

        // Update local store with supabase_id
        updateCity(editingCity.id, { 
          ...formData, 
          supabase_id: supabaseId 
        });
        toast({
          title: "City Updated",
          description: "City information has been successfully updated.",
        });
      } else {
        // Add new city to Supabase and keep local demo data
        const { data, error } = await supabase
          .from('cities')
          .insert([{
            name: formData.name,
            status: formData.status,
          }])
          .select()
          .single();

        if (error) throw error;

        const newCity: City = {
          id: Date.now(), // local id for demo list
          supabase_id: data?.id,
          name: formData.name,
          status: formData.status,
          created_at: data?.created_at ? new Date(data.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };
        addCity(newCity);
        toast({
          title: "City Added",
          description: "New city has been successfully created.",
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving city:', error);
      toast({
        title: "Error",
        description: "Failed to save city. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: true,
    });
    setEditingCity(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      status: city.status,
    });
    setIsDialogOpen(true);
  };

const handleDelete = async (id: number) => {
  try {
    const city = cities.find(c => c.id === id);
    
    // Always try to delete from Supabase
    if (city?.supabase_id) {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', city.supabase_id);
      if (error) throw error;
    } else if (city) {
      // For demo data without supabase_id, try to find and delete by name
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('name', city.name);
      // Don't throw error if record doesn't exist in Supabase
    }

    // Delete locally
    deleteCity(id);
    toast({
      title: "City Deleted",
      description: "City has been successfully removed.",
      variant: "destructive",
    });
  } catch (error) {
    console.error('Error deleting city:', error);
    toast({
      title: "Error",
      description: "Failed to delete city. Please try again.",
      variant: "destructive",
    });
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cities Management</h1>
          <p className="text-muted-foreground">Manage cities and locations for companies</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCity(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCity ? "Edit City" : "Add New City"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">City Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter city name"
                  required
                />
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
                  {editingCity ? "Update" : "Create"} City
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
              <MapPin className="h-5 w-5" />
              All Cities ({filteredCities.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cities..."
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
                <TableHead>City Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.name}</TableCell>
                  <TableCell>
                    <Badge variant={city.status ? "default" : "destructive"}>
                      {city.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{city.created_at}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(city)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(city.id)}>
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