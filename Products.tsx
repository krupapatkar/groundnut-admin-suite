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
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  company_id: number | null;
  company_name?: string;
  vehicle_id: number | null;
  vehicle_number?: string;
  slip_number: string;
  purchase_date: string;
  bag: number;
  price: number;
  weight: number;
  net_weight: number;
  total_price: number;
  final_price: number;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      company_id: 1,
      company_name: "ABC Trading Co.",
      vehicle_id: 1,
      vehicle_number: "TN-01-AB-1234",
      slip_number: "SL001",
      purchase_date: "2024-01-15",
      bag: 100,
      price: 50.00,
      weight: 5000.00,
      net_weight: 4950.00,
      total_price: 247500.00,
      final_price: 260000.00,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      company_id: 2,
      company_name: "XYZ Enterprises",
      vehicle_id: 2,
      vehicle_number: "KA-05-XY-5678",
      slip_number: "SL002",
      purchase_date: "2024-02-10",
      bag: 75,
      price: 52.00,
      weight: 3750.00,
      net_weight: 3720.00,
      total_price: 193440.00,
      final_price: 205000.00,
      created_at: "2024-02-10",
    },
  ]);

  // Mock data for dropdowns
  const companies = [
    { id: 1, name: "ABC Trading Co." },
    { id: 2, name: "XYZ Enterprises" },
    { id: 3, name: "Global Groundnut Ltd" },
  ];

  const vehicles = [
    { id: 1, number: "TN-01-AB-1234", company_id: 1 },
    { id: 2, number: "KA-05-XY-5678", company_id: 2 },
    { id: 3, number: "MH-12-CD-9012", company_id: 3 },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    company_id: null as number | null,
    vehicle_id: null as number | null,
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

  const filteredProducts = products.filter(product =>
    product.slip_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.company_name && product.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVehicles = vehicles.filter(vehicle => 
    !formData.company_id || vehicle.company_id === formData.company_id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const companyName = companies.find(company => company.id === formData.company_id)?.name;
    const vehicleNumber = vehicles.find(vehicle => vehicle.id === formData.vehicle_id)?.number;
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...formData, company_name: companyName, vehicle_number: vehicleNumber }
          : product
      ));
      toast({
        title: "Product Updated",
        description: "Product information has been successfully updated.",
      });
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
        company_name: companyName,
        vehicle_number: vehicleNumber,
        created_at: new Date().toISOString().split('T')[0],
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Product Added",
        description: "New product has been successfully created.",
      });
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

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "Product has been successfully removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
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
                    value={formData.company_id?.toString() || ""} 
                    onValueChange={(value) => setFormData({ ...formData, company_id: value ? Number(value) : null, vehicle_id: null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
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

                <div className="space-y-2">
                  <Label htmlFor="vehicle_id">Vehicle</Label>
                  <Select 
                    value={formData.vehicle_id?.toString() || ""} 
                    onValueChange={(value) => setFormData({ ...formData, vehicle_id: value ? Number(value) : null })}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
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
                  <TableCell>{product.purchase_date}</TableCell>
                  <TableCell>{product.bag}</TableCell>
                  <TableCell>{product.net_weight} kg</TableCell>
                  <TableCell>₹{product.final_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
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
