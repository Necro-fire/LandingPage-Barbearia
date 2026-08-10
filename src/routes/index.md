Perfeito. Com base no que você definiu, o Dashboard e os módulos principais devem ficar bem mais objetivos. Segue o PRD atualizado:

# PRD — Estrutura Principal da Administração da Barbearia

## 1. Objetivo

Reestruturar a área administrativa para apresentar somente funcionalidades diretamente relacionadas à operação da barbearia.

A administração deverá ser organizada nos seguintes módulos:

* Dashboard
* Clientes
* Serviços
* Notificações
* Agenda
* Página da Barbearia

---

# 2. Dashboard

O Dashboard deverá ser simples e focado exclusivamente nos agendamentos.

## 2.1 Agendamentos Totais Pendentes

Exibir um indicador com a quantidade total de agendamentos que estão aguardando aprovação.

Exemplo:

**Agendamentos Pendentes**

`12`

Esse número deverá considerar todos os agendamentos atualmente com status pendente.

---

## 2.2 Agendamentos Pendentes do Dia

Exibir separadamente a quantidade de solicitações pendentes referentes ao dia atual.

Exemplo:

**Pendentes Hoje**

`4`

O número deverá ser atualizado automaticamente conforme novos agendamentos forem solicitados, aprovados ou negados.

---

## 2.3 Dashboard Minimalista

Não adicionar ao Dashboard:

* Gráficos financeiros.
* Receita.
* Estatísticas desnecessárias.
* Serviços mais vendidos.
* Ranking de barbeiros.
* Informações decorativas.
* Cards que não estejam relacionados aos agendamentos pendentes.

O Dashboard deverá apresentar somente as informações solicitadas.

---

# 3. Clientes

Criar um módulo exclusivo para gerenciamento dos clientes.

## 3.1 Lista de Clientes

Exibir:

* Nome.
* Telefone.
* E-mail, quando disponível.
* Data de cadastro.
* Quantidade de agendamentos.
* Status.

Adicionar pesquisa por nome ou telefone.

---

## 3.2 Dados do Cliente

Ao selecionar um cliente, abrir uma página ou painel com suas informações.

Exibir:

### Informações pessoais

* Nome.
* Telefone.
* E-mail.
* Data de cadastro.

### Histórico

Exibir todos os agendamentos anteriores do cliente.

Cada registro deverá apresentar:

* Serviço.
* Data.
* Horário.
* Profissional, quando aplicável.
* Status.
* Valor.

---

## 3.3 Histórico do Cliente

Permitir visualizar:

* Agendamentos concluídos.
* Agendamentos cancelados.
* Agendamentos recusados.
* Agendamentos futuros.

O histórico deverá ser organizado por data, do mais recente para o mais antigo.

---

# 4. Serviços

Criar um módulo completo para gerenciamento dos serviços oferecidos pela barbearia.

## 4.1 Lista de Serviços

Cada serviço deverá apresentar:

* Nome.
* Descrição.
* Duração.
* Valor.
* Status.

---

## 4.2 Adicionar Serviço

Disponibilizar botão:

**Adicionar Serviço**

Campos:

* Nome.
* Descrição.
* Valor.
* Duração.
* Status.

Após salvar, o serviço deverá ficar imediatamente disponível para utilização no sistema de agendamento, conforme seu status.

---

## 4.3 Editar Serviço

Permitir editar qualquer informação do serviço.

Exemplos:

* Alterar nome.
* Alterar preço.
* Alterar duração.
* Alterar descrição.
* Ativar/desativar serviço.

As alterações deverão refletir nos novos agendamentos.

Agendamentos já existentes não devem ser alterados retroativamente sem uma ação específica.

---

## 4.4 Remover Serviço

Permitir remover/arquivar serviços.

Antes da remoção:

* Solicitar confirmação.
* Verificar se existem agendamentos relacionados.
* Não apagar histórico de atendimentos.

Se o serviço possuir histórico, priorizar sua desativação/arquivamento em vez da exclusão definitiva.

---

# 5. Notificações

O módulo de notificações deverá ser utilizado principalmente para o gerenciamento das solicitações de agendamento dos clientes.

## 5.1 Nova Solicitação

Quando um cliente solicitar um agendamento, criar uma notificação para o responsável.

A notificação deverá apresentar:

* Nome do cliente.
* Serviço.
* Data.
* Horário.
* Barbeiro, quando aplicável.

---

## 5.2 Confirmar Agendamento

Disponibilizar ação:

**Confirmar Agendamento**

Ao confirmar:

1. Alterar o status do agendamento para confirmado.
2. Registrar a confirmação.
3. Atualizar a Agenda.
4. Remover o agendamento da lista de pendentes.
5. Enviar uma notificação ao cliente informando que o agendamento foi confirmado.

---

## 5.3 Negar Agendamento

Disponibilizar ação:

**Negar Agendamento**

Ao negar:

1. Alterar o status para recusado.
2. Registrar a ação.
3. Liberar o horário na Agenda.
4. Remover o agendamento da lista de pendentes.
5. Notificar o cliente.

Quando necessário, permitir informar um motivo da recusa.

---

## 5.4 Histórico

As notificações e ações realizadas deverão permanecer no histórico.

Registrar:

* Solicitação.
* Confirmação.
* Negação.
* Data.
* Horário.
* Responsável pela ação.

---

# 6. Agenda

A Agenda será responsável pela visualização e configuração dos horários da barbearia.

