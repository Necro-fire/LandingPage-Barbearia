import { Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", service: "" });

  return (
    <section id="contact" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">Fale conosco</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Agende seu Horário</h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              placeholder="Telefone / WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full bg-card border border-border px-5 py-3.5 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors"
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
              className="w-full bg-primary text-primary-foreground py-3.5 text-xs font-body font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Confirmar Agendamento
            </button>
          </form>

          <div className="space-y-8">
            {[
              { icon: MapPin, title: "Endereço", text: "Rua Augusta, 1234 — São Paulo, SP" },
              { icon: Phone, title: "Telefone", text: "(11) 99999-0000" },
              { icon: Clock, title: "Horário", text: "Seg–Sáb: 9h às 20h | Dom: Fechado" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-card border border-border flex-shrink-0">
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
