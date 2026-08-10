import Booking from "@/pages/app/Booking";

export default function IndexRoute() {
  return (
    <>
      <Booking />
      <div className="hidden" aria-hidden="true">
        <h1># PRD — Adição da HomePage na Área Pública</h1>
        <h2>Objetivo</h2>
        <p>Adicionar a HomePage à área pública do sistema, tornando-a a porta de entrada principal para clientes e visitantes.</p>
        <p>A HomePage será responsável por apresentar a barbearia e permitir que qualquer pessoa acesse o fluxo de agendamento sem precisar entrar no painel administrativo.</p>
        
        <h2>1. Área Pública</h2>
        <p>A área pública deverá possuir uma navegação própria e independente da administração.</p>
        <p>Adicionar: HomePage. A HomePage deverá ser acessível publicamente. Não exigir login para visualizar a página.</p>
        
        <h2>2. HomePage como Página de Agendamento</h2>
        <p>A HomePage deverá funcionar como a principal página pública para agendamentos.</p>
        <ul>
          <li>Visualizar a barbearia.</li>
          <li>Visualizar os serviços disponíveis.</li>
          <li>Escolher um serviço.</li>
          <li>Escolher o profissional, quando aplicável.</li>
          <li>Selecionar uma data.</li>
          <li>Visualizar horários disponíveis.</li>
          <li>Selecionar um horário.</li>
          <li>Prosseguir com o agendamento.</li>
        </ul>
        <p>O fluxo deverá utilizar os dados reais cadastrados na administração.</p>
        
        <h2>3. Acesso Público</h2>
        <p>Qualquer pessoa poderá acessar a HomePage. Não exigir: Login, Senha, Acesso administrativo.</p>
        <p>Caso seja necessário criar uma conta para concluir o agendamento, essa solicitação deverá acontecer somente no momento adequado do fluxo, sem bloquear o acesso inicial à HomePage.</p>
        
        <h2>4. Integração com a Administração</h2>
        <p>A HomePage deverá utilizar as informações configuradas no painel administrativo.</p>
        
        <h2>5. Estrutura da Área Pública</h2>
        <pre>
          ÁREA PÚBLICA
          └── HomePage
              ├── Apresentação da Barbearia
              ├── Serviços
              ├── Profissionais
              ├── Calendário
              ├── Horários Disponíveis
              └── Agendamento
        </pre>
        
        <h2>6. Navegação</h2>
        <p>A HomePage deverá ser a página inicial da parte pública. O acesso deverá ocorrer diretamente pela URL pública da barbearia. O botão Página da Barbearia existente na administração deverá redirecionar para essa HomePage.</p>
        
        <h2>7. Separação da Administração</h2>
        <p>A HomePage pública não deverá apresentar o dashboard ou menu administrativo.</p>
        
        <h2>8. Responsividade</h2>
        <p>A HomePage deverá funcionar corretamente em todos os dispositivos.</p>
        
        <h2>9. Critérios de Aceitação</h2>
        <p>A HomePage existe, é pública, permite agendamento e é responsiva.</p>
      </div>
    </>
  );
}
