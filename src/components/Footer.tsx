import { Scissors } from "lucide-react";

const Footer = () => (
  <footer className="py-10 px-4" style={{ background: 'hsl(0 0% 4%)', borderTop: '1px solid var(--glass-border)' }}>
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <a href="#hero" className="flex items-center gap-2">
        <Scissors className="w-5 h-5 text-primary" />
        <span className="font-heading text-lg font-bold tracking-wider text-foreground">
          B<span className="text-primary">A</span>RBER
        </span>
      </a>
      <p className="font-body text-xs text-muted-foreground tracking-wide">
        © 2025 BARBER. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
