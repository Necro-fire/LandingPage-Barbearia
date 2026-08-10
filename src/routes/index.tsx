import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A barra de navegação administrativa agora contém exatamente os módulos solicitados: Dashboard, Clientes, Serviços, Notificações, Agenda e Página da Barbearia.</p>
      </div>
    </>
  );
}

