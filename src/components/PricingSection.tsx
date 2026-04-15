const prices = [
  { service: "Corte Masculino", price: "R$ 60" },
  { service: "Barba Completa", price: "R$ 45" },
  { service: "Corte + Barba", price: "R$ 90" },
  { service: "Sobrancelha", price: "R$ 25" },
  { service: "Tratamento Capilar", price: "R$ 80" },
  { service: "Coloração", price: "R$ 120" },
  { service: "Hidratação", price: "R$ 55" },
  { service: "Dia do Noivo", price: "R$ 200" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Investimento</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Tabela de Preços</h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="glass-card-glow rounded-2xl p-8 md:p-12">
          {prices.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-4 px-4 -mx-4 rounded-lg cursor-default transition-all duration-300 hover:scale-[1.02] hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(191,155,81,0.08)] ${
                i < prices.length - 1 ? "border-b" : ""
              }`}
              style={{ borderColor: "var(--glass-border)" }}
            >
              <span className="font-body text-sm text-foreground">{item.service}</span>
              <span className="font-heading text-lg font-semibold text-primary">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
