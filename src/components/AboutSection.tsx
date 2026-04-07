import aboutImg from "@/assets/about-barbershop.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding" style={{ background: 'hsl(0 0% 7%)' }}>
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative overflow-hidden aspect-[3/2] rounded-2xl soft-shadow">
            <img src={aboutImg} alt="Interior da barbearia" className="w-full h-full object-cover" loading="lazy" width={1280} height={864} />
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Quem somos</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Sobre Nós</h2>
            <div className="gold-line mb-8" />
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Desde 2015, a BARBER é referência em cortes masculinos e cuidados com a barba. 
              Nosso espaço foi projetado para proporcionar uma experiência única, onde tradição 
              e modernidade se encontram.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              Cada detalhe — das cadeiras de couro aos produtos selecionados — foi pensado 
              para que você se sinta em casa enquanto cuidamos do seu visual com a excelência 
              que você merece.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { num: "10+", label: "Anos" },
                { num: "15k", label: "Clientes" },
                { num: "5", label: "Experts" },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-4 text-center">
                  <p className="font-heading text-2xl md:text-3xl font-bold text-primary">{stat.num}</p>
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
