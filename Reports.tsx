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
import { useState } from "react";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedType, setSelectedType] = useState("all");

  const reportSummary = [
    {
      title: "Total Revenue",
      value: "₹12,45,000",
      change: "+15.3%",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Products Traded",
      value: "2,847",
      change: "+8.7%",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950"
    },
    {
      title: "Active Companies",
      value: "156",
      change: "+12.1%",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950"
    },
    {
      title: "Transactions",
      value: "1,234",
      change: "+23.4%",
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950"
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      slip_number: "SL001",
      company: "ABC Trading Co.",
      amount: "₹2,45,000",
      weight: "5000 kg",
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      slip_number: "SL002",
      company: "XYZ Enterprises",
      amount: "₹1,93,440",
      weight: "3750 kg",
      date: "2024-01-14",
      status: "completed"
    },
    {
      id: 3,
      slip_number: "SL003",
      company: "Global Groundnut Ltd",
      amount: "₹3,12,000",
      weight: "6200 kg",
      date: "2024-01-13",
      status: "pending"
    },
    {
      id: 4,
      slip_number: "SL004",
      company: "Fresh Agro Ltd",
      amount: "₹1,87,500",
      weight: "3800 kg",
      date: "2024-01-12",
      status: "completed"
    },
  ];

  const topCompanies = [
    { name: "ABC Trading Co.", transactions: 45, revenue: "₹4,50,000", growth: "+18%" },
    { name: "XYZ Enterprises", transactions: 38, revenue: "₹3,80,000", growth: "+12%" },
    { name: "Global Groundnut Ltd", transactions: 29, revenue: "₹2,90,000", growth: "+8%" },
    { name: "Fresh Agro Ltd", transactions: 22, revenue: "₹2,20,000", growth: "+15%" },
  ];

  const monthlyTrends = [
    { month: "Jan", revenue: 950000, weight: 18500 },
    { month: "Feb", revenue: 1120000, weight: 21200 },
    { month: "Mar", revenue: 980000, weight: 19800 },
    { month: "Apr", revenue: 1350000, weight: 25400 },
    { month: "May", revenue: 1245000, weight: 23800 },
    { month: "Jun", revenue: 1420000, weight: 27100 },
  ];

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
          <Button className="gap-2">
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
            <div className="space-y-4">
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
            <Button className="w-full">Generate Sales Report</Button>
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
            <Button className="w-full" variant="outline">Generate Inventory Report</Button>
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
            <Button className="w-full" variant="outline">Generate Customer Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}