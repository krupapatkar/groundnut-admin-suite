-- Enable realtime for companies and vehicles tables
ALTER TABLE public.companies REPLICA IDENTITY FULL;
ALTER TABLE public.vehicles REPLICA IDENTITY FULL;
ALTER TABLE public.cities REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles; 
ALTER PUBLICATION supabase_realtime ADD TABLE public.cities;