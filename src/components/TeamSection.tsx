import barber1 from "@/assets/barber-1.jpg";
import barber2 from "@/assets/barber-2.jpg";
import barber3 from "@/assets/barber-3.jpg";

const team = [
  { name: "Carlos Mendes", role: "Master Barber", img: barber1 },
  { name: "Rafael Torres", role: "Barbeiro Sênior", img: barber2 },
  { name: "Lucas Ferreira", role: "Especialista em Barba", img: barber3 },
];

const TeamSection = () => {
  return (
    <section id="team" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Conheça</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Nossa Equipe</h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <div key={i} className="group text-center">
              <div className="relative overflow-hidden mb-5 aspect-[4/5]">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={640}
                  height={800}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="font-body text-xs tracking-widest uppercase text-primary mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
