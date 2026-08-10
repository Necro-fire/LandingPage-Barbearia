-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_encrypted_pw TEXT;
BEGIN
  -- 1. Remove existing user entirely to avoid metadata conflicts
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
  -- Do NOT delete profile yet, we will link the new user to it or replace it
  DELETE FROM auth.users WHERE email = 'admin@gmail.com';

  -- 2. Create brand new user
  v_encrypted_pw := extensions.crypt('admin123', extensions.gen_salt('bf'));
  
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
    confirmation_token,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'admin@gmail.com',
    v_encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin"}',
    now(),
    now(),
    '',
    ''
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

  -- 4. Create profile (upsert) and role
  INSERT INTO public.profiles (id, full_name)
  VALUES (v_user_id, 'Admin')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Admin';
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin');

END $$;
