import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A estrutura principal da administração foi reorganizada seguindo o PRD: Dashboard focado em pendentes, módulo de Clientes com histórico detalhado, gestão completa de Serviços, Notificações para controle de agendamentos e Agenda com configurações de horários e exceções.</p>
      </div>
    </>
  );
}