---

## 6.1 Calendário

Criar um calendário administrativo com visualização dos:

* Dias.
* Horários.
* Agendamentos.

Os horários preenchidos deverão mostrar os agendamentos dos clientes.

Exemplo:

```text
08:00 — Livre

08:30 — João — Corte

09:00 — Maria — Barba

09:30 — Livre

10:00 — Carlos — Corte + Barba
```

---

## 6.2 Detalhes do Agendamento

Ao clicar em um agendamento, exibir:

* Cliente.
* Serviço.
* Data.
* Horário.
* Status.
* Demais informações disponíveis.

---

# 7. Horário de Funcionamento

Dentro da Agenda, criar uma área para configurar os horários de funcionamento da barbearia.

Permitir configurar individualmente cada dia.

Exemplo:

```text
Segunda
08:00 — 18:00

Terça
08:00 — 18:00

Quarta
08:00 — 18:00

Quinta
08:00 — 18:00

Sexta
08:00 — 19:00

Sábado
08:00 — 16:00

Domingo
Fechado
```

---

# 8. Intervalos

Permitir adicionar intervalos durante o funcionamento.

Exemplo:

```text
08:00 — 12:00
Intervalo
13:00 — 18:00
```

Os horários dentro do intervalo não deverão aparecer como disponíveis para agendamento.

---

# 9. Exceções de Funcionamento

Criar uma funcionalidade específica para exceções.

O administrador deverá conseguir alterar o funcionamento de uma data específica sem modificar a configuração semanal padrão.

Exemplos:

### Feriado

15/08

**Fechado**

---

### Horário especial

20/08

**10:00 — 15:00**

---

### Abertura excepcional

Domingo, 23/08

**09:00 — 13:00**

---

### Fechamento excepcional

25/08

**Fechado**

---

As exceções deverão ter prioridade sobre o horário padrão.

Exemplo:

Configuração padrão:

**Segunda: 08:00–18:00**

Exceção:

**10/08: Fechado**

Nesse dia, a barbearia deverá ser considerada fechada.

---

# 10. Integração da Agenda com Agendamentos

A disponibilidade exibida para o cliente deverá utilizar diretamente as configurações da Agenda.

O sistema deverá considerar:

* Dias de funcionamento.
* Horários de funcionamento.
* Intervalos.
* Exceções.
* Agendamentos existentes.

Assim, um horário configurado como fechado nunca poderá ser oferecido ao cliente.

---

# 11. Página da Barbearia

Adicionar no painel administrativo uma opção:

**Página da Barbearia**

Essa opção deverá possuir um botão claramente identificado:

**Visitar Página da Barbearia**

Ao clicar, o sistema deverá redirecionar o usuário para a **página pública da barbearia**.

---

## 11.1 Página Pública

A página pública deverá ser acessível sem necessidade de entrar no painel administrativo.

O objetivo do botão é permitir que o administrador visualize rapidamente a página que seus clientes acessam.

---

# 12. Estrutura Final da Administração

A navegação principal deverá ficar organizada de forma simples:

```text
ADMINISTRAÇÃO

├── Dashboard
│   ├── Agendamentos Pendentes
│   └── Pendentes Hoje
│
├── Clientes
│   ├── Lista
│   ├── Dados
│   └── Histórico
│
├── Serviços
│   ├── Lista
│   ├── Adicionar
│   ├── Editar
│   └── Remover/Arquivar
│
├── Notificações
│   ├── Solicitações
│   ├── Confirmar
│   ├── Negar
│   └── Histórico
│
├── Agenda
│   ├── Calendário
│   ├── Agendamentos
│   ├── Horário de Funcionamento
│   ├── Intervalos
│   └── Exceções
│
└── Página da Barbearia
    └── Visitar Página Pública
```

---

# 13. Regras Gerais

* O Dashboard deve permanecer minimalista.
* Os números do Dashboard devem utilizar dados reais.
* Um agendamento confirmado deve sair imediatamente dos pendentes.
* Um agendamento negado deve sair imediatamente dos pendentes.
* A Agenda deve refletir os agendamentos reais.
* Alterações no horário de funcionamento devem afetar a disponibilidade de novos agendamentos.
* Exceções devem ter prioridade sobre o horário padrão.
* Serviços removidos não devem apagar o histórico de clientes.
* Clientes devem manter seu histórico mesmo quando serviços forem arquivados.
* Todas as alterações devem ser responsivas.
* Não criar módulos ou funcionalidades adicionais além das especificadas neste PRD.

# 14. Critérios de Aceitação

* [ ] Dashboard mostra apenas agendamentos pendentes totais e pendentes do dia.
* [ ] Clientes possuem dados e histórico.
* [ ] Serviços podem ser adicionados.
* [ ] Serviços podem ser editados.
* [ ] Serviços podem ser removidos/arquivados.
* [ ] Notificações permitem confirmar agendamentos.
* [ ] Notificações permitem negar agendamentos.
* [ ] Histórico das ações é mantido.
* [ ] Agenda apresenta calendário.
* [ ] Calendário mostra dias e horários ocupados por clientes.
* [ ] Horários de funcionamento podem ser configurados.
* [ ] Intervalos podem ser configurados.
* [ ] Exceções de dia e horário podem ser criadas.
* [ ] Exceções sobrescrevem o funcionamento padrão.
* [ ] Página da Barbearia possui botão para acessar a página pública.