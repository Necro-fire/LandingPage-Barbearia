import { Scissors, MapPin, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FloatingButtons() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Endereço",
      href: "https://maps.google.com",
      color: "bg-blue-600",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
      href: "https://instagram.com",
      color: "bg-pink-600",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "WhatsApp",
      href: "https://wa.me/5500000000000",
      color: "bg-green-600",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {actions.map((action, i) => (
            <a
              key={i}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="rounded-lg bg-card/80 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 md:opacity-0">
                {action.label}
              </span>
              <Button
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-110",
                  action.color
                )}
              >
                {action.icon}
              </Button>
            </a>
          ))}
        </div>
      )}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300",
          isOpen ? "rotate-45 bg-destructive" : "bg-primary"
        )}
      >
        <span className="text-2xl font-bold">+</span>
      </Button>
    </div>
  );
}
