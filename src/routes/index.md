# PRD — Padronização da Fonte e Reestruturação do Dashboard

## 1. Objetivo

Realizar duas alterações principais em todo o sistema:

1. Substituir a fonte atual por uma **fonte profissional, moderna e legível**, aplicada em toda a plataforma.
2. Remover os elementos atuais do **Dashboard** e reconstruí-lo utilizando somente informações realmente pertinentes à gestão da barbearia.

---

# 2. Fonte Global do Sistema

## 2.1 Alteração

Substituir a fonte atualmente utilizada por uma fonte **sans-serif profissional**, moderna, limpa e adequada para sistemas SaaS e dashboards administrativos.

A nova fonte deve transmitir:

* Profissionalismo.
* Modernidade.
* Organização.
* Excelente legibilidade.
* Boa leitura de números e valores.
* Boa visualização em telas pequenas.

A fonte deve ser aplicada de forma global.

---

## 2.2 Aplicação

A nova fonte deverá ser utilizada em:

* Landing Page.
* Homepage.
* Área do cliente.
* Área do barbeiro.
* Área administrativa.
* Dashboard.
* Sidebar.
* Header.
* Menus.
* Botões.
* Formulários.
* Tabelas.
* Cards.
* Calendários.
* Modais.
* Notificações.
* Relatórios.
* Configurações.
* Mensagens.
* Estados vazios.
* Componentes de feedback.

Não deve existir uma fonte diferente em módulos específicos sem uma necessidade real de design.

---

## 2.3 Pesos Tipográficos

Utilizar uma hierarquia consistente, preferencialmente:

* 400 — Regular
* 500 — Medium
* 600 — Semibold
* 700 — Bold

Evitar o uso excessivo de fontes muito pesadas.

A hierarquia deve ser definida pelo tamanho, peso e espaçamento, mantendo uma aparência limpa.

---

# 3. Reestruturação do Dashboard

## 3.1 Objetivo

Remover completamente os elementos atuais do Dashboard e reconstruí-lo do zero, mantendo somente informações diretamente relacionadas ao funcionamento e gerenciamento da barbearia.

O Dashboard não deve funcionar como uma página genérica de apresentação.

Ele deve funcionar como um **painel de visão rápida da operação da barbearia**.

---

# 4. Elementos do Dashboard

O Dashboard deverá apresentar somente informações relevantes.

## 4.1 Resumo do Dia

Exibir cards com:

### Agendamentos de Hoje

Quantidade total de agendamentos previstos para o dia.

### Pendentes

Quantidade de solicitações aguardando aprovação.

### Confirmados

Quantidade de agendamentos confirmados para o dia.

### Concluídos

Quantidade de atendimentos já realizados no dia.

---

# 5. Próximos Agendamentos

Criar uma seção:

**Próximos Agendamentos**

Exibir os próximos atendimentos da agenda.

Cada item deverá apresentar:

* Horário.
* Cliente.
* Serviço.
* Barbeiro.
* Status.

Exemplo:

```text
09:00
João Silva
Corte
Carlos
Confirmado
```

Permitir clicar no agendamento para visualizar seus detalhes.

---

# 6. Solicitações Pendentes

Adicionar uma seção específica para solicitações que precisam de ação.

Exibir:

* Cliente.
* Serviço.
* Data.
* Horário solicitado.
* Barbeiro.
* Status.

Ações rápidas:

* Aprovar.
* Recusar.
* Visualizar.

Essa seção deve possuir destaque suficiente para que o administrador identifique rapidamente solicitações que precisam de atenção.

---

# 7. Agenda do Dia

Adicionar uma visualização resumida da agenda atual.

Exibir:

* Horários.
* Agendamentos.
* Horários livres.
* Horários ocupados.
* Bloqueios.

Adicionar botão:

**Ver agenda completa**

Esse botão deverá direcionar para o módulo de Agenda/Calendário.

---

# 8. Indicadores Financeiros

Caso o módulo financeiro esteja habilitado para o usuário, exibir somente indicadores relevantes.

### Receita do Dia

Valor recebido no dia.

### Receita do Mês

Valor acumulado no mês.

### Atendimentos

Quantidade de atendimentos concluídos.

Não adicionar gráficos financeiros excessivos ou informações que não contribuam para a gestão da barbearia.

---

# 9. Serviços Mais Realizados

Adicionar uma seção simples mostrando os serviços mais realizados.

Exemplo:

```text
1. Corte              42 atendimentos
2. Corte + Barba      31 atendimentos
3. Barba              18 atendimentos
```

Permitir selecionar o período:

* Hoje.
* Semana.
* Mês.

---

# 10. Desempenho dos Barbeiros

Quando houver mais de um profissional, exibir um resumo da produtividade.

Informações pertinentes:

* Barbeiro.
* Atendimentos realizados.
* Agendamentos futuros.
* Avaliação média, caso exista.

