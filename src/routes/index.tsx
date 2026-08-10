import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>Todos os usuários autenticados agora possuem acesso irrestrito a todos os módulos e funcionalidades do sistema.</p>
      </div>
    </>
  );
}

