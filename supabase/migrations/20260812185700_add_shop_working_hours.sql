CREATE TABLE IF NOT EXISTS public.shop_working_hours (
  weekday SMALLINT PRIMARY KEY CHECK (weekday BETWEEN 0 AND 6),
  active BOOLEAN NOT NULL DEFAULT true,
  intervals JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {start: "HH:mm", end: "HH:mm"}
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shop_working_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_working_hours TO authenticated;
GRANT ALL ON public.shop_working_hours TO service_role;
ALTER TABLE public.shop_working_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shop working hours are public" ON public.shop_working_hours FOR SELECT USING (true);
CREATE POLICY "Admins manage shop working hours" ON public.shop_working_hours FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Initialize with default values
INSERT INTO public.shop_working_hours (weekday, active, intervals) VALUES
(0, false, '[]'),
(1, true, '[{"start": "09:00", "end": "18:00"}]'),
(2, true, '[{"start": "09:00", "end": "18:00"}]'),
(3, true, '[{"start": "09:00", "end": "18:00"}]'),
(4, true, '[{"start": "09:00", "end": "18:00"}]'),
(5, true, '[{"start": "09:00", "end": "18:00"}]'),
(6, true, '[{"start": "09:00", "end": "14:00"}]')
ON CONFLICT (weekday) DO NOTHING;
