import { NavLink, useLocation } from "react-router-dom";
import { NAV_GROUPS } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BarbershopConfirmModal } from "./BarbershopConfirmModal";

export function MobileNav() {
  const { pathname } = useLocation();
  const { can } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const allItems = NAV_GROUPS.flatMap(group => group.items);

  const isActive = (url: string) => (url === "/app" ? pathname === "/app" : pathname.startsWith(url));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-16 items-center overflow-x-auto border-t border-border bg-background/95 px-4 backdrop-blur-xl md:hidden scrollbar-hide">
      <div className="flex min-w-full items-center justify-between gap-4 py-1">
        {allItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/app"}
            onClick={(e) => {
              if (item.url === "/") {
                e.preventDefault();
                setShowConfirm(true);
              }
            }}
            className={({ isActive: linkActive }) => cn(
              "flex flex-col items-center justify-center gap-1 shrink-0 px-2 py-1 transition-colors whitespace-nowrap",
              isActive(item.url) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">
              {item.title === "Página da Barbearia" ? "Barbearia" : item.title}
            </span>
          </NavLink>
        ))}
      </div>

      <BarbershopConfirmModal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          window.open("/", "_blank");
        }}
      />
    </nav>
  );
}
