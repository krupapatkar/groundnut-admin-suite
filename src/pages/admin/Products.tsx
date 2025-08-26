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
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  company_id: string | null;
  company_name: string;
  vehicle_id: string | null;
  vehicle_number: string;
  slip_number: string;
  purchase_date: string;
  bag: number;
  price: number;
  weight: number;
  net_weight: number;
  total_price: number;
  final_price: number;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  name: string;
  location_id: string | null;
  location_name: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface Vehicle {
  id: string;
  number: string;
  company_id: string | null;
  company_name: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    company_id: null as string | null,
    vehicle_id: null as string | null,
    slip_number: "",
    purchase_date: "",
    bag: 0,
    price: 0,
    weight: 0,
    net_weight: 0,
    total_price: 0,
    final_price: 0,
  });

  const { toast } = useToast();

  // Fetch all data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products, companies, and vehicles in parallel
      const [productsResult, companiesResult, vehiclesResult] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('companies').select('*').order('name', { ascending: true }),
        supabase.from('vehicles').select('*').order('number', { ascending: true })
      ]);

      if (productsResult.error) {
        console.error('Error fetching products:', productsResult.error);
        toast({
          title: "Error",
          description: "Failed to load products from database.",
          variant: "destructive",
        });
      } else {
        setProducts(productsResult.data || []);
      }

      if (companiesResult.error) {
        console.error('Error fetching companies:', companiesResult.error);
        toast({
          title: "Error",
          description: "Failed to load companies from database.",
          variant: "destructive",
        });
      } else {
        setCompanies(companiesResult.data || []);
      }

      if (vehiclesResult.error) {
        console.error('Error fetching vehicles:', vehiclesResult.error);
        toast({
          title: "Error",
          description: "Failed to load vehicles from database.",
          variant: "destructive",
        });
      } else {
        setVehicles(vehiclesResult.data || []);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.slip_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(vehicle => 
    !formData.company_id || vehicle.company_id === formData.company_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCompany = companies.find(company => company.id === formData.company_id);
    const selectedVehicle = vehicles.find(vehicle => vehicle.id === formData.vehicle_id);
    
    if (!formData.company_id || !formData.vehicle_id || !selectedCompany || !selectedVehicle) {
      toast({
        title: "Missing Information",
        description: "Please select both company and vehicle before creating the product.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            company_id: formData.company_id,
            company_name: selectedCompany.name,
            vehicle_id: formData.vehicle_id,
            vehicle_number: selectedVehicle.number,
            slip_number: formData.slip_number,
            purchase_date: formData.purchase_date,
            bag: formData.bag,
            price: formData.price,
            weight: formData.weight,
            net_weight: formData.net_weight,
            total_price: formData.total_price,
            final_price: formData.final_price,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);

        if (error) {
          throw error;
        }

        // Update local state
        setProducts(prev => prev.map(product => 
          product.id === editingProduct.id 
            ? { 
                ...product, 
                company_id: formData.company_id,
                company_name: selectedCompany.name,
                vehicle_id: formData.vehicle_id,
                vehicle_number: selectedVehicle.number,
                slip_number: formData.slip_number,
                purchase_date: formData.purchase_date,
                bag: formData.bag,
                price: formData.price,
                weight: formData.weight,
                net_weight: formData.net_weight,
                total_price: formData.total_price,
                final_price: formData.final_price,
              }
            : product
        ));

        toast({
          title: "Product Updated",
          description: "Product information has been successfully updated.",
        });
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert({
            company_id: formData.company_id,
            company_name: selectedCompany.name,
            vehicle_id: formData.vehicle_id,
            vehicle_number: selectedVehicle.number,
            slip_number: formData.slip_number,
            purchase_date: formData.purchase_date,
            bag: formData.bag,
            price: formData.price,
            weight: formData.weight,
            net_weight: formData.net_weight,
            total_price: formData.total_price,
            final_price: formData.final_price,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Add to local state
        if (data) {
          setProducts(prev => [data as Product, ...prev]);
        }

        toast({
          title: "Product Added",
          description: "New product has been successfully created.",
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      company_id: null,
      vehicle_id: null,
      slip_number: "",
      purchase_date: "",
      bag: 0,
      price: 0,
      weight: 0,
      net_weight: 0,
      total_price: 0,
      final_price: 0,
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      company_id: product.company_id,
      vehicle_id: product.vehicle_id,
      slip_number: product.slip_number,
      purchase_date: product.purchase_date,
      bag: product.bag,
      price: product.price,
      weight: product.weight,
      net_weight: product.net_weight,
      total_price: product.total_price,
      final_price: product.final_price,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(prev => prev.filter(p => p.id !== product.id));

      toast({
        title: "Product Deleted",
        description: "Product has been successfully removed.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO Meta */}
      <header>
        <h1 className="sr-only">Products Management - Groundnut Trading System</h1>
      </header>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground">Manage groundnut product transactions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_id">Company</Label>
                  <Select 
                    value={formData.company_id || ""} 
                    onValueChange={(value) => setFormData({ ...formData, company_id: value, vehicle_id: null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
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

                <div className="space-y-2">
                  <Label htmlFor="vehicle_id">Vehicle</Label>
                  <Select 
                    value={formData.vehicle_id || ""} 
                    onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slip_number">Slip Number</Label>
                  <Input
                    id="slip_number"
                    value={formData.slip_number}
                    onChange={(e) => setFormData({ ...formData, slip_number: e.target.value })}
                    placeholder="Enter slip number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    required
                  />
                </div>
              </div>
    
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bag">Bags</Label>
                  <Input
                    id="bag"
                    type="number"
                    value={formData.bag}
                    onChange={(e) => setFormData({ ...formData, bag: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Bag</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Total Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="net_weight">Net Weight (kg)</Label>
                  <Input
                    id="net_weight"
                    type="number"
                    step="0.01"
                    value={formData.net_weight}
                    onChange={(e) => setFormData({ ...formData, net_weight: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_price">Total Price</Label>
                  <Input
                    id="total_price"
                    type="number"
                    step="0.01"
                    value={formData.total_price}
                    onChange={(e) => setFormData({ ...formData, total_price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="final_price">Final Price</Label>
                  <Input
                    id="final_price"
                    type="number"
                    step="0.01"
                    value={formData.final_price}
                    onChange={(e) => setFormData({ ...formData, final_price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update" : "Create"} Product
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
              <Package className="h-5 w-5" />
              All Products ({filteredProducts.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
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
                <TableHead>Slip Number</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Bags</TableHead>
                <TableHead>Net Weight</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.slip_number}</TableCell>
                  <TableCell>{product.company_name}</TableCell>
                  <TableCell>{product.vehicle_number}</TableCell>
                  <TableCell>{new Date(product.purchase_date).toISOString().split('T')[0]}</TableCell>
                  <TableCell>{product.bag}</TableCell>
                  <TableCell>{product.net_weight} kg</TableCell>
                  <TableCell>₹{product.final_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? "Loading products..." : "No products found. Create your first product to get started."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
