import { Scissors, SprayCan } from "lucide-react";
import serviceImg from "@/assets/service-shaving.jpg";

const services = [
  { icon: Scissors, title: "Corte Masculino", desc: "Cortes modernos e clássicos adaptados ao seu estilo pessoal." },
  { icon: SprayCan, title: "Barba", desc: "Modelagem e aparação com navalha e produtos premium." },
  { icon: Scissors, title: "Corte + Barba", desc: "Combo completo para um visual impecável de ponta a ponta." },
  { icon: SprayCan, title: "Tratamento Capilar", desc: "Hidratação profunda e tratamentos para cabelos saudáveis." },
  { icon: Scissors, title: "Coloração", desc: "Mechas, luzes e coloração personalizada com técnica refinada." },
  { icon: SprayCan, title: "Design de Sobrancelha", desc: "Alinhamento e design masculino para um olhar marcante." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">O que oferecemos</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Nossos Serviços</h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="group bg-card p-8 border border-border hover:border-primary/40 transition-all duration-500"
            >
              <s.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 relative overflow-hidden h-64 md:h-80">
          <img
            src={serviceImg}
            alt="Serviço de barbearia"
            className="w-full h-full object-cover"
            loading="lazy"
            width={640}
            height={640}
          />
          <div className="absolute inset-0 bg-background/40" />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
