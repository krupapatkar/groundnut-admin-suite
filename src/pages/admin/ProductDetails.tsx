import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Edit, Trash2, FileText, Package, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";

interface ProductDetail {
  id: string;
  product_id: string | null;
  product_slip?: string | null;
  bardan: number;
  kad: number;
  bag: number;
  bag_breakdown?: any; // JSON field from Supabase
  gross_weight: number;
  net_weight: number;
  created_at: string;
}

export default function ProductDetails() {
  const { products } = useData();
  
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<ProductDetail | null>(null);
  const [bagFields, setBagFields] = useState<number[]>([1]);
  const [formData, setFormData] = useState<{
    product_id: string | null;
    bardan: number;
    kad: number;
    manualTotalBags: number;
    totalBags: number;
    gross_weight: number;
    net_weight: number;
    [key: string]: number | null | string | undefined;
  }>({
    product_id: null,
    bardan: 1,
    kad: 1,
    bag1: 1,
    manualTotalBags: 1,
    totalBags: 1,
    gross_weight: 1,
    net_weight: 1,
  });

  const { toast } = useToast();

  // Fetch product details from Supabase
  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('product_details')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first
      
      if (error) throw error;
      
      setProductDetails((data || []).map(detail => ({
        ...detail,
        bag_breakdown: detail.bag_breakdown ? (detail.bag_breakdown as { [key: string]: number }) : undefined
      })));
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
    }
  };

  // Calculate total bags whenever bag fields change
  useEffect(() => {
    const total = bagFields.reduce((sum, fieldNum) => {
      const bagKey = `bag${fieldNum}`;
      return sum + (formData[bagKey] as number || 0);
    }, 0);
    setFormData(prev => ({ ...prev, totalBags: total }));
  }, [bagFields, ...bagFields.map(fieldNum => formData[`bag${fieldNum}`])]);

  const filteredDetails = productDetails.filter(detail =>
    (detail.product_slip && detail.product_slip.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addBagField = () => {
    const nextFieldNum = bagFields.length + 1;
    if (nextFieldNum <= 10) { // Limit to 10 bag fields
      setBagFields([...bagFields, nextFieldNum]);
      setFormData(prev => ({ ...prev, [`bag${nextFieldNum}`]: 0 }));
    }
  };

  const removeBagField = (fieldNum: number) => {
    if (bagFields.length > 1) {
      const newFormData = { ...formData };
      
      // Remove the target bag field
      delete newFormData[`bag${fieldNum}` as keyof typeof newFormData];
      
      // Shift all subsequent bags down (reindex)
      for (let i = fieldNum + 1; i <= bagFields.length; i++) {
        const currentValue = newFormData[`bag${i}` as keyof typeof newFormData] as number;
        if (currentValue !== undefined) {
          newFormData[`bag${i-1}` as keyof typeof newFormData] = currentValue;
          delete newFormData[`bag${i}` as keyof typeof newFormData];
        }
      }
      
      // Update bagFields to be sequential from 1 to new length
      const newLength = bagFields.length - 1;
      setBagFields(Array.from({ length: newLength }, (_, i) => i + 1));
      setFormData(newFormData);
    }
  };

  const updateBagValue = (fieldNum: number, value: number) => {
    setFormData(prev => ({ ...prev, [`bag${fieldNum}`]: value }));
  };

  const isFormValid = formData.product_id && formData.manualTotalBags > 0 && formData.manualTotalBags === formData.totalBags;

  const handleSubmit = async () => {
    if (!formData.product_id) {
      toast({
        title: "Missing Product",
        description: "Please select a product before saving.",
        variant: "destructive",
      });
      return;
    }

    if (formData.manualTotalBags !== formData.totalBags) {
      toast({
        title: "Invalid Form",
        description: "Manual total bags must match the calculated total bags.",
        variant: "destructive",
      });
      return;
    }

    if (formData.manualTotalBags <= 0) {
      toast({
        title: "Invalid Bags",
        description: "Total bags must be greater than 0.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedProduct = products.find(product => product.id.toString() === formData.product_id);
    if (!selectedProduct) {
      toast({
        title: "Product Not Found",
        description: "Selected product could not be found.",
        variant: "destructive",
      });
      return;
    }
    
    const productSlip = selectedProduct.slip_number;
    
    // Convert formData to ProductDetail format (sum all bag values)
    const totalBagValue = bagFields.reduce((sum, fieldNum) => {
      const bagKey = `bag${fieldNum}`;
      return sum + (formData[bagKey] as number || 0);
    }, 0);
    
    // Create bag_breakdown object to preserve individual bag values
    const bagBreakdown: { [key: string]: number } = {};
    bagFields.forEach(fieldNum => {
      const bagKey = `bag${fieldNum}`;
      const bagValue = formData[bagKey] as number || 0;
      if (bagValue > 0) { // Only include bags with positive values
        bagBreakdown[bagKey] = bagValue;
      }
    });
    
    console.log('Submitting product detail:', {
      product_id: formData.product_id,
      product_slip: productSlip,
      bardan: formData.bardan,
      kad: formData.kad,
      bag: totalBagValue,
      bag_breakdown: bagBreakdown,
      gross_weight: formData.gross_weight,
      net_weight: formData.net_weight,
    });
    
    try {
      if (editingDetail) {
        console.log('Updating existing detail:', editingDetail.id);
        // Update existing product detail
        const { error } = await supabase
          .from('product_details')
          .update({
            product_id: formData.product_id,
            product_slip: productSlip,
            bardan: formData.bardan,
            kad: formData.kad,
            bag: totalBagValue,
            bag_breakdown: bagBreakdown,
            gross_weight: formData.gross_weight,
            net_weight: formData.net_weight,
          })
          .eq('id', editingDetail.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Update successful');
        toast({
          title: "Product Detail Updated",
          description: "Product detail has been successfully updated.",
        });
      } else {
        console.log('Creating new detail');
        // Add new product detail
        const { error } = await supabase
          .from('product_details')
          .insert({
            product_id: formData.product_id,
            product_slip: productSlip,
            bardan: formData.bardan,
            kad: formData.kad,
            bag: totalBagValue,
            bag_breakdown: bagBreakdown,
            gross_weight: formData.gross_weight,
            net_weight: formData.net_weight,
          });
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Insert successful');
        toast({
          title: "Product Detail Added",
          description: "New product detail has been successfully created.",
        });
      }
      
      // Refresh the data
      await fetchProductDetails();
      resetForm();
    } catch (error: any) {
      console.error('Error saving product detail:', error);
      let errorMessage = "Failed to save product detail";
      
      if (error?.message) {
        errorMessage = `${errorMessage}: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setBagFields([1]);
    setFormData({
      product_id: null,
      bardan: 1,
      kad: 1,
      bag1: 1,
      manualTotalBags: 1,
      totalBags: 1,
      gross_weight: 1,
      net_weight: 1,
    });
    setEditingDetail(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (detail: ProductDetail) => {
    setEditingDetail(detail);
    
    // If bag_breakdown exists, reconstruct the original bag fields
    if (detail.bag_breakdown && Object.keys(detail.bag_breakdown).length > 0) {
      const bagKeys = Object.keys(detail.bag_breakdown)
        .filter(key => key.startsWith('bag'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('bag', ''));
          const numB = parseInt(b.replace('bag', ''));
          return numA - numB;
        });
      
      const reconstructedBagFields = bagKeys.map(key => parseInt(key.replace('bag', '')));
      setBagFields(reconstructedBagFields);
      
      // Build form data with original bag values
      const newFormData: typeof formData = {
        product_id: detail.product_id,
        bardan: detail.bardan,
        kad: detail.kad,
        manualTotalBags: detail.bag,
        totalBags: detail.bag,
        gross_weight: detail.gross_weight,
        net_weight: detail.net_weight,
      };
      
      // Add individual bag values
      bagKeys.forEach(key => {
        const bagBreakdown = detail.bag_breakdown as { [key: string]: number };
        newFormData[key] = bagBreakdown[key];
      });
      
      setFormData(newFormData);
    } else {
      // Fallback for old data without bag_breakdown
      setBagFields([1]);
      setFormData({
        product_id: detail.product_id,
        bardan: detail.bardan,
        kad: detail.kad,
        bag1: detail.bag,
        manualTotalBags: detail.bag,
        totalBags: detail.bag,
        gross_weight: detail.gross_weight,
        net_weight: detail.net_weight,
      });
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_details')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Product Detail Deleted",
        description: "Product detail has been successfully removed.",
        variant: "destructive",
      });
      
      // Refresh the data
      await fetchProductDetails();
    } catch (error) {
      console.error('Error deleting product detail:', error);
      toast({
        title: "Error",
        description: "Failed to delete product detail",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Details Management</h1>
          <p className="text-muted-foreground">Manage detailed measurements and specifications</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingDetail(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Detail
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[80vh] border-2 border-blue-500 bg-white dark:bg-white">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-black text-left text-base font-bold mb-2">
                {editingDetail ? "Edit Product Detail" : "Add New Product Details"}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-8 px-4">
                {/* Product Selection */}
                <div className="space-y-3">
                  <Label htmlFor="product_id" className="text-sm font-medium text-gray-600">Product</Label>
                    <Select 
                      value={formData.product_id || ""} 
                      onValueChange={(value) => setFormData({ ...formData, product_id: value || null })}
                    >
                    <SelectTrigger className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 px-0 pb-2">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.slip_number} - {product.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bardan and Kad */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="bardan" className="text-sm font-medium text-gray-600">Bardan</Label>
                    <Input
                      id="bardan"
                      type="number"
                      step="0.01"
                      value={formData.bardan}
                      onChange={(e) => setFormData({ ...formData, bardan: Number(e.target.value) })}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 px-0 pb-2"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="kad" className="text-sm font-medium text-gray-600">Kad</Label>
                    <Input
                      id="kad"
                      type="number"
                      step="0.01"
                      value={formData.kad}
                      onChange={(e) => setFormData({ ...formData, kad: Number(e.target.value) })}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 px-0 pb-2"
                    />
                  </div>
                </div>

                {/* Total Bags (Manual) */}
                <div className="space-y-3">
                  <Label htmlFor="manualTotalBags" className="text-sm font-medium text-gray-600">Total Bags (Manual)</Label>
                  <Input
                    id="manualTotalBags"
                    type="number"
                    value={formData.manualTotalBags}
                    onChange={(e) => setFormData({ ...formData, manualTotalBags: Number(e.target.value) })}
                    className={`w-full border-0 border-b-2 rounded-none bg-transparent focus:ring-0 px-0 pb-2 transition-all duration-200 ${
                      formData.manualTotalBags !== formData.totalBags 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                </div>

                {/* Dynamic Bag Fields */}
                <div className="space-y-6">
                  {bagFields.map((fieldNum) => (
                    <div key={fieldNum} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`bag${fieldNum}`} className="text-sm font-medium text-gray-600">
                          Bag {fieldNum}
                        </Label>
                        {bagFields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive"
                            size="sm" 
                            onClick={() => removeBagField(fieldNum)}
                            className="h-8 px-3 text-xs"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        id={`bag${fieldNum}`}
                        type="number"
                        value={formData[`bag${fieldNum}`] as number || 0}
                        onChange={(e) => updateBagValue(fieldNum, Number(e.target.value))}
                        className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 px-0 pb-2"
                      />
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="default" 
                    size="sm" 
                    onClick={addBagField}
                    className="w-full rounded-full bg-gray-200 text-black hover:bg-gray-300 border-0"
                    disabled={bagFields.length >= 10}
                  >
                    Add Bags
                  </Button>
                </div>

                {/* Total Bags Display */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-600">Total Bags</Label>
                  <div className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                    <div className="text-sm text-gray-700 font-medium">
                      {formData.totalBags}
                    </div>
                    {formData.manualTotalBags > 0 && formData.manualTotalBags !== formData.totalBags && (
                      <div className="text-xs text-red-500 mt-1">
                        ⚠ Manual total ({formData.manualTotalBags}) doesn't match calculated total ({formData.totalBags})
                      </div>
                    )}
                  </div>
                </div>

                {/* Gross Weight and Net Weight */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="gross_weight" className="text-sm font-medium text-gray-600">Gross Weight</Label>
                    <Input
                      id="gross_weight"
                      type="number"
                      step="0.01"
                      value={formData.gross_weight}
                      onChange={(e) => setFormData({ ...formData, gross_weight: Number(e.target.value) })}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 px-0 pb-2"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="net_weight" className="text-sm font-medium text-gray-600">Net Weight</Label>
                    <Input
                      id="net_weight"
                      type="number"
                      step="0.01"
                      value={formData.net_weight}
                      onChange={(e) => setFormData({ ...formData, net_weight: Number(e.target.value) })}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent focus:border-blue-500 focus:ring-0 px-0 pb-2"
                    />
                  </div>
                </div>

              </div>
            </ScrollArea>
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="button" disabled={!isFormValid} onClick={handleSubmit}>
                {editingDetail ? "Update" : "Create"} Detail
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Product Details ({filteredDetails.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by slip number..."
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
                <TableHead>Product Slip</TableHead>
                <TableHead>Bardan</TableHead>
                <TableHead>Kad</TableHead>
                <TableHead>Bags</TableHead>
                <TableHead>Gross Weight</TableHead>
                <TableHead>Net Weight</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetails.length > 0 ? (
                filteredDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-medium">{detail.product_slip}</TableCell>
                    <TableCell>{detail.bardan}</TableCell>
                    <TableCell>{detail.kad}</TableCell>
                    <TableCell>{detail.bag}</TableCell>
                    <TableCell>{detail.gross_weight} kg</TableCell>
                    <TableCell>{detail.net_weight} kg</TableCell>
                    <TableCell>{new Date(detail.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(detail)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(detail.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm 
                      ? `No product details found matching "${searchTerm}"` 
                      : "No product details found. Create your first product detail to get started."
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
