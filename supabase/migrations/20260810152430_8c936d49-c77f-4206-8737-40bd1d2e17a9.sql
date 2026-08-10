-- Final attempt at fixing the user and identities to allow login
DO $$
DECLARE
    v_user_id UUID := 'd425f2e3-9495-41ce-98c3-13e50402493b';
BEGIN
    -- 1. Ensure the user exists with authenticated role and aud
    UPDATE auth.users 
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = NULL,
        recovery_token = NULL,
        email_change_token_new = NULL,
        aud = 'authenticated',
        role = 'authenticated',
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"full_name":"Administrador"}',
        updated_at = now()
    WHERE email = 'admin@gmail.com';

    -- 2. If no rows were updated, insert it fresh (though d425f2e3-... should exist)
    IF NOT FOUND THEN
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role
        )
        VALUES (
            v_user_id, '00000000-0000-0000-0000-000000000000', 'admin@gmail.com',
            crypt('admin123', gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}',
            now(), now(), 'authenticated', 'authenticated'
        );
    END IF;

    -- 3. Re-link identity correctly using the user's current ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@gmail.com';
    
    DELETE FROM auth.identities WHERE user_id = v_user_id;
    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    )
    VALUES (
        gen_random_uuid(), 
        v_user_id, 
        jsonb_build_object('sub', v_user_id, 'email', 'admin@gmail.com'), 
        'email', 
        'admin@gmail.com', 
        now(), now(), now()
    );

    -- 4. Clean roles and profile
    DELETE FROM public.user_roles WHERE user_id = v_user_id;
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin');
    
    INSERT INTO public.profiles (id, full_name) 
    VALUES (v_user_id, 'Administrador')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
END $$;