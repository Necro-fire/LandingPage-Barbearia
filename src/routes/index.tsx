import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A barra de navegação mobile foi fixada permanentemente na base da tela com alta prioridade de camada para evitar qualquer movimento indesejado durante a rolagem.</p>
      </div>
    </>
  );
}

