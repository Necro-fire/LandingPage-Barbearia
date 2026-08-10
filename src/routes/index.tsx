import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>As opções de navegação foram restauradas e estão agora visíveis para todos os usuários autenticados na barra lateral.</p>
      </div>
    </>
  );
}

