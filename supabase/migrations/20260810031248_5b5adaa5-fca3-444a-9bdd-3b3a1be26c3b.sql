DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Get the user ID by email
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@teste.com';

    IF v_user_id IS NOT NULL THEN
        -- Update the password and metadata for the existing user
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('admin123', gen_salt('bf')),
            email_confirmed_at = now(),
            updated_at = now(),
            raw_user_meta_data = '{"full_name":"Admin Teste"}'
        WHERE id = v_user_id;

        -- Ensure profile exists and is updated
        INSERT INTO public.profiles (id, full_name, created_at, updated_at)
        VALUES (v_user_id, 'Admin Teste', now(), now())
        ON CONFLICT (id) DO UPDATE SET
            full_name = 'Admin Teste',
            updated_at = now();

        -- Ensure role exists
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'owner')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;