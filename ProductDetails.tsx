import { useState } from "react";
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
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetail {
  id: number;
  product_id: number | null;
  product_slip?: string;
  bardan: number;
  kad: number;
  bag: number;
  gross_weight: number;
  net_weight: number;
  created_at: string;
}

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([
    {
      id: 1,
      product_id: 1,
      product_slip: "SL001",
      bardan: 2.5,
      kad: 1.8,
      bag: 50,
      gross_weight: 2500.0,
      net_weight: 2450.0,
      created_at: "2024-01-15",
    },
    {
      id: 2,
      product_id: 1,
      product_slip: "SL001",
      bardan: 2.3,
      kad: 1.9,
      bag: 50,
      gross_weight: 2500.0,
      net_weight: 2460.0,
      created_at: "2024-01-15",
    },
    {
      id: 3,
      product_id: 2,
      product_slip: "SL002",
      bardan: 2.4,
      kad: 1.7,
      bag: 75,
      gross_weight: 3750.0,
      net_weight: 3720.0,
      created_at: "2024-02-10",
    },
    {
      id: 4,
      product_id: 2,
      product_slip: "SL002",
      bardan: 10,
      kad: 10,
      bag: 200,
      manualTotalBags: 200,
      bag1: 100,
      bag2: 100,
      totalBagsAuto: 200,
      gross_weight: 10,
      net_weight: 10,
      created_at: "2025-08-12",
    },
  ]);

  const products = [
    { id: 1, slip_number: "SL001", company_name: "ABC Trading Co." },
    { id: 2, slip_number: "SL002", company_name: "XYZ Enterprises" },
    { id: 3, slip_number: "SL003", company_name: "Global Groundnut Ltd" },
  ];

  const [formData, setFormData] = useState({
    product_id: null,
    bardan: 1,
    kad: 1,
    bag1: 1,
    gross_weight: 1,
    net_weight: 1,
    manualTotalBags: 1,
    totalBags: 1,
  });

  const [bagFields, setBagFields] = useState<number[]>([1]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<ProductDetail | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      product_id: null,
      bardan: 0,
      kad: 0,
      bag1: 0,
      gross_weight: 0,
      net_weight: 0,
      manualTotalBags: 0,
      totalBags: 0,
    });
    setBagFields([1]);
    setEditingDetail(null);
    setIsDialogOpen(false);
  };

  const handleAddBag = () => {
    setBagFields([...bagFields, bagFields.length + 1]);
  };

  const handleRemoveBag = (index: number) => {
    const updatedBagFields = [...bagFields];
    updatedBagFields.splice(index, 1);
    const updatedFormData: any = { ...formData };
    
    updatedBagFields.forEach((oldBagNum, newIndex) => {
      const oldKey = `bag${oldBagNum}`;
      const newKey = `bag${newIndex + 1}`;
      updatedFormData[newKey] = formData[oldKey] || 0;
    });
    
    for (let i = updatedBagFields.length + 1; i <= bagFields.length; i++) {
      delete updatedFormData[`bag${i}`];
    }
    
    const total = updatedBagFields.reduce((sum, _, i) => {
      const key = `bag${i + 1}`;
      return sum + Number(updatedFormData[key] || 0);
    }, 0);
    
    setBagFields(updatedBagFields.map((_, i) => i + 1));
    setFormData({
      ...updatedFormData,
      totalBags: total,
    });
  };

  const updateBagValue = (bagKey: string, value: number) => {
    const updatedForm = { ...formData, [bagKey]: value };
    const total = bagFields.reduce(
      (sum, num) => sum + Number(updatedForm[`bag${num}`] ?? 0),
      0
    );
    setFormData({
      ...updatedForm,
      totalBags: total,
    });
  };

  const updateTotalBags = (overrideForm = null) => {
    const source = overrideForm ?? formData;
    const total = bagFields.reduce((sum, f) => sum + Number(source[`bag${f}`] ?? 0), 0);
    setFormData((prev) => ({ ...prev, totalBags: total }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bagData: Record<string, number> = {};
    bagFields.forEach((num) => {
      const val = Number((formData as any)[`bag${num}`]) || 0;
      if (val > 0) bagData[`bag${num}`] = val;
    });
    
    const totalBagsAuto = Object.values(bagData).reduce((s, v) => s + v, 0);
    const totalBags = formData.manualTotalBags || totalBagsAuto;
    
    const baseData = {
      id: editingDetail ? editingDetail.id : Date.now(),
      product_id: formData.product_id,
      bardan: formData.bardan,
      kad: formData.kad,
      bag: totalBags,
      gross_weight: formData.gross_weight,
      net_weight: formData.net_weight,
      created_at: editingDetail
        ? editingDetail.created_at
        : new Date().toISOString().split("T")[0],
      product_slip:
        products.find((p) => p.id === formData.product_id)?.slip_number || "",
      manualTotalBags: formData.manualTotalBags,
      totalBags,
    };
    
    const saveData = { ...baseData, ...bagData };
    
    if (editingDetail) {
      setProductDetails((prev) =>
        prev.map((d) => (d.id === editingDetail.id ? saveData : d))
      );
      toast({ title: "Product Detail Updated", description: "Updated successfully." });
    } else {
      setProductDetails((prev) => [...prev, saveData]);
      toast({ title: "Product Detail Added", description: "Added successfully." });
    }
    resetForm();
  };

  const handleEdit = (row: any) => {
    const dynamicBags: Record<string, number> = {};
    Object.keys(row).forEach((k) => {
      if (k.startsWith("bag")) {
        const idx = Number(k.slice(3));
        const v = Number(row[k]) || 0;
        if (idx >= 1 && v > 0) {
          dynamicBags[`bag${idx}`] = v;
        }
      }
    });
    
    const bagNums = Object.keys(dynamicBags)
      .map((k) => Number(k.slice(3)))
      .sort((a, b) => a - b);
      
    const totalBagsAuto = bagNums.reduce(
      (sum, n) => sum + (dynamicBags[`bag${n}`] || 0),
      0
    );
    
    setFormData({
      ...row,
      ...dynamicBags,
      manualTotalBags:
        typeof row.manualTotalBags === "number"
          ? row.manualTotalBags
          : totalBagsAuto,
      totalBags: totalBagsAuto,
    });
    
    setBagFields(bagNums.length ? bagNums : [1]);
    setEditingDetail(row);
    setIsDialogOpen(true);
  };

  const filteredDetails = productDetails.filter((detail) =>
    detail.product_slip?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setProductDetails((prev) => prev.filter((detail) => detail.id !== id));
    if (editingDetail?.id === id) {
      resetForm();
    }
    toast({
      title: "Product Detail Deleted",
      description: "Product has been successfully removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with title and button on the same line */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Details Management</h1>
          <p className="text-muted-foreground">Manage detailed measurements and specifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Detail
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader> 
              <DialogTitle>{editingDetail ? "Edit Product Detail" : "Create Product Detail"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  id="product"
                  value={formData.product_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, product_id: Number(value) }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select product" />
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
              
              <div className="flex gap-4">
                <div className="w-full">
                  <Label>Bardan</Label>
                  <Input
                    type="number"
                    value={formData.bardan}
                    onChange={(e) => setFormData({ ...formData, bardan: Number(e.target.value) })}
                  />
                </div>
                <div className="w-full">
                  <Label>Kad</Label>
                  <Input
                    type="number"
                    value={formData.kad}
                    onChange={(e) => setFormData({ ...formData, kad: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <Label>Total Bags (Manual)</Label>
                <Input
                  type="number"
                  value={formData.manualTotalBags || 0}
                  onChange={(e) => setFormData({ ...formData, manualTotalBags: Number(e.target.value) })}
                />
              </div>
              
              {bagFields.map((field, index) => {
                const bagKey = `bag${field}`;
                const bagValue = formData[bagKey] || 0;
                
                if (index > 0) {
                  const prevBagKey = `bag${bagFields[index - 1]}`;
                  const prevValue = formData[prevBagKey] || 0;
                  if (prevValue <= 0) return null;
                }
                
                return (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-full">
                      <Label htmlFor={bagKey}>Bag {field}</Label>
                      <Input
                        id={bagKey}
                        type="number"
                        value={bagValue}
                        onChange={(e) => {
                          const updatedValue = Number(e.target.value);
                          updateBagValue(bagKey, updatedValue);
                        }}
                      />
                    </div>
                    {index !== 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-6"
                        onClick={() => handleRemoveBag(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                );
              })}
              
              <Button type="button" onClick={handleAddBag}>
                Add Bags
              </Button>
              
              <div>
                <Label>Total Bags (Auto)</Label>
                <Input value={formData.totalBags || 0} readOnly disabled />
              </div>
              
              <div className="flex gap-4">
                <div className="w-full">
                  <Label>Gross Weight</Label>
                  <Input
                    type="number"
                    value={formData.gross_weight}
                    onChange={(e) => setFormData({ ...formData, gross_weight: Number(e.target.value) })}
                  />
                </div>
                <div className="w-full">
                  <Label>Net Weight</Label>
                  <Input
                    type="number"
                    value={formData.net_weight}
                    onChange={(e) => setFormData({ ...formData, net_weight: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={
                    bagFields.every((f) => Number(formData[`bag${f}`]) <= 0) ||
                    Number(formData.manualTotalBags) <= 0 ||
                    Number(formData.manualTotalBags) !== Number(formData.totalBags)
                  }
                >
                  {editingDetail ? "Update" : "Create"} Detail
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
              <FileText className="h-5 w-5" /> All Product Details ({filteredDetails.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
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
              {filteredDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>{detail.product_slip}</TableCell>
                  <TableCell>{detail.bardan}</TableCell>
                  <TableCell>{detail.kad}</TableCell>
                  <TableCell>{detail.bag}</TableCell>
                  <TableCell>{detail.gross_weight} kg</TableCell>
                  <TableCell>{detail.net_weight} kg</TableCell>
                  <TableCell>{detail.created_at}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(detail)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(detail.id)}>
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