Não transformar essa seção em um relatório completo.

Para análises detalhadas, utilizar o módulo de Relatórios.

---

# 11. Alertas Importantes

Adicionar uma área somente quando houver situações que realmente necessitem da atenção do usuário.

Exemplos:

* Solicitações pendentes.
* Horários bloqueados.
* Falhas em pagamentos.
* Agendamentos cancelados.
* Configurações importantes pendentes.

Se não houver alertas, não exibir um espaço vazio desnecessário.

---

# 12. Período do Dashboard

O Dashboard deve deixar claro qual período está sendo apresentado.

Disponibilizar, quando aplicável:

* Hoje.
* Esta semana.
* Este mês.
* Período personalizado.

Os indicadores deverão atualizar de acordo com o período selecionado.

---

# 13. Personalização por Perfil

O Dashboard não deve mostrar informações que não fazem sentido para determinado usuário.

### Proprietário/Gerente

Visualizar:

* Agendamentos.
* Solicitações.
* Receita.
* Serviços.
* Profissionais.
* Indicadores gerais.

### Recepcionista

Priorizar:

* Agenda.
* Agendamentos.
* Solicitações.
* Clientes.
* Atendimentos do dia.

### Barbeiro

Priorizar:

* Sua agenda.
* Seus próximos atendimentos.
* Solicitações relacionadas a ele.
* Seus atendimentos concluídos.
* Seus indicadores.

### Cliente

Não utilizar este Dashboard administrativo.

O cliente deverá possuir seu próprio painel com informações relacionadas aos seus agendamentos.

---

# 14. O Que NÃO Deve Permanecer no Dashboard

Remover elementos genéricos, decorativos ou sem relação direta com a operação.

Não adicionar:

* Informações aleatórias.
* Cards sem função.
* Estatísticas fictícias.
* Gráficos sem finalidade.
* Elementos meramente decorativos ocupando espaço.
* Informações duplicadas de outros módulos.
* Dados que não tenham relação com a barbearia.
* Métricas que não possam ser obtidas pelos dados reais do sistema.

O Dashboard deve priorizar **informação útil e acionável**.

---

# 15. Organização Visual

A estrutura recomendada:

```text
Dashboard
│
├── Resumo do Dia
│   ├── Agendamentos
│   ├── Pendentes
│   ├── Confirmados
│   └── Concluídos
│
├── Próximos Agendamentos
│
├── Solicitações Pendentes
│
├── Agenda do Dia
│
├── Indicadores Financeiros
│
├── Serviços Mais Realizados
│
├── Desempenho dos Barbeiros
│
└── Alertas Importantes
```

As seções devem ser organizadas conforme a importância e o espaço disponível.

---

# 16. Responsividade

O Dashboard deverá funcionar perfeitamente em:

* Desktop.
* Notebook.
* Tablet.
* Smartphone.

No celular:

* Cards devem se reorganizar verticalmente.
* Tabelas devem ser adaptadas para visualização mobile.
* Próximos agendamentos devem utilizar cards compactos.
* Não permitir rolagem horizontal desnecessária.
* A informação mais importante deve aparecer primeiro.

---

# 17. Dados Reais

Nenhum indicador do Dashboard deve utilizar valores fictícios na aplicação final.

Todos os dados devem ser provenientes dos registros reais do sistema:

* Agendamentos.
* Clientes.
* Serviços.
* Barbeiros.
* Pagamentos.
* Avaliações.

Quando não existirem dados suficientes, utilizar estados vazios apropriados.

Exemplo:

**Nenhum agendamento para hoje.**

Em vez de apresentar números artificiais.

---

# 18. Critérios de Aceitação

* [ ] A fonte profissional está aplicada em todo o sistema.
* [ ] Não existem fontes antigas inconsistentes em módulos principais.
* [ ] O Dashboard atual foi completamente reorganizado.
* [ ] O Dashboard contém somente informações relacionadas à barbearia.
* [ ] Os dados apresentados são reais.
* [ ] Os agendamentos do dia aparecem corretamente.
* [ ] Solicitações pendentes possuem acesso rápido.
* [ ] Indicadores financeiros utilizam dados reais quando disponíveis.
* [ ] O conteúdo muda conforme as permissões do usuário.
* [ ] O Dashboard é totalmente responsivo.
* [ ] Não existem cards ou gráficos sem finalidade.
* [ ] Não existem informações duplicadas desnecessariamente.
* [ ] A interface mantém o padrão visual profissional do restante do sistema.

# 19. Resultado Esperado

O sistema deverá possuir uma **tipografia única, profissional e consistente em toda a plataforma**.

O Dashboard deverá deixar de ser uma página genérica e passar a funcionar como um verdadeiro **centro de controle da barbearia**, permitindo que o usuário identifique rapidamente:

**O que está acontecendo → O que precisa de atenção → Quais são os próximos atendimentos → Como está a operação.**
