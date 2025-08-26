-- Create policies to allow public read access to all tables

-- Cities table
CREATE POLICY "Allow public read access to cities" 
ON public.cities 
FOR SELECT 
USING (true);

-- Companies table  
CREATE POLICY "Allow public read access to companies"
ON public.companies 
FOR SELECT 
USING (true);

-- Users table
CREATE POLICY "Allow public read access to users"
ON public.users 
FOR SELECT 
USING (true);

-- Vehicles table
CREATE POLICY "Allow public read access to vehicles"
ON public.vehicles 
FOR SELECT 
USING (true);

-- Products table
CREATE POLICY "Allow public read access to products"
ON public.products 
FOR SELECT 
USING (true);

-- Orders table
CREATE POLICY "Allow public read access to orders"
ON public.orders 
FOR SELECT 
USING (true);

-- Transactions table
CREATE POLICY "Allow public read access to transactions"
ON public.transactions 
FOR SELECT 
USING (true);

-- Activities table
CREATE POLICY "Allow public read access to activities"
ON public.activities 
FOR SELECT 
USING (true);

-- System alerts table
CREATE POLICY "Allow public read access to system_alerts"
ON public.system_alerts 
FOR SELECT 
USING (true);