import { supabase } from "@/integrations/supabase/client";

interface AuditEntry {
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/** Registra uma ação na trilha de auditoria (silencioso em caso de falha). */
export async function logAudit({ action, entity, entityId, metadata = {} }: AuditEntry) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  await supabase.from("audit_logs").insert({
    user_id: data.user.id,
    action,
    entity: entity ?? null,
    entity_id: entityId ?? null,
    metadata: metadata as never,
  });
}
