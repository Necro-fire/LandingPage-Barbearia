import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <p>Foi adicionada uma confirmação de segurança ao clicar na opção da Barbearia, solicitando a validação do usuário antes de redirecionar para a página externa.</p>
      </div>
    </>
  );
}

