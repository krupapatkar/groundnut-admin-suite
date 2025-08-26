import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Building2, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GroundnutPro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/admin">
                <Button>Admin Panel</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Professional Groundnut
            <span className="text-primary"> Trading System</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive admin panel for managing groundnut trading operations, 
            companies, vehicles, products, and detailed transaction records.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/admin">
              <Button size="lg" className="text-lg px-8">
                Access Admin Panel
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mx-auto mb-4" />
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage administrators and users with role-based access control
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mx-auto mb-4" />
              <CardTitle>Company Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track trading companies and their locations efficiently
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Package className="h-8 w-8 text-primary mx-auto mb-4" />
              <CardTitle>Product Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete groundnut product tracking with detailed specifications
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-4" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive reports and business intelligence
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
