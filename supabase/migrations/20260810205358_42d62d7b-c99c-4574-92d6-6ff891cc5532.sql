DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. Remove ANY trace of admin@gmail.com
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM auth.users WHERE email = 'admin@gmail.com';

  -- 2. Create brand new user
  -- confirmed_at is generated, so we omit it.
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
    -- Standard bcrypt for 'admin123'
    '$2a$10$U5l9kFkYmE2XvP4iXb4zueq1x8uB.k1mF8iX9xGj5Rj1Q5m4d7d3m', 
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin"}',
    now(),
    now(),
    false
  );

  -- 3. Create identity correctly linked
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

  -- 4. Sync public.profiles (simulating handle_new_user behavior to be safe)
  INSERT INTO public.profiles (id, full_name)
  VALUES (v_user_id, 'Admin')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
  
  -- 5. Set role to admin (override any default 'client' role if trigger fired)
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin');

END $$;