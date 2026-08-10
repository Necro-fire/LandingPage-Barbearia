-- Revoke public execute rights on security definer functions to prevent authenticated users from calling them directly
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_barber_owner(uuid, uuid) FROM PUBLIC, authenticated;

-- Grant access to service_role specifically
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_barber_owner(uuid, uuid) TO service_role;
