DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- 1. Get the current admin's ID
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@gmail.com' LIMIT 1;

  -- 2. If admin doesn't exist, this migration is in a weird state, but let's assume it does
  -- because we just created it. If not, we skip the deletion to be safe or recreate.
  
  IF v_admin_id IS NOT NULL THEN
    -- Delete all OTHER user roles
    DELETE FROM public.user_roles WHERE user_id != v_admin_id;
    
    -- Delete all OTHER profiles
    DELETE FROM public.profiles WHERE id != v_admin_id;
    
    -- Delete all OTHER identities
    DELETE FROM auth.identities WHERE user_id != v_admin_id;
    
    -- Delete all OTHER users
    DELETE FROM auth.users WHERE id != v_admin_id;
    
    -- Ensure the admin user has the admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_admin_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;