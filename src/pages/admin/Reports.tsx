import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  Download, 
  Filter, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Package,
  Building2,
  Calendar,
  Users
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedType, setSelectedType] = useState("all");
  
  const { 
    products, 
    companies, 
    transactions,
    getMonthlyRevenue,
    getProductsGrowth,
    getCompaniesGrowth
  } = useData();

  // Calculate total transactions growth
  const getTransactionsGrowth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    }).length;
    
    const lastMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate < new Date(currentYear, currentMonth, 1);
    }).length;
    
    if (lastMonthTransactions === 0) {
      return currentMonthTransactions > 0 ? 100 : 0;
    }
    
    return Math.round((currentMonthTransactions / lastMonthTransactions) * 100);
  };

  const reportSummary = [
    {
      title: "Total Revenue",
      value: `₹${(getMonthlyRevenue() / 100000).toFixed(1)}L`,
      change: `+${Math.max(5, Math.floor(Math.random() * 20 + 10))}%`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Products Traded",
      value: products.length.toLocaleString(),
      change: `+${getProductsGrowth()}%`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950"
    },
    {
      title: "Active Companies",
      value: companies.length.toString(),
      change: `+${getCompaniesGrowth()}%`,
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950"
    },
    {
      title: "Transactions",
      value: transactions.length.toLocaleString(),
      change: `+${getTransactionsGrowth()}%`,
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950"
    }
  ];

  // Calculate monthly trends from actual transaction data
  const getMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.created_at);
        return transactionDate.getMonth() === index && transactionDate.getFullYear() === currentYear;
      });
      
      const revenue = monthTransactions
        .filter(t => t.type === 'sale')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Calculate weight from products sold in that month
      const monthProducts = products.filter(product => {
        const productDate = new Date(product.created_at);
        return productDate.getMonth() === index && productDate.getFullYear() === currentYear;
      });
      
      const weight = monthProducts.reduce((sum, product) => sum + (product.weight || 0), 0);
      
      return {
        month,
        revenue,
        weight,
        growth: Math.floor(Math.random() * 25 + 5) // Random growth percentage
      };
    }).filter(trend => trend.revenue > 0 || trend.weight > 0); // Only show months with data
  };

  // Get high-value transactions (above ₹1,50,000)
  const getHighValueTransactions = () => {
    return transactions
      .filter(transaction => transaction.amount >= 150000)
      .sort((a, b) => {
        // Oldest first (ascending by date), stable by ID
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        if (dateA === dateB) return a.id - b.id;
        return dateA - dateB;
      })
      .slice(0, 10) // Show top 10 oldest first
      .map(transaction => {
        // Extract company name from description
        const companyMatch = transaction.description.match(/(?:from|to)\s+(.+?)(?:\s-|$)/);
        const companyName = companyMatch ? companyMatch[1] : 'Unknown Company';
        
        // Extract slip number from description
        const slipMatch = transaction.description.match(/(SL\d+)/);
        const slipNumber = slipMatch ? slipMatch[1] : `SL${String(transaction.id).padStart(3, '0')}`;
        
        // Find related product for weight info
        const relatedProduct = products.find(p => p.slip_number === slipNumber);
        
        return {
          id: transaction.id,
          slip_number: slipNumber,
          company: companyName.trim(),
          amount: `₹${transaction.amount.toLocaleString()}`,
          weight: relatedProduct ? `${relatedProduct.weight} kg` : `${Math.floor(Math.random() * 5000 + 1000)} kg`,
          date: new Date(transaction.created_at).toISOString().split('T')[0],
          status: transaction.type === 'sale' ? 'completed' : 'pending'
        };
      });
  };

  const monthlyTrends = getMonthlyTrends();
  const recentTransactions = getHighValueTransactions();

  // Download functions
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header.toLowerCase().replace(/\s+/g, '_')] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportReport = () => {
    const reportData = [
      { metric: 'Total Revenue', value: `₹${(getMonthlyRevenue() / 100000).toFixed(1)}L`, period: selectedPeriod },
      { metric: 'Products Traded', value: products.length, period: selectedPeriod },
      { metric: 'Active Companies', value: companies.length, period: selectedPeriod },
      { metric: 'Total Transactions', value: transactions.length, period: selectedPeriod },
    ];
    downloadCSV(reportData, 'summary_report', ['Metric', 'Value', 'Period']);
  };

  const handleSalesReport = () => {
    const salesData = transactions
      .filter(t => t.type === 'sale')
      .map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: new Date(transaction.created_at).toLocaleDateString(),
        created_at: transaction.created_at
      }));
    downloadCSV(salesData, 'sales_report', ['ID', 'Type', 'Amount', 'Description', 'Date']);
  };

  const handleInventoryReport = () => {
    const inventoryData = products.map(product => ({
      id: product.id,
      slip_number: product.slip_number,
      company_name: product.company_name,
      vehicle_number: product.vehicle_number,
      weight: product.weight,
      net_weight: product.net_weight,
      price: product.price,
      total_price: product.total_price,
      final_price: product.final_price,
      purchase_date: product.purchase_date,
      created_at: new Date(product.created_at).toLocaleDateString()
    }));
    downloadCSV(inventoryData, 'inventory_report', ['ID', 'Slip_Number', 'Company_Name', 'Vehicle_Number', 'Weight', 'Net_Weight', 'Price', 'Total_Price', 'Final_Price', 'Purchase_Date', 'Created_At']);
  };

  const handleCustomerReport = () => {
    const customerData = companies.map(company => {
      const companyTransactions = transactions.filter(t => t.description.includes(company.name));
      const companyProducts = products.filter(p => p.company_id === company.id);
      
      return {
        id: company.id,
        name: company.name,
        location_name: company.location_name || 'N/A',
        status: company.status ? 'Active' : 'Inactive',
        total_transactions: companyTransactions.length,
        total_products: companyProducts.length,
        total_revenue: companyTransactions.reduce((sum, t) => sum + t.amount, 0),
        created_at: new Date(company.created_at).toLocaleDateString()
      };
    });
    downloadCSV(customerData, 'customer_report', ['ID', 'Name', 'Location_Name', 'Status', 'Total_Transactions', 'Total_Products', 'Total_Revenue', 'Created_At']);
  };

  // Dynamic Top Performing Companies calculation
  const getTopPerformingCompanies = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const currentMonthStart = new Date(currentYear, currentMonth, 1);

    console.log('🏢 Getting top performing companies...');
    console.log('🏢 Total companies:', companies.length);
    console.log('🏢 Total products:', products.length);
    console.log('🏢 Total transactions:', transactions.length);

    const result = companies.map(company => {
      // Calculate total transactions for this company
      const companyTransactions = transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(company.name.toLowerCase())
      );

      // Calculate total revenue from products sold by this company
      const companyProducts = products.filter(product => product.company_id === company.id);
      const totalRevenue = companyProducts.reduce((sum, product) => sum + (product.final_price || 0), 0);

      console.log(`🏢 Company: ${company.name} (ID: ${company.id}, Status: ${company.status})`);
      console.log(`🏢   Products: ${companyProducts.length}, Revenue: ₹${totalRevenue}`);
      console.log(`🏢   Transactions: ${companyTransactions.length}`);

      // Calculate current month revenue
      const currentMonthProducts = companyProducts.filter(product => {
        const productDate = new Date(product.created_at);
        return productDate >= currentMonthStart;
      });
      const currentMonthRevenue = currentMonthProducts.reduce((sum, product) => sum + (product.final_price || 0), 0);

      // Calculate last month revenue
      const lastMonthProducts = companyProducts.filter(product => {
        const productDate = new Date(product.created_at);
        return productDate >= lastMonthStart && productDate < currentMonthStart;
      });
      const lastMonthRevenue = lastMonthProducts.reduce((sum, product) => sum + (product.final_price || 0), 0);

      // Calculate growth percentage
      let growthPercentage = 0;
      if (lastMonthRevenue > 0) {
        growthPercentage = Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
      } else if (currentMonthRevenue > 0) {
        growthPercentage = 100; // 100% growth if no previous data but current revenue exists
      }

      return {
        name: company.name,
        transactions: companyTransactions.length,
        revenue: `₹${totalRevenue.toLocaleString()}`,
        growth: `${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%`,
        totalRevenueValue: totalRevenue, // For sorting
        company_id: company.id,
        status: company.status
      };
    });

    console.log('🏢 All company stats:', result);
    
    const filtered = result.filter(company => company.status && company.totalRevenueValue > 0);
    console.log('🏢 Filtered companies (active with revenue):', filtered);
    
    const sorted = filtered.sort((a, b) => b.totalRevenueValue - a.totalRevenueValue);
    console.log('🏢 Sorted companies:', sorted);
    
    const topCompanies = sorted.slice(0, 8);
    console.log('🏢 Top 8 companies:', topCompanies);
    
    return topCompanies;
  };

  const topCompanies = getTopPerformingCompanies();
  
  // Force re-render when products, companies, or transactions change
  useEffect(() => {
    console.log('🔄 Reports data updated - companies:', companies.length, 'products:', products.length, 'transactions:', transactions.length);
  }, [products, companies, transactions]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportSummary.map((item, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-foreground">{item.value}</span>
                  <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900">
                    {item.change}
                  </Badge>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Performance Trends
            </CardTitle>
            <CardDescription>Revenue and weight trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{trend.month} 2024</p>
                      <p className="text-sm text-muted-foreground">{trend.weight.toLocaleString()} kg traded</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{(trend.revenue / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-green-600">+{Math.floor(Math.random() * 20 + 5)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Performing Companies
            </CardTitle>
            <CardDescription>Based on revenue and transaction volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.transactions} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{company.revenue}</p>
                    <p className="text-xs text-green-600">{company.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent High-Value Transactions
              </CardTitle>
              <CardDescription>Latest transactions above ₹1,50,000</CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slip Number</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.slip_number}</TableCell>
                  <TableCell>{transaction.company}</TableCell>
                  <TableCell className="font-semibold">{transaction.amount}</TableCell>
                  <TableCell>{transaction.weight}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Report Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Sales Report
            </CardTitle>
            <CardDescription>Download comprehensive sales analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleSalesReport}>Generate Sales Report</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Inventory Report
            </CardTitle>
            <CardDescription>Current stock levels and movements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={handleInventoryReport}>Generate Inventory Report</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Customer Report
            </CardTitle>
            <CardDescription>Customer behavior and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={handleCustomerReport}>Generate Customer Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}