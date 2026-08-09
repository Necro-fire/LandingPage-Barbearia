DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typcategory = 'E') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'barber', 'client', 'receptionist', 'manager', 'owner');
  ELSE
    -- Enum already exists, we might need to add new values
    -- Postgres doesn't allow ALTER TYPE ... ADD VALUE inside a transaction block easily,
    -- but for Lovable Cloud migrations this is usually handled.
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'receptionist';
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'owner';
  END IF;
END $$;