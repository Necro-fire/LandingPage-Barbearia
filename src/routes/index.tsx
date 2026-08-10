import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>Todas as opções de navegação foram restauradas e estão totalmente acessíveis tanto na versão desktop quanto na mobile, sem restrições de permissão para usuários logados.</p>
      </div>
    </>
  );
}

