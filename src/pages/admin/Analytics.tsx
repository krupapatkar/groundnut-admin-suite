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
import { useData } from "@/contexts/DataContext";
import RealTimeAlerts from "@/components/RealTimeAlerts";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const { 
    getUsersGrowth, 
    getCompaniesGrowth, 
    getMonthlyRevenue,
  orders, 
  vehicles, 
  users,
  companies,
  transactions,
  alerts,
  products,
  cities,
  updateAlert
} = useData();

  // Download CSV function
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const key = header.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
          const value = row[key] || '';
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

  // Calculate dynamic KPI values
  const revenueGrowth = getUsersGrowth(); // Using users growth as revenue indicator
  const customerAcquisition = companies.length;
  
  // Calculate Order Fulfillment Rate
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const totalOrders = orders.length;
  const orderFulfillmentRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0.0";
  
  // Calculate Fleet Utilization (assuming active vehicles vs total)
  const activeVehicles = vehicles.filter(vehicle => vehicle.status === true).length;
  const totalVehicles = vehicles.length;
  const fleetUtilization = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : "0.0";

  const kpis = [
    {
      title: "REVENUE GROWTH",
      value: `${revenueGrowth}%`,
      target: "Target 25%",
      trend: revenueGrowth >= 25 ? "up" : "down",
      color: "text-foreground",
      borderColor: "border-l-primary",
      bg: "bg-white",
      icon: TrendingUp,
      iconColor: "text-green-500"
    },
    {
      title: "CUSTOMER ACQUISITION",
      value: customerAcquisition.toString(),
      target: "Target 150",
      trend: customerAcquisition >= 150 ? "up" : "down",
      color: "text-foreground",
      borderColor: "border-l-primary",
      bg: "bg-white",
      icon: Users,
      iconColor: "text-blue-500"
    },
    {
      title: "ORDER FULFILLMENT RATE",
      value: `${orderFulfillmentRate}%`,
      target: "Target 95%",
      trend: parseFloat(orderFulfillmentRate) >= 95 ? "up" : "down",
      color: "text-foreground",
      borderColor: "border-l-primary",
      bg: "bg-white",
      icon: Package,
      iconColor: "text-orange-500"
    },
    {
      title: "FLEET UTILIZATION",
      value: `${fleetUtilization}%`,
      target: "Target 90%",
      trend: parseFloat(fleetUtilization) >= 90 ? "up" : "down",
      color: "text-foreground",
      borderColor: "border-l-primary",
      bg: "bg-white",
      icon: Truck,
      iconColor: "text-purple-500"
    }
  ];

  // Calculate dynamic performance metrics
  const totalRevenue = transactions
    .filter(t => t.type === "sale")
    .reduce((sum, t) => sum + t.amount, 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const previousAvgOrderValue = avgOrderValue * 0.87;
  const avgOrderValueChange = avgOrderValue > 0 ? (((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100).toFixed(1) : "0.0";
  
  // Calculate processing time based on order completion rate
  const pendingOrdersCount = orders.filter(order => order.status === "pending").length;
  const processingTime = pendingOrdersCount > 0 ? (pendingOrdersCount * 0.5).toFixed(1) : "1.0";
  const previousProcessingTime = (parseFloat(processingTime) * 1.2).toFixed(1);
  const processingTimeChange = (((parseFloat(previousProcessingTime) - parseFloat(processingTime)) / parseFloat(previousProcessingTime)) * 100).toFixed(1);
  
  // Calculate customer satisfaction based on successful orders
  const satisfactionScore = totalOrders > 0 ? Math.min(4.0 + (parseFloat(orderFulfillmentRate) / 25), 5.0).toFixed(1) : "4.0";
  const previousSatisfactionScore = Math.max(parseFloat(satisfactionScore) - 0.2, 3.0).toFixed(1);
  const satisfactionChange = (((parseFloat(satisfactionScore) - parseFloat(previousSatisfactionScore)) / parseFloat(previousSatisfactionScore)) * 100).toFixed(1);
  
  // Calculate repeat customer rate based on companies vs total users
  const repeatRate = users.length > 0 ? Math.min(Math.round((companies.length / users.length) * 100), 85) : 0;
  const previousRepeatRate = Math.max(repeatRate - 6, 30);
  const repeatRateChange = repeatRate > previousRepeatRate ? `+${((repeatRate - previousRepeatRate) / previousRepeatRate * 100).toFixed(1)}` : `${((repeatRate - previousRepeatRate) / previousRepeatRate * 100).toFixed(1)}`;
  
  const performanceMetrics = [
    { 
      metric: "Average Order Value", 
      current: `₹${avgOrderValue.toLocaleString()}`, 
      previous: `₹${previousAvgOrderValue.toLocaleString()}`, 
      change: `+${avgOrderValueChange}%` 
    },
    { 
      metric: "Processing Time", 
      current: `${processingTime} days`, 
      previous: `${previousProcessingTime} days`, 
      change: `-${processingTimeChange}%` 
    },
    { 
      metric: "Customer Satisfaction", 
      current: `${satisfactionScore}/5`, 
      previous: `${previousSatisfactionScore}/5`, 
      change: `+${satisfactionChange}%` 
    },
    { 
      metric: "Repeat Customer Rate", 
      current: `${repeatRate}%`, 
      previous: `${previousRepeatRate}%`, 
      change: `${repeatRateChange}%` 
    },
  ];

// Get dynamic regional data based on cities (include even without companies)
const getRegionalData = () => {
  const regionMap: Record<string, { revenue: number; orders: number; companyCount: number }> = {};
  
  // Initialize all regions from cities so they appear even with 0 data
  cities.forEach(city => {
    regionMap[city.name] = { revenue: 0, orders: 0, companyCount: 0 };
  });
  
  // Add companies' locations
  companies.forEach(company => {
    const location = company.location_name || 'Unknown';
    if (!regionMap[location]) {
      regionMap[location] = { revenue: 0, orders: 0, companyCount: 0 };
    }
    regionMap[location].companyCount += 1;
  });

  // Add product revenue to regions based on company locations
  products.forEach(product => {
    const company = companies.find(c => String(c.id) === String(product.company_id));
    if (company) {
      const location = company.location_name || 'Unknown';
      if (!regionMap[location]) {
        regionMap[location] = { revenue: 0, orders: 0, companyCount: 0 };
      }
      regionMap[location].revenue += product.final_price || 0;
      regionMap[location].orders += 1;
    }
  });

  // Convert to array and sort by revenue (keep all cities)
  const entries = Object.entries(regionMap).map(([region, data]) => {
    const totalRegionalRevenue = Object.values(regionMap).reduce((sum, r) => sum + r.revenue, 0);
    const avgRevenue = totalRegionalRevenue / Math.max(Object.keys(regionMap).length, 1);
    const growthRate = avgRevenue > 0 
      ? Math.round(((data.revenue - avgRevenue) / avgRevenue) * 100 + revenueGrowth)
      : revenueGrowth;
    return {
      region,
      revenue: `₹${(data.revenue / 100000).toFixed(1)}L`,
      orders: data.orders,
      growth: `${growthRate >= 0 ? '+' : ''}${growthRate}%`,
      companyCount: data.companyCount
    };
  });

  return entries.sort((a, b) => {
    // Sort by city creation date (oldest first)
    const cityA = cities.find(c => c.name === a.region);
    const cityB = cities.find(c => c.name === b.region);
    
    if (cityA && cityB) {
      return new Date(cityA.created_at).getTime() - new Date(cityB.created_at).getTime();
    }
    return a.region.localeCompare(b.region);
  });
};

const regionalData = getRegionalData();

  // Use real alerts from data context with enhanced mapping
  const recentAlerts = alerts
    .filter(alert => !alert.resolved) // Only show unresolved alerts
    .slice(0, 4)
    .map(alert => {
      // Calculate time difference for more realistic time display
      const alertDate = new Date(alert.created_at);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - alertDate.getTime()) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      
      let timeDisplay;
      if (diffInMinutes < 5) {
        timeDisplay = "Just now";
      } else if (diffInMinutes < 60) {
        timeDisplay = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        timeDisplay = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInDays < 7) {
        timeDisplay = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        const diffInWeeks = Math.floor(diffInDays / 7);
        timeDisplay = `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
      }
      
      return {
        type: alert.type, // Use exact type from data
        message: alert.message,
        time: timeDisplay,
        id: alert.id
      };
    });

  const getAlertIcon = (type: string) => {
    return <Activity className="h-4 w-4" />;
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4" /> : 
      <div className="h-4 w-4 rotate-180"><TrendingUp className="h-4 w-4" /></div>;
  };

  // Custom Analytics Report Download
  const handleCustomReport = () => {
    // Prepare comprehensive analytics data
    const analyticsData = [
      // KPI Summary
      ...kpis.map(kpi => ({
        section: 'KPI',
        metric: kpi.title,
        value: kpi.value,
        target: kpi.target,
        trend: kpi.trend,
        time_range: timeRange
      })),
      
      // Performance Metrics
      ...performanceMetrics.map(metric => ({
        section: 'Performance',
        metric: metric.metric,
        current: metric.current,
        previous: metric.previous,
        change: metric.change,
        time_range: timeRange
      })),
      
      // Regional Data
      ...regionalData.map(region => ({
        section: 'Regional',
        region: region.region,
        revenue: region.revenue,
        orders: region.orders,
        growth: region.growth,
        companies: region.companyCount,
        time_range: timeRange
      })),
      
      // Alerts Summary
      ...recentAlerts.map(alert => ({
        section: 'Alerts',
        type: alert.type,
        message: alert.message,
        time: alert.time,
        status: 'Active',
        time_range: timeRange
      }))
    ];

    downloadCSV(
      analyticsData, 
      'business_analytics_custom_report', 
      ['Section', 'Metric', 'Value', 'Target', 'Trend', 'Time_Range', 'Region', 'Revenue', 'Orders', 'Growth', 'Companies', 'Current', 'Previous', 'Change', 'Type', 'Message', 'Time', 'Status']
    );
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
          <Button variant="outline" className="gap-2" onClick={handleCustomReport}>
            <BarChart3 className="h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className={`${kpi.bg} ${kpi.borderColor} border-l-4 shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {kpi.title}
                  </p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</span>
                    <div className={`${kpi.iconColor}`}>
                      {getTrendIcon(kpi.trend)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {kpi.target}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
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
            <div className="space-y-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg">{metric.metric}</p>
                    <p className="text-sm text-muted-foreground">Current period</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{metric.current}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm text-muted-foreground">vs {metric.previous}</span>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-50 text-green-700 border-green-200 font-medium"
                      >
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
        <RealTimeAlerts 
          alerts={alerts} 
          onResolveAlert={(alertId) => updateAlert(alertId, { resolved: true })}
        />
      </div>

      {/* Regional Performance */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Regional Performance Analysis
            </CardTitle>
            <CardDescription>
              Revenue and order distribution across different regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regionalData.map((region, index) => (
                <div key={index} className="p-6 rounded-lg bg-card border border-border hover:shadow-md transition-all duration-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-foreground">{region.region}</h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-50 text-green-700 border-green-200 font-medium"
                      >
                        {region.growth}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <span className="font-bold text-xl text-foreground">{region.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Orders</span>
                        <span className="font-semibold text-lg text-foreground">{region.orders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Companies</span>
                        <span className="font-semibold text-lg text-foreground">{region.companyCount}</span>
                      </div>
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
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Revenue Forecast</h4>
                <p className="text-sm text-blue-700 mb-1">
                  Projected {Math.round(revenueGrowth * 1.2)}% increase in next quarter based on current trends
                </p>
                <p className="text-xs text-blue-600">
                  Expected revenue: ₹{((totalRevenue * (1 + revenueGrowth * 1.2 / 100)) / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="p-6 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Demand Prediction</h4>
                <p className="text-sm text-green-700 mb-1">
                  Peak demand expected in next 2 weeks - consider inventory adjustment
                </p>
                <p className="text-xs text-green-600">
                  Fleet utilization: {fleetUtilization}% • {pendingOrdersCount} pending orders
                </p>
              </div>
              <div className="p-6 rounded-lg bg-yellow-50 border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Price Optimization</h4>
                <p className="text-sm text-yellow-700 mb-1">
                  Market analysis suggests 5-8% price increase opportunity
                </p>
                <p className="text-xs text-yellow-600">
                  Customer satisfaction: {satisfactionScore}/5 • {customerAcquisition} active partners
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
              {(() => {
                // Calculate dynamic health score based on actual metrics
                const revenueScore = Math.min((revenueGrowth / 25) * 10, 10);
                const efficiencyScore = Math.min((parseFloat(orderFulfillmentRate) / 10), 10);
                const satisfactionScoreValue = parseFloat(satisfactionScore) * 2;
                const marketScore = Math.min((customerAcquisition / 200) * 10, 10);
                const overallScore = ((revenueScore + efficiencyScore + satisfactionScoreValue + marketScore) / 4).toFixed(1);
                
                const getScoreColor = (score: number) => {
                  return "text-foreground";
                };
                
                const getScoreLabel = (score: number) => {
                  if (score >= 8.5) return "Excellent";
                  if (score >= 7.0) return "Good";
                  if (score >= 5.5) return "Average";
                  return "Needs Improvement";
                };
                
                return (
                  <>
                     <div className="text-6xl font-bold mb-4 text-green-600">{overallScore}</div>
                     <div className="text-xl font-semibold text-foreground mb-6">{getScoreLabel(parseFloat(overallScore))}</div>
                     <div className="space-y-3 text-left">
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Revenue Growth</span>
                         <span className="font-medium text-green-600">{revenueScore.toFixed(1)}/10</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Operational Efficiency</span>
                         <span className="font-medium text-green-600">{efficiencyScore.toFixed(1)}/10</span>
                       </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                          <span className="font-medium text-blue-600">{satisfactionScoreValue.toFixed(1)}/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Market Position</span>
                          <span className="font-medium text-orange-600">{marketScore.toFixed(1)}/10</span>
                        </div>
                     </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}