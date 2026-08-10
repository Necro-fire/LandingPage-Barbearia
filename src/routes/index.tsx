import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A barra de navegação mobile foi otimizada com rolagem horizontal suave, garantindo que todos os itens fiquem em uma única linha sem quebra de texto, e abreviando "Página da Barbearia" para "Barbearia" exclusivamente em dispositivos móveis.</p>
      </div>
    </>
  );
}

