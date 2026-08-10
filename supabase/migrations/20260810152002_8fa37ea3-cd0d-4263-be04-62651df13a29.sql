-- Reseting password for admin@gmail.com and ensuring role
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@gmail.com';
    
    IF v_user_id IS NOT NULL THEN
        -- Update password to admin123
        UPDATE auth.users 
        SET encrypted_password = crypt('admin123', gen_salt('bf')),
            email_confirmed_at = now(),
            updated_at = now()
        WHERE id = v_user_id;

        -- Clean up roles
        DELETE FROM public.user_roles WHERE user_id = v_user_id AND role = 'client';
        
        -- Ensure admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;