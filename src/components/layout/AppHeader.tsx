import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/lib/permissions";
import { initials } from "@/lib/format";

export function AppHeader() {
  const { profile, user, roles, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="rounded-xl" />

      <div className="ml-1 hidden flex-1 md:block">
        <GlobalSearch />
      </div>
      <div className="flex-1 md:hidden" />

      <ThemeToggle />

      <Button variant="ghost" size="icon" className="relative rounded-xl" asChild aria-label="Notificações">
        <Link to="/app/notificacoes">
          <Bell className="h-5 w-5" />
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 rounded-xl px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {initials(profile?.full_name ?? user?.email)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[140px] truncate text-sm md:inline">
              {profile?.full_name ?? user?.email ?? "Conta"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuLabel className="space-y-1">
            <p className="truncate text-sm">{profile?.full_name ?? user?.email}</p>
            <div className="flex flex-wrap gap-1">
              {roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-[10px]">
                  {ROLE_LABELS[role]}
                </Badge>
              ))}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/app/perfil")}>
            <UserIcon className="mr-2 h-4 w-4" /> Meu perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              navigate("/auth");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
