DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. Remove ANY trace of admin@gmail.com
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM auth.users WHERE email = 'admin@gmail.com';

  -- 2. Create brand new user with verified bcrypt hash for 'admin123'
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_super_admin
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'admin@gmail.com',
    '$2a$10$U5l9kFkYmE2XvP4iXb4zueq1x8uB.k1mF8iX9xGj5Rj1Q5m4d7d3m', 
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin"}',
    now(),
    now(),
    false
  );

  -- 3. Create identity
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    format('{"sub":"%s","email":"%s"}', v_user_id, 'admin@gmail.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  -- 4. Create profile and role with UPSERT just in case
  INSERT INTO public.profiles (id, full_name)
  VALUES (v_user_id, 'Admin')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

END $$;