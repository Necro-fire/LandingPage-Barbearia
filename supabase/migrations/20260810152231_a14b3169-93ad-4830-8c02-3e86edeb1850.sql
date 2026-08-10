-- Refined reset for admin user with proper identities fields
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- 1. Get User
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@gmail.com';
    
    IF v_user_id IS NOT NULL THEN
        -- Update existing user to ensure known state
        UPDATE auth.users 
        SET encrypted_password = crypt('admin123', gen_salt('bf')),
            email_confirmed_at = now(),
            updated_at = now(),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}',
            aud = 'authenticated',
            role = 'authenticated'
        WHERE id = v_user_id;

        -- 2. Ensure Identity (Supabase auth needs this for providers)
        -- The identities table has provider_id which is typically the user's ID or email for the 'email' provider
        DELETE FROM auth.identities WHERE user_id = v_user_id;
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES (
            gen_random_uuid(), 
            v_user_id, 
            format('{"sub":"%s","email":"admin@gmail.com"}', v_user_id)::jsonb, 
            'email', 
            v_user_id::text, -- Using user_id as provider_id for email provider
            now(), now(), now()
        );

        -- 3. Ensure Profile
        INSERT INTO public.profiles (id, full_name)
        VALUES (v_user_id, 'Administrador')
        ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

        -- 4. Ensure Role (Admin only)
        DELETE FROM public.user_roles WHERE user_id = v_user_id;
        INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin');
    END IF;
END $$;