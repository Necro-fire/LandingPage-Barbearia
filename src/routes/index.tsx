import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>A organização dos elementos na página da barbearia foi corrigida, ajustando o espaçamento e a responsividade do menu de navegação e do botão de agendamento.</p>
      </div>
    </>
  );
}

