-- Fix the products table insert by linking with proper foreign keys

-- First, let's fix the data by updating the products with correct foreign key references
-- Get company and vehicle IDs and update the products table

-- Update company_id for products
UPDATE public.products 
SET company_id = (SELECT id FROM public.companies WHERE name = products.company_name)
WHERE company_id IS NULL;

-- Update vehicle_id for products  
UPDATE public.products 
SET vehicle_id = (SELECT id FROM public.vehicles WHERE number = products.vehicle_number)
WHERE vehicle_id IS NULL;

-- Update company_id for vehicles
UPDATE public.vehicles 
SET company_id = (SELECT id FROM public.companies WHERE name = vehicles.company_name)
WHERE company_id IS NULL;

-- Update location_id for companies
UPDATE public.companies 
SET location_id = (SELECT id FROM public.cities WHERE name = companies.location_name)
WHERE location_id IS NULL;

-- Insert orders with proper product references
INSERT INTO public.orders (product_id, status, amount, created_at) 
SELECT p.id, 'pending', 260000.00, '2024-08-19'
FROM public.products p WHERE p.slip_number = 'SL001';

INSERT INTO public.orders (product_id, status, amount, created_at) 
SELECT p.id, 'pending', 405000.00, '2024-08-18'
FROM public.products p WHERE p.slip_number = 'SL002';

INSERT INTO public.orders (product_id, status, amount, created_at) 
SELECT p.id, 'completed', 500000.00, '2024-08-17'
FROM public.products p WHERE p.slip_number = 'SL003';

INSERT INTO public.orders (product_id, status, amount, created_at) 
SELECT p.id, 'pending', 150000.00, '2024-08-16'
FROM public.products p WHERE p.slip_number = 'SL001';