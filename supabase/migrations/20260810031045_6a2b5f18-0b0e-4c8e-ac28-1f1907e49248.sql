CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf')) 
WHERE email = 'admin@teste.com';

-- Garante que o perfil e o papel existam corretamente
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'admin@teste.com';
  
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name)
    VALUES (target_user_id, 'Admin Temporário')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
