import { MessageCircle, Instagram, MapPin } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/suabarbearia";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Rua+Augusta+1234+São+Paulo+SP";

const FloatingButtons = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-secondary/80 border border-border/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 hover:scale-110 shadow-lg"
        aria-label="Ver endereço no Google Maps"
      >
        <MapPin className="w-5 h-5" />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-secondary/80 border border-border/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-pink-400 hover:border-pink-400/40 transition-all duration-300 hover:scale-110 shadow-lg"
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
  );
};

export default FloatingButtons;
