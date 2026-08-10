
-- Add guest fields to appointments
ALTER TABLE public.appointments ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- Grants for public access
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.barbers TO anon;
GRANT SELECT ON public.working_hours TO anon;
GRANT SELECT ON public.schedule_exceptions TO anon;
GRANT INSERT ON public.appointments TO anon;

-- RLS Policies for public access
-- Services
CREATE POLICY "Anyone can view active services" ON public.services
    FOR SELECT USING (is_active = true);

-- Barbers
CREATE POLICY "Anyone can view active barbers" ON public.barbers
    FOR SELECT USING (is_active = true);

-- Working Hours
CREATE POLICY "Anyone can view working hours" ON public.working_hours
    FOR SELECT USING (true);

-- Schedule Exceptions
CREATE POLICY "Anyone can view schedule exceptions" ON public.schedule_exceptions
    FOR SELECT USING (true);

-- Appointments (Allow anyone to check availability and insert)
CREATE POLICY "Anyone can view appointment slots for availability" ON public.appointments
    FOR SELECT TO anon USING (true); -- Only used for availability checks in the app

CREATE POLICY "Anyone can create appointments" ON public.appointments
    FOR INSERT TO anon WITH CHECK (true);
