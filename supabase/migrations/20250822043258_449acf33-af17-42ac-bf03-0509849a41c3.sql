-- ===============================
-- Create remaining admin tables
-- ===============================

-- Users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  email_address TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  type TEXT CHECK (type IN ('ADMIN', 'USER')) NOT NULL,
  mobile_number TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+91',
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cities table  
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location_id UUID REFERENCES public.cities(id),
  location_name TEXT,
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES public.companies(id),
  company_name TEXT,
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  company_name TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  vehicle_number TEXT NOT NULL,
  slip_number TEXT NOT NULL UNIQUE,
  purchase_date DATE NOT NULL,
  bag INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  net_weight DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  final_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('purchase', 'sale', 'payment')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System alerts table
CREATE TABLE public.system_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('warning', 'error', 'info')) NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('product', 'company', 'vehicle', 'user', 'alert')) NOT NULL,
  message TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT CHECK (status IN ('success', 'warning', 'info', 'error')) NOT NULL DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===============================
-- Enable RLS on all new tables
-- ===============================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- ===============================
-- Create policies for public read access (and write for admin operations)
-- ===============================

-- Users policies
CREATE POLICY "Allow public read access to users" 
  ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" 
  ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" 
  ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete users" 
  ON public.users FOR DELETE USING (true);

-- Cities policies
CREATE POLICY "Allow public read access to cities" 
  ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public insert cities" 
  ON public.cities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update cities" 
  ON public.cities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete cities" 
  ON public.cities FOR DELETE USING (true);

-- Companies policies
CREATE POLICY "Allow public read access to companies" 
  ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow public insert companies" 
  ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update companies" 
  ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Allow public delete companies" 
  ON public.companies FOR DELETE USING (true);

-- Vehicles policies
CREATE POLICY "Allow public read access to vehicles" 
  ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert vehicles" 
  ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vehicles" 
  ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete vehicles" 
  ON public.vehicles FOR DELETE USING (true);

-- Products policies
CREATE POLICY "Allow public read access to products" 
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" 
  ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" 
  ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" 
  ON public.products FOR DELETE USING (true);

-- Orders policies
CREATE POLICY "Allow public read access to orders" 
  ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" 
  ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update orders" 
  ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete orders" 
  ON public.orders FOR DELETE USING (true);

-- Transactions policies
CREATE POLICY "Allow public read access to transactions" 
  ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" 
  ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" 
  ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete transactions" 
  ON public.transactions FOR DELETE USING (true);

-- System alerts policies
CREATE POLICY "Allow public read access to system_alerts" 
  ON public.system_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert system_alerts" 
  ON public.system_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update system_alerts" 
  ON public.system_alerts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete system_alerts" 
  ON public.system_alerts FOR DELETE USING (true);

-- Activities policies
CREATE POLICY "Allow public read access to activities" 
  ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert activities" 
  ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update activities" 
  ON public.activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete activities" 
  ON public.activities FOR DELETE USING (true);

-- ===============================
-- Add triggers for updated_at on new tables
-- ===============================
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_alerts_updated_at
  BEFORE UPDATE ON public.system_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ===============================
-- Insert static data from your application
-- ===============================

-- Insert cities first (dependencies)
INSERT INTO public.cities (name, status, created_at) VALUES
('Chennai', true, '2024-01-01'),
('Bangalore', true, '2024-01-02'),
('Mumbai', true, '2024-01-03'),
('Delhi', true, '2024-02-10');

