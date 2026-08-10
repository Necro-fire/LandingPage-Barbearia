import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A barra de navegação mobile foi bloqueada para rolagem lateral, tornando-se estática e fixa no rodapé para evitar movimentação com o toque ou mouse.</p>
      </div>
    </>
  );
}

