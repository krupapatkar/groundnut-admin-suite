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
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: number;
  name: string;
  location_id: number | null;
  location_name?: string;
  status: boolean;
  created_at: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: "ABC Trading Co.",
      location_id: 1,
      location_name: "Chennai",
      status: true,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      name: "XYZ Enterprises",
      location_id: 2,
      location_name: "Bangalore",
      status: true,
      created_at: "2024-02-10",
    },
    {
      id: 3,
      name: "Global Groundnut Ltd",
      location_id: 1,
      location_name: "Chennai",
      status: false,
      created_at: "2024-03-05",
    },
  ]);

  // Mock cities data
  const cities = [
    { id: 1, name: "Chennai" },
    { id: 2, name: "Bangalore" },
    { id: 3, name: "Mumbai" },
    { id: 4, name: "Delhi" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location_id: null as number | null,
    status: true,
  });

  const { toast } = useToast();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.location_name && company.location_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const locationName = cities.find(city => city.id === formData.location_id)?.name;
    
    if (editingCompany) {
      // Update existing company
      setCompanies(companies.map(company => 
        company.id === editingCompany.id 
          ? { ...company, ...formData, location_name: locationName }
          : company
      ));
      toast({
        title: "Company Updated",
        description: "Company information has been successfully updated.",
      });
    } else {
      // Add new company
      const newCompany: Company = {
        id: Date.now(),
        ...formData,
        location_name: locationName,
        created_at: new Date().toISOString().split('T')[0],
      };
      setCompanies([...companies, newCompany]);
      toast({
        title: "Company Added",
        description: "New company has been successfully created.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location_id: null,
      status: true,
    });
    setEditingCompany(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      location_id: company.location_id,
      status: company.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Company Deleted",
      description: "Company has been successfully removed.",
      variant: "destructive",
    });
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
                  value={formData.location_id?.toString() || ""} 
                  onValueChange={(value) => setFormData({ ...formData, location_id: value ? Number(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
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
                  <TableCell>{company.created_at}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(company.id)}>
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