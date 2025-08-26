import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  Truck,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import RecentActivities from "@/components/RecentActivities";

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    users, 
    companies, 
    vehicles, 
    products, 
    activities,
    alerts,
    getMonthlyRevenue,
    getPendingOrdersCount,
    getRecentTransactionsCount,
    getSystemAlertsCount,
    getUsersGrowth,
    getCompaniesGrowth,
    getVehiclesGrowth,
    getProductsGrowth,
  } = useData();
  
  // Dynamic data from shared context
  const stats = {
    totalUsers: users.length,
    totalCompanies: companies.length,
    totalVehicles: vehicles.length,
    totalProducts: products.length,
    monthlyRevenue: getMonthlyRevenue(),
    pendingOrders: getPendingOrdersCount(),
    recentTransactions: getRecentTransactionsCount(),
    systemAlerts: getSystemAlertsCount(),
    usersGrowth: getUsersGrowth(),
    companiesGrowth: getCompaniesGrowth(),
    vehiclesGrowth: getVehiclesGrowth(),
    productsGrowth: getProductsGrowth(),
  };

  const recentActivities = activities;

  return (
    <div className="space-y-6">
      {/* SEO Meta */}
      <header>
        <h1 className="sr-only">Groundnut Trading Dashboard - Key Metrics</h1>
      </header>

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
              +{stats.usersGrowth}% from last month
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
              +{stats.companiesGrowth}% from last month
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
              +{stats.vehiclesGrowth}% from last month
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
              +{stats.productsGrowth}% from last month
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
            <button 
              onClick={() => navigate('/admin/products')}
              className="w-full text-left p-3 rounded-lg bg-primary-light hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <div className="font-medium">Add New Product</div>
              <div className="text-sm text-muted-foreground">Register a new groundnut batch</div>
            </button>
            <button 
              onClick={() => navigate('/admin/companies')}
              className="w-full text-left p-3 rounded-lg bg-accent-light hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="font-medium">Register Company</div>
              <div className="text-sm text-muted-foreground">Add new trading partner</div>
            </button>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="w-full text-left p-3 rounded-lg bg-warning-light hover:bg-warning hover:text-warning-foreground transition-colors"
            >
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-muted-foreground">Generate business insights</div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="w-full">
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
}