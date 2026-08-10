import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Scissors } from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAV_GROUPS } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { can } = useAuth();

  const handleBarbershopClick = (e: React.MouseEvent, url: string) => {
    if (url === "/") {
      e.preventDefault();
      if (window.confirm("Você deseja realmente ir para a página da barbearia?")) {
        window.open(url, "_blank");
      }
    }
  };

  const isActive = (url: string) => (url === "/app" ? pathname === "/app" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-16 justify-center px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Scissors className="h-5 w-5" />
          </span>
          {!collapsed && <span className="font-heading text-lg tracking-wide">ON-TESTE</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => {
          const items = group.items; // Mostra todos os itens independentemente de permissão, conforme solicitado acessibilidade total
          if (!items.length) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <NavLink 
                          to={item.url} 
                          end={item.url === "/app"} 
                          onClick={(e) => handleBarbershopClick(e, item.url)}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
