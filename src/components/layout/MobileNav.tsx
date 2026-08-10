import { NavLink, useLocation } from "react-router-dom";
import { NAV_GROUPS } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { pathname } = useLocation();
  const { can } = useAuth();

  const allItems = NAV_GROUPS.flatMap(group => group.items);
  // Removida filtragem de permissão e limite para garantir que todos os itens apareçam no mobile

  const isActive = (url: string) => (url === "/app" ? pathname === "/app" : pathname.startsWith(url));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around overflow-x-auto border-t border-border bg-background/80 px-2 backdrop-blur-xl md:hidden scrollbar-hide">
      {allItems.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          end={item.url === "/app"}
          className={({ isActive: linkActive }) => cn(
            "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1 transition-colors",
            isActive(item.url) ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
