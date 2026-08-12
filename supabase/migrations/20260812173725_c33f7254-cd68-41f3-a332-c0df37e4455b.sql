-- 1. Modify appointments to allow guests and track their info
ALTER TABLE public.appointments ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- 2. Update RLS for appointments to allow public (anon) inserts
GRANT INSERT ON public.appointments TO anon;
CREATE POLICY "Anon can create appointments" ON public.appointments FOR INSERT TO anon WITH CHECK (true);

-- 3. Ensure profiles are visible to authenticated users (admins)
-- (Already exists in initial migration)

-- 4. Add index for performance on status and guest info
CREATE INDEX IF NOT EXISTS appointments_guest_phone_idx ON public.appointments (guest_phone);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON public.appointments (status);

-- 5. Grant SELECT on appointments to anon (to check availability in front-end)
GRANT SELECT ON public.appointments TO anon;
CREATE POLICY "Anon can view appointments for availability" ON public.appointments FOR SELECT TO anon USING (true);
