-- Create product_details table for detailed measurements and specifications
CREATE TABLE public.product_details (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_slip TEXT,
    bardan NUMERIC NOT NULL DEFAULT 0,
    kad NUMERIC NOT NULL DEFAULT 0,
    bag INTEGER NOT NULL DEFAULT 0,
    bag_breakdown JSONB, -- Store individual bag values as JSON
    gross_weight NUMERIC NOT NULL DEFAULT 0,
    net_weight NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.product_details ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching your existing pattern)
CREATE POLICY "Allow public read access to product_details" 
ON public.product_details 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert product_details" 
ON public.product_details 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update product_details" 
ON public.product_details 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete product_details" 
ON public.product_details 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_details_updated_at
BEFORE UPDATE ON public.product_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_product_details_product_id ON public.product_details(product_id);
CREATE INDEX idx_product_details_product_slip ON public.product_details(product_slip);
CREATE INDEX idx_product_details_created_at ON public.product_details(created_at);

-- Insert sample data to match your existing interface
INSERT INTO public.product_details (product_id, product_slip, bardan, kad, bag, bag_breakdown, gross_weight, net_weight) VALUES
-- For existing products from your data
((SELECT id FROM public.products WHERE slip_number = 'SL001' LIMIT 1), 'SL001', 2.5, 1.8, 50, '{"bag1": 25, "bag2": 25}', 2500.00, 2450.00),
((SELECT id FROM public.products WHERE slip_number = 'SL001' LIMIT 1), 'SL001', 2.3, 1.9, 50, '{"bag1": 30, "bag2": 20}', 2500.00, 2460.00),
((SELECT id FROM public.products WHERE slip_number = 'SL002' LIMIT 1), 'SL002', 2.4, 1.7, 75, '{"bag1": 25, "bag2": 25, "bag3": 25}', 3750.00, 3720.00),
((SELECT id FROM public.products WHERE slip_number = 'SL002' LIMIT 1), 'SL002', 10, 10, 200, '{"bag1": 100, "bag2": 100}', 10, 10);