-- Final try with manual identity ID and properly handling existing profile
DO $$
DECLARE
    v_user_id UUID := 'd425f2e3-9495-41ce-98c3-13e50402493b';
BEGIN
    -- Delete everything first
    DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
    DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
    DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
    DELETE FROM auth.users WHERE email = 'admin@gmail.com';

    -- Fresh insert
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

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, format('{"sub":"%s","email":"admin@gmail.com"}', v_user_id)::jsonb, 'email', 'admin@gmail.com', now(), now(), now());

    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin');
    
    INSERT INTO public.profiles (id, full_name) 
    VALUES (v_user_id, 'Administrador')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

END $$;