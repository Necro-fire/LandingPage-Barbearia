-- Create a table for shop-wide schedule exceptions if it doesn't exist
CREATE TABLE IF NOT EXISTS public.schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    is_closed BOOLEAN DEFAULT false,
    start_time TIME,
    end_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_exceptions TO authenticated;
GRANT ALL ON public.schedule_exceptions TO service_role;
ALTER TABLE public.schedule_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage exceptions" ON public.schedule_exceptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view exceptions" ON public.schedule_exceptions FOR SELECT TO anon USING (true);

-- Ensure settings table has proper grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;

-- Seed default shop hours in settings
INSERT INTO public.settings (key, value, is_public)
VALUES ('shop_working_hours', '{
    "0": {"active": false},
    "1": {"active": true, "hours": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}]},
    "2": {"active": true, "hours": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}]},
    "3": {"active": true, "hours": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}]},
    "4": {"active": true, "hours": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}]},
    "5": {"active": true, "hours": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}]},
    "6": {"active": true, "hours": [{"start": "08:00", "end": "16:00"}]}
}'::jsonb, true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
