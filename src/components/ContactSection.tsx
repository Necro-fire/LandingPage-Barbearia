import { Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", service: "" });

  return (
    <section id="contact" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Fale conosco</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Agende seu Horário</h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <form className="glass-card-glow rounded-2xl p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="tel"
              placeholder="Telefone / WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-5 py-3.5 text-sm font-body text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-5 py-3.5 text-sm font-body text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-5 py-3.5 text-sm font-body text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="">Selecione o serviço</option>
              <option value="corte">Corte Masculino</option>
              <option value="barba">Barba Completa</option>
              <option value="combo">Corte + Barba</option>
              <option value="tratamento">Tratamento Capilar</option>
              <option value="coloracao">Coloração</option>
            </select>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 text-xs font-body font-semibold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
            >
              Confirmar Agendamento
            </button>
          </form>

          <div className="space-y-6 flex flex-col justify-center">
            {[
              { icon: MapPin, title: "Endereço", text: "Centro, Teresina PI" },
              { icon: Phone, title: "Telefone", text: "(86) 9 9999-0000" },
              { icon: Clock, title: "Horário", text: "Seg–Sáb: 9h às 20h | Dom: Fechado" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 glass-card rounded-xl p-5">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="font-body text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
