DO $$
DECLARE
    v_user_id uuid := 'b3a94072-9d71-4080-89f4-7d447e8a8316';
BEGIN
    -- Force set the password to 'admin123'
    UPDATE auth.users 
    SET 
        encrypted_password = crypt('admin123', gen_salt('bf')),
        email_confirmed_at = now(),
        updated_at = now(),
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"full_name":"Admin Teste"}'
    WHERE id = v_user_id;

    -- Ensure profile exists
    INSERT INTO public.profiles (id, full_name, updated_at)
    VALUES (v_user_id, 'Admin Teste', now())
    ON CONFLICT (id) DO UPDATE SET
        full_name = 'Admin Teste',
        updated_at = now();

    -- Ensure role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
END $$;