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
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface City {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
}

export default function Cities() {
  const [cities, setCities] = useState<City[]>([
    {
      id: 1,
      name: "Chennai",
      status: true,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      name: "Bangalore",
      status: true,
      created_at: "2024-01-20",
    },
    {
      id: 3,
      name: "Mumbai",
      status: true,
      created_at: "2024-02-05",
    },
    {
      id: 4,
      name: "Delhi",
      status: false,
      created_at: "2024-02-10",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: true,
  });

  const { toast } = useToast();

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCity) {
      // Update existing city
      setCities(cities.map(city => 
        city.id === editingCity.id 
          ? { ...city, ...formData }
          : city
      ));
      toast({
        title: "City Updated",
        description: "City information has been successfully updated.",
      });
    } else {
      // Add new city
      const newCity: City = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
      };
      setCities([...cities, newCity]);
      toast({
        title: "City Added",
        description: "New city has been successfully created.",
      });
    }
    
    resetForm();
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

  const handleDelete = (id: number) => {
    setCities(cities.filter(city => city.id !== id));
    toast({
      title: "City Deleted",
      description: "City has been successfully removed.",
      variant: "destructive",
    });
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