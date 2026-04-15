import { useState } from "react";
import { MessageCircle, Instagram, MapPin, Plus, X } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/suabarbearia";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Rua+Augusta+1234+São+Paulo+SP";

const FloatingButtons = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Menu Expandido */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
      >
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-secondary/90 border border-border/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Ver endereço no Google Maps"
        >
          <MapPin className="w-5 h-5" />
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-secondary/90 border border-border/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-pink-400 hover:border-pink-400/40 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <button
          onClick={scrollToContact}
          className="w-12 h-12 rounded-full bg-green-600 border border-green-500/50 flex items-center justify-center text-white hover:bg-green-500 transition-all duration-300 hover:scale-110 shadow-lg shadow-green-600/20"
          aria-label="WhatsApp - Agendar horário"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Botão Principal + */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xl ${
          isOpen
            ? "bg-destructive hover:bg-destructive/90 rotate-45"
            : "bg-primary hover:bg-primary/90"
        }`}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default FloatingButtons;
