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
import { Plus, Search, Edit, Trash2, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  product_id: string | null;
  status: "pending" | "completed" | "cancelled";
  amount: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  slip_number: string;
  company_name: string;
  final_price: number;
  weight: number;
  net_weight: number;
  bag: number;
  price: number;
  total_price: number;
  vehicle_number: string;
  purchase_date: string;
  created_at: string;
  updated_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    product_id: null as string | null,
    status: "pending" as "pending" | "completed" | "cancelled",
    amount: 0,
  });

  const { toast } = useToast();

  // Fetch orders and products from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and products in parallel
      const [ordersResult, productsResult] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false })
      ]);

      if (ordersResult.error) {
        console.error('Error fetching orders:', ordersResult.error);
        toast({
          title: "Error",
          description: "Failed to load orders from database.",
          variant: "destructive",
        });
      } else {
        setOrders((ordersResult.data || []).map(order => ({
          ...order,
          status: order.status as "pending" | "completed" | "cancelled"
        })));
      }

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

  const filteredOrders = orders
    .filter(order => {
      const product = products.find(p => p.id === order.product_id);
      if (!product) return false;
      const companyName = product.company_name || "";
      return product.slip_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
             companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.status.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = products.find(p => p.id === formData.product_id);
    
    if (!formData.product_id || !selectedProduct) {
      toast({
        title: "Missing Information",
        description: "Please select a product for the order.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingOrder) {
        // Update order in Supabase
        const { error } = await supabase
          .from('orders')
          .update({
            status: formData.status,
            amount: formData.amount || selectedProduct.final_price,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingOrder.id);

        if (error) {
          throw error;
        }

        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === editingOrder.id 
            ? { ...order, status: formData.status, amount: formData.amount || selectedProduct.final_price }
            : order
        ));
        
        toast({
          title: "Order Updated",
          description: "Order has been successfully updated.",
        });
      } else {
        // Create new order in Supabase
        const { data, error } = await supabase
          .from('orders')
          .insert({
            product_id: formData.product_id,
            status: formData.status,
            amount: formData.amount || selectedProduct.final_price,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Add to local state
        if (data) {
          setOrders(prev => [data as Order, ...prev]);
        }
        
        toast({
          title: "Order Created",
          description: `New ${formData.status} order has been successfully created.`,
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      product_id: null,
      status: "pending",
      amount: 0,
    });
    setEditingOrder(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    const product = products.find(p => p.id === order.product_id);
    setFormData({
      product_id: order.product_id,
      status: order.status,
      amount: product?.final_price || order.amount,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (order: Order) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => prev.filter(o => o.id !== order.id));
      
      toast({
        title: "Order Deleted",
        description: "Order has been successfully deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      pending: "default",
      completed: "secondary", 
      cancelled: "destructive"
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* SEO Meta */}
      <header>
        <h1 className="sr-only">Orders Management - Groundnut Trading System</h1>
      </header>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Manage product orders and track their status</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOrder(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? "Edit Order" : "Create New Order"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_id">Product</Label>
                <Select 
                  value={formData.product_id || ""} 
                  onValueChange={(value) => {
                    const selectedProduct = products.find(p => p.id === value);
                    setFormData({ 
                      ...formData, 
                      product_id: value,
                      amount: selectedProduct?.final_price || 0
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.slip_number} - {product.company_name} (₹{product.final_price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "pending" | "completed" | "cancelled") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Order Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOrder ? "Update" : "Create"} Order
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
              <ShoppingCart className="h-5 w-5" />
              All Orders ({filteredOrders.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
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
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const product = products.find(p => p.id === order.product_id);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{product?.slip_number || "Unknown Product"}</TableCell>
                    <TableCell>{product?.company_name || "N/A"}</TableCell>
                    <TableCell>₹{(product?.final_price || order.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toISOString().split('T')[0]}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(order)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found. Create your first order to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}