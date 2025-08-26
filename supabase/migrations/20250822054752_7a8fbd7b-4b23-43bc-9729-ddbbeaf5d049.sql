-- Add missing RLS policies for all tables to enable full CRUD operations

-- Companies table - add insert, update, delete policies
CREATE POLICY "Public can insert companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update companies" 
ON public.companies 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete companies" 
ON public.companies 
FOR DELETE 
USING (true);

-- Vehicles table - add insert, update, delete policies
CREATE POLICY "Public can insert vehicles" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update vehicles" 
ON public.vehicles 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete vehicles" 
ON public.vehicles 
FOR DELETE 
USING (true);

-- Activities table - add insert, update, delete policies
CREATE POLICY "Public can insert activities" 
ON public.activities 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update activities" 
ON public.activities 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete activities" 
ON public.activities 
FOR DELETE 
USING (true);

-- Alerts table - add insert, update, delete policies
CREATE POLICY "Public can insert alerts" 
ON public.alerts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update alerts" 
ON public.alerts 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete alerts" 
ON public.alerts 
FOR DELETE 
USING (true);

-- Products table - add insert, update, delete policies
CREATE POLICY "Public can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update products" 
ON public.products 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Orders table - add insert, update, delete policies
CREATE POLICY "Public can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update orders" 
ON public.orders 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);

-- Transactions table - add insert, update, delete policies
CREATE POLICY "Public can insert transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update transactions" 
ON public.transactions 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete transactions" 
ON public.transactions 
FOR DELETE 
USING (true);