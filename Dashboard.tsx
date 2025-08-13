import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Truck,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  // Mock data - replace with API calls
  const stats = {
    totalUsers: 156,
    totalCompanies: 45,
    totalVehicles: 89,
    totalProducts: 1234,
    monthlyRevenue: 125000,
    pendingOrders: 23,
    recentTransactions: 67,
    systemAlerts: 3,
  };

  const recentActivities = [
    {
      id: 1,
      type: "product",
      message: "New product added by ABC Trading Co.",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "company",
      message: "XYZ Enterprises updated their profile",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "vehicle",
      message: "Vehicle TN-123-ABC registered",
      time: "6 hours ago",
      status: "success",
    },
    {
      id: 4,
      type: "alert",
      message: "Low inventory alert for Product ID: 456",
      time: "8 hours ago",
      status: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your groundnut trading business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +25% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              ₹{stats.monthlyRevenue.toLocaleString()}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-accent">{stats.pendingOrders}</div>
                <div className="text-sm text-muted-foreground">Pending Orders</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{stats.recentTransactions}</div>
                <div className="text-sm text-muted-foreground">Recent Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-warning">{stats.systemAlerts}</div>
                <div className="text-sm text-muted-foreground">System Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-primary-light hover:bg-primary hover:text-primary-foreground transition-colors">
              <div className="font-medium">Add New Product</div>
              <div className="text-sm text-muted-foreground">Register a new groundnut batch</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-accent-light hover:bg-accent hover:text-accent-foreground transition-colors">
              <div className="font-medium">Register Company</div>
              <div className="text-sm text-muted-foreground">Add new trading partner</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-warning-light hover:bg-warning hover:text-warning-foreground transition-colors">
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-muted-foreground">Generate business insights</div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0">
                  {activity.type === "product" && <Package className="h-5 w-5 text-primary" />}
                  {activity.type === "company" && <Building2 className="h-5 w-5 text-accent" />}
                  {activity.type === "vehicle" && <Truck className="h-5 w-5 text-primary" />}
                  {activity.type === "alert" && <AlertCircle className="h-5 w-5 text-warning" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant={activity.status === "success" ? "default" : activity.status === "warning" ? "destructive" : "secondary"}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}