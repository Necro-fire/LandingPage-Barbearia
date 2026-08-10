DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- Only insert if the user doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      aud,
      role
    )
    VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@gmail.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Administrador"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    -- Grant admin role in user_roles table
    -- First check if the role exists (public.app_role is an enum created in previous turns)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, 'admin');
  END IF;
END $$;