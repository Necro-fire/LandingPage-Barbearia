import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/permissions";
import { initials } from "@/lib/format";

export default function Profile() {
  const { profile, user, roles } = useAuth();

  return (
    <div>
      <PageHeader title="Meu perfil" description="Dados da sua conta no sistema." />
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials(profile?.full_name ?? user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left">
            <p className="font-heading text-xl">{profile?.full_name ?? "Sem nome cadastrado"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {profile?.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
            <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
              {roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
