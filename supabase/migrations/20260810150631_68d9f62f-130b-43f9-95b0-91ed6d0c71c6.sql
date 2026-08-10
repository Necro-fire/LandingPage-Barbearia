-- handle_new_user is a trigger function usually called by postgres, but revoking public access is safer
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
