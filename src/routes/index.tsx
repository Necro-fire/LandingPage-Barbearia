import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A estrutura da administração da barbearia foi organizada em seis módulos independentes: Dashboard, Clientes, Serviços, Notificações, Agenda e Página da Barbearia, garantindo uma gestão clara e eficiente.</p>
      </div>
    </>
  );
}

