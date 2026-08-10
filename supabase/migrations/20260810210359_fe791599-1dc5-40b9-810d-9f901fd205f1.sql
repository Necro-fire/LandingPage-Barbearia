-- Clean repair for admin accounts without assuming profile.email
DO $$
DECLARE
    v_admin_id UUID;
    v_admin123_id UUID;
BEGIN
    -- 1. Setup admin@gmail.com
    SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@gmail.com';
    IF v_admin_id IS NULL THEN
        v_admin_id := gen_random_uuid();
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES ('00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated', 'admin@gmail.com', crypt('admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Administrador"}', now(), now());
    ELSE
        UPDATE auth.users SET encrypted_password = crypt('admin123', gen_salt('bf')), updated_at = now() WHERE id = v_admin_id;
    END IF;

    DELETE FROM auth.identities WHERE user_id = v_admin_id;
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (v_admin_id, v_admin_id, format('{"sub":"%s","email":"%s"}', v_admin_id::text, 'admin@gmail.com')::jsonb, 'email', v_admin_id::text, now(), now(), now());

    -- 2. Setup admin123@gmail.com
    SELECT id INTO v_admin123_id FROM auth.users WHERE email = 'admin123@gmail.com';
    IF v_admin123_id IS NULL THEN
        v_admin123_id := gen_random_uuid();
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES ('00000000-0000-0000-0000-000000000000', v_admin123_id, 'authenticated', 'authenticated', 'admin123@gmail.com', crypt('admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin 123"}', now(), now());
    ELSE
        UPDATE auth.users SET encrypted_password = crypt('admin123', gen_salt('bf')), updated_at = now() WHERE id = v_admin123_id;
    END IF;

    DELETE FROM auth.identities WHERE user_id = v_admin123_id;
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (v_admin123_id, v_admin123_id, format('{"sub":"%s","email":"%s"}', v_admin123_id::text, 'admin123@gmail.com')::jsonb, 'email', v_admin123_id::text, now(), now(), now());

    -- Ensure profiles and roles
    INSERT INTO public.profiles (id, full_name) VALUES (v_admin_id, 'Administrador') ON CONFLICT (id) DO UPDATE SET full_name = 'Administrador';
    INSERT INTO public.profiles (id, full_name) VALUES (v_admin123_id, 'Admin 123') ON CONFLICT (id) DO UPDATE SET full_name = 'Admin 123';
    
    INSERT INTO public.user_roles (user_id, role) VALUES (v_admin_id, 'admin') ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (v_admin123_id, 'admin') ON CONFLICT DO NOTHING;
END $$;
