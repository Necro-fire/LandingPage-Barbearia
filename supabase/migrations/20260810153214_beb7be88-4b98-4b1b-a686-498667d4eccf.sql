-- Enable pgcrypto if not present
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

DO $$
DECLARE
  v_user_id UUID := 'd425f2e3-9495-41ce-98c3-13e50402493b';
  v_encrypted_pw TEXT;
BEGIN
  -- Generate hash for 'admin123'
  v_encrypted_pw := extensions.crypt('admin123', extensions.gen_salt('bf'));

  -- Update user in auth.users
  UPDATE auth.users 
  SET encrypted_password = v_encrypted_pw,
      email_confirmed_at = now(),
      updated_at = now(),
      last_sign_in_at = NULL,
      raw_app_meta_data = '{"provider":"email","providers":["email"]}',
      raw_user_meta_data = '{"full_name":"Admin"}'
  WHERE id = v_user_id;

  -- Fix identity linkage
  DELETE FROM auth.identities WHERE user_id = v_user_id;
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

  -- Ensure proper role mapping
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin');

END $$;
