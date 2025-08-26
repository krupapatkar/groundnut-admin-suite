-- Enable RLS (safety) and add permissive write policies for demo use
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow anon (public) to write users
CREATE POLICY "Public can insert users"
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Public can update users"
ON public.users
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete users"
ON public.users
FOR DELETE
TO anon
USING (true);

-- Allow anon (public) to write cities
CREATE POLICY "Public can insert cities"
ON public.cities
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Public can update cities"
ON public.cities
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete cities"
ON public.cities
FOR DELETE
TO anon
USING (true);

-- Ensure updated_at is maintained automatically
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cities_updated_at') THEN
    CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON public.cities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;