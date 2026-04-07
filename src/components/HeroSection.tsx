import heroImg from "@/assets/hero-barber.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Barbeiro profissional trabalhando"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative z-10 container mx-auto text-center px-4">
        <p className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-primary mb-6 animate-fade-in-up">
          Barbearia & Cabeleireiro
        </p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          CRIE SEU ESTILO<br />
          <span className="text-gold-gradient">CONOSCO</span>
        </h1>
        <p className="font-body text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          Experiência premium em cortes masculinos, barba e tratamentos exclusivos em um ambiente sofisticado.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <a
            href="#contact"
            className="bg-primary text-primary-foreground px-8 py-3.5 text-xs font-body font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Agendar Horário
          </a>
          <a
            href="#services"
            className="border border-primary text-primary px-8 py-3.5 text-xs font-body font-semibold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Nossos Serviços
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
