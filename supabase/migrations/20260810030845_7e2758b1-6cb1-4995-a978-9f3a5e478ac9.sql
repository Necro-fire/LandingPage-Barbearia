-- Esta migração cria um usuário administrador temporário.
-- O e-mail é admin@teste.com e a senha é 'admin123'.

-- 1. Inserir o usuário no auth.users se ele não existir
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
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@teste.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Temporário"}',
  now(),
  now(),
  'authenticated',
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@teste.com'
);

-- 2. Garantir que o perfil e o papel existam
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'admin@teste.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Inserir no perfil (removido a coluna 'email' que não existe na tabela public.profiles)
    INSERT INTO public.profiles (id, full_name)
    VALUES (target_user_id, 'Admin Temporário')
    ON CONFLICT (id) DO NOTHING;

    -- 3. Atribuir o papel de 'owner' (proprietário)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
