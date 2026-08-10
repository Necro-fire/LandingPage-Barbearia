-- Check if the user exists and update or create
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Try to find existing user by email
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@gmail.com';

    IF v_user_id IS NOT NULL THEN
        -- Update existing user password to 'admin123'
        UPDATE auth.users 
        SET encrypted_password = crypt('admin123', gen_salt('bf'))
        WHERE id = v_user_id;
    ELSE
        -- Create new user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@gmail.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Administrador"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        )
        RETURNING id INTO v_user_id;
    END IF;

    -- Ensure identity exists
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_user_id) THEN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        )
        VALUES (
            v_user_id,
            v_user_id,
            format('{"sub":"%s","email":"%s"}', v_user_id::text, 'admin@gmail.com')::jsonb,
            'email',
            now(),
            now(),
            now()
        );
    END IF;

    -- Ensure profile exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
        INSERT INTO public.profiles (id, full_name, email)
        VALUES (v_user_id, 'Administrador', 'admin@gmail.com');
    END IF;

    -- Ensure user_roles exists
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'admin') THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin');
    END IF;
END $$;
