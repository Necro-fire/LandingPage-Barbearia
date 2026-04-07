import { useState } from "react";
import { Scissors, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Serviços", href: "#services" },
  { label: "Equipe", href: "#team" },
  { label: "Preços", href: "#pricing" },
  { label: "Sobre", href: "#about" },
  { label: "Contato", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-transparent" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <a href="#hero" className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-wider text-foreground">
            B<span className="text-primary">A</span>RBER
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:inline-flex bg-primary text-primary-foreground px-6 py-2.5 text-xs font-body font-semibold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
        >
          Agendar
        </a>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md px-4 pb-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block mt-4 bg-primary text-primary-foreground px-6 py-3 text-xs font-body font-semibold uppercase tracking-widest text-center rounded-lg"
          >
            Agendar
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
