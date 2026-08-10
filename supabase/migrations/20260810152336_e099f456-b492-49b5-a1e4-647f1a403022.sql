-- Force only one role (admin) for admin@gmail.com
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@gmail.com';
    
    IF v_user_id IS NOT NULL THEN
        -- Remove any duplicate or client roles
        DELETE FROM public.user_roles WHERE user_id = v_user_id;
        
        -- Insert strictly one admin role
        INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin');
        
        -- Ensure profile exists
        INSERT INTO public.profiles (id, full_name) 
        VALUES (v_user_id, 'Administrador')
        ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
    END IF;
END $$;