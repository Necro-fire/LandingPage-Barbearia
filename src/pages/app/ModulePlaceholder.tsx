import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  note?: string;
}

export function ModulePlaceholder({ title, description, icon, note }: ModulePlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title="Módulo preparado"
        description={note ?? "A estrutura deste módulo está pronta. As funcionalidades serão implementadas na próxima etapa."}
      />
    </div>
  );
}
