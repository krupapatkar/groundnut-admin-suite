import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Package,
  Truck
} from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const kpis = [
    {
      title: "Revenue Growth",
      value: "23.5%",
      target: "25%",
      trend: "up",
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
      icon: TrendingUp
    },
    {
      title: "Customer Acquisition",
      value: "156",
      target: "150",
      trend: "up",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
      icon: Users
    },
    {
      title: "Order Fulfillment Rate",
      value: "94.2%",
      target: "95%",
      trend: "down",
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
      icon: Package
    },
    {
      title: "Fleet Utilization",
      value: "87.8%",
      target: "90%",
      trend: "up",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
      icon: Truck
    }
  ];

  const performanceMetrics = [
    { metric: "Average Order Value", current: "₹2,45,000", previous: "₹2,12,000", change: "+15.6%" },
    { metric: "Processing Time", current: "2.3 days", previous: "2.8 days", change: "-17.9%" },
    { metric: "Customer Satisfaction", current: "4.7/5", previous: "4.5/5", change: "+4.4%" },
    { metric: "Repeat Customer Rate", current: "68%", previous: "62%", change: "+9.7%" },
  ];

  const regionalData = [
    { region: "Tamil Nadu", revenue: "₹45.2L", orders: 234, growth: "+18%" },
    { region: "Karnataka", revenue: "₹38.7L", orders: 198, growth: "+12%" },
    { region: "Andhra Pradesh", revenue: "₹29.5L", orders: 156, growth: "+22%" },
    { region: "Kerala", revenue: "₹21.3L", orders: 112, growth: "+8%" },
  ];

  const alerts = [
    { type: "warning", message: "Low inventory alert for Premium Groundnuts", time: "2 hours ago" },
    { type: "success", message: "Monthly revenue target achieved", time: "1 day ago" },
    { type: "error", message: "Payment delay from XYZ Enterprises", time: "3 hours ago" },
    { type: "info", message: "New vehicle added to fleet", time: "5 hours ago" },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <div className="h-4 w-4 text-red-600 rotate-180"><TrendingUp className="h-4 w-4" /></div>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Business Analytics</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                  {getTrendIcon(kpi.trend)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {kpi.target}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription>Comparative analysis of key business metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{metric.metric}</p>
                    <p className="text-sm text-muted-foreground">Current period</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{metric.current}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">vs {metric.previous}</span>
                      <Badge variant="secondary" className={
                        metric.change.startsWith('+') ? 'text-green-600 bg-green-100 dark:bg-green-900' : 
                        metric.change.startsWith('-') && metric.metric === 'Processing Time' ? 'text-green-600 bg-green-100 dark:bg-green-900' :
                        'text-red-600 bg-red-100 dark:bg-red-900'
                      }>
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Alerts
            </CardTitle>
            <CardDescription>Important notifications and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Regional Performance Analysis
          </CardTitle>
          <CardDescription>Revenue and order distribution across different regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalData.map((region, index) => (
              <div key={index} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{region.region}</h3>
                  <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900">
                    {region.growth}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-bold text-lg">{region.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Orders</span>
                    <span className="font-medium">{region.orders}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictive Insights
            </CardTitle>
            <CardDescription>AI-powered business forecasting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Revenue Forecast</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Projected 28% increase in next quarter based on current trends
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Demand Prediction</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Peak demand expected in next 2 weeks - consider inventory adjustment
                </p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Price Optimization</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Market analysis suggests 5-8% price increase opportunity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Health Score
            </CardTitle>
            <CardDescription>Overall business performance rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">8.7</div>
              <div className="text-lg font-semibold text-foreground mb-4">Excellent</div>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <span className="font-medium text-green-600">9.2/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Operational Efficiency</span>
                  <span className="font-medium text-green-600">8.8/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="font-medium text-blue-600">8.5/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Market Position</span>
                  <span className="font-medium text-orange-600">8.2/10</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}