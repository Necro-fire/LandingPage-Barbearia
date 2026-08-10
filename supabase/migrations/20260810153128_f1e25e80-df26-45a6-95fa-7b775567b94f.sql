DO $$
DECLARE
  v_user_id UUID := 'd425f2e3-9495-41ce-98c3-13e50402493b';
BEGIN
  -- Update user password
  UPDATE auth.users 
  SET encrypted_password = crypt('admin123', gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at = now()
  WHERE id = v_user_id;

  -- Fix identity
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

  -- Ensure role
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin');

END $$;
