import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p># PRD — Estrutura Principal da Administração da Barbearia...</p>
      </div>
    </>
  );
}