-- Get city IDs for references (we'll use the created cities)
-- Insert companies with city references
INSERT INTO public.companies (name, location_name, status, created_at) VALUES
('ABC Trading Co.', 'Chennai', true, '2024-01-15'),
('XYZ Enterprises', 'Bangalore', true, '2024-01-16'),
('Global Groundnut Ltd', 'Mumbai', true, '2024-01-17'),
('South India Traders', 'Delhi', false, '2024-01-18'),
('Delhi Groundnut Corp', 'Delhi', true, '2024-02-12');

-- Insert users
INSERT INTO public.users (user_name, email_address, password, type, mobile_number, country_code, status, created_at) VALUES
('Admin User', 'admin@groundnut.com', 'admin123', 'ADMIN', '9876543210', '+91', true, '2024-01-15'),
('John Doe', 'john@example.com', 'john123', 'USER', '9876543211', '+91', true, '2024-01-16'),
('Jane Smith', 'jane@example.com', 'jane123', 'USER', '9876543212', '+91', false, '2024-01-17'),
('Bob Wilson', 'bob@example.com', 'bob123', 'USER', '9876543213', '+91', true, '2024-01-18'),
('Alice Brown', 'alice@example.com', 'alice123', 'USER', '9876543214', '+91', true, '2024-01-19');

-- Insert vehicles (will link to companies via company_name for now)
INSERT INTO public.vehicles (number, company_name, status, created_at) VALUES
('TN-01-AB-1234', 'ABC Trading Co.', true, '2024-01-15'),
('KA-05-XY-5678', 'XYZ Enterprises', true, '2024-01-16'),
('MH-12-CD-9012', 'Global Groundnut Ltd', true, '2024-01-17'),
('TN-11-EF-3456', 'South India Traders', false, '2024-01-18'),
('KA-20-GH-7890', 'ABC Trading Co.', true, '2024-01-19'),
('DL-01-XY-9999', 'Delhi Groundnut Corp', true, '2024-02-12');

-- Insert products  
INSERT INTO public.products (company_name, vehicle_number, slip_number, purchase_date, bag, price, weight, net_weight, total_price, final_price, created_at) VALUES
('ABC Trading Co.', 'TN-01-AB-1234', 'SL001', '2024-01-15', 100, 50.00, 5000.00, 4950.00, 247500.00, 260000.00, '2024-01-15'),
('XYZ Enterprises', 'KA-05-XY-5678', 'SL002', '2024-02-10', 150, 52.00, 7500.00, 7425.00, 386100.00, 405000.00, '2024-02-10'),
('Global Groundnut Ltd', 'MH-12-CD-9012', 'SL003', '2024-02-15', 200, 48.00, 10000.00, 9900.00, 475200.00, 500000.00, '2024-02-15'),
('Delhi Groundnut Corp', 'DL-01-XY-9999', 'SL004', '2024-02-14', 120, 55.00, 6000.00, 5940.00, 326700.00, 350000.00, '2024-02-14');

-- Insert transactions
INSERT INTO public.transactions (type, amount, description, created_at) VALUES
('purchase', 260000.00, 'Purchase from ABC Trading Co. - SL001', '2024-08-19T10:30:00'),
('sale', 405000.00, 'Sale to XYZ Enterprises - SL002', '2024-08-19T09:15:00'),
('payment', 500000.00, 'Payment received from Global Groundnut Ltd', '2024-08-18T16:45:00'),
('purchase', 125000.00, 'Purchase from South India Traders', '2024-08-18T14:20:00');

-- Insert system alerts
INSERT INTO public.system_alerts (type, message, resolved, created_at) VALUES
('warning', 'Low inventory alert for Product GNT-001 - 45kg total weight', false, NOW() - INTERVAL '2 minutes'),
('info', 'Vehicle MH12AB1234 has been activated and approved', false, NOW() - INTERVAL '1 hour'),
('error', 'System maintenance scheduled for tonight at 2:00 AM', false, NOW() - INTERVAL '3 hours'),
('warning', 'Vehicle KA05CD5678 status changed to inactive - requires attention', false, NOW() - INTERVAL '1 day'),
('info', 'New trading partner Maharashtra Traders registered successfully', false, NOW() - INTERVAL '2 days');

-- Insert activities
INSERT INTO public.activities (type, message, time, status, created_at) VALUES
('product', 'New product added by ABC Trading Co.', '2 hours ago', 'success', NOW() - INTERVAL '2 hours'),
('company', 'XYZ Enterprises updated their profile', '4 hours ago', 'info', NOW() - INTERVAL '4 hours'),
('vehicle', 'Vehicle TN-123-ABC registered', '6 hours ago', 'success', NOW() - INTERVAL '6 hours'),
('alert', 'Low inventory alert for Product ID: 456', '8 hours ago', 'warning', NOW() - INTERVAL '8 hours'),
('user', 'New user Alice Brown registered', '1 day ago', 'success', NOW() - INTERVAL '1 day');