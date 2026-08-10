DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. Remove ANY trace of admin@gmail.com to start fresh
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM auth.users WHERE email = 'admin@gmail.com';

  -- 2. Create user with absolutely minimum fields to let Supabase Auth handle defaults
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    email_confirmed_at
  )
  VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@gmail.com',
    '$2a$10$U5l9kFkYmE2XvP4iXb4zueq1x8uB.k1mF8iX9xGj5Rj1Q5m4d7d3m', -- admin123
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin"}',
    'authenticated',
    'authenticated',
    now(),
    now(),
    now()
  );

  -- 3. Identity is essential for login
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

  -- 4. Sync public data
  -- The trigger handle_new_user might have run, but we UPSERT to be sure
  INSERT INTO public.profiles (id, full_name)
  VALUES (v_user_id, 'Admin')
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
  
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin');

END $$;