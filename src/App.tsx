import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import { AdminLayout } from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Companies from "./pages/admin/Companies";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Cities from "./pages/admin/Cities";
import Vehicles from "./pages/admin/Vehicles";
import ProductDetails from "./pages/admin/ProductDetails";
import Reports from "./pages/admin/Reports";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="cities" element={<Cities />} />
              <Route path="companies" element={<Companies />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="product-details" element={<ProductDetails />} />
              <Route path="reports" element={<Reports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
