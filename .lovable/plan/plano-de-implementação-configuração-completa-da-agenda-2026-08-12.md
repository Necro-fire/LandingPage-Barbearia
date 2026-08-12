# Plano de Implementação: Configuração Completa da Agenda

O objetivo é implementar um sistema de agenda robusto onde o administrador define os horários de funcionamento, intervalos e exceções, e a área pública de agendamento consome essa disponibilidade em tempo real.

## Alterações de Banco de Dados (Supabase)

1.  **Novas Tabelas e Estruturas:**
    *   Tabela `public.shop_working_hours` para armazenar o expediente semanal da barbearia (diferente da `working_hours` que é por barbeiro).
    *   Garantir que `schedule_exceptions` suporte intervalos (start_time, end_time) e fechamento total.
    *   Adicionar campo `is_active` em `barbers` (já existe).
2.  **Políticas RLS e Grants:**
    *   Habilitar RLS em todas as tabelas.
    *   Conceder acesso `SELECT` para `anon` em `shop_working_hours` e `schedule_exceptions`.
    *   Acesso total para `authenticated` (admin).

## Implementação da Agenda Administrativa (`src/pages/app/Schedule.tsx`)

1.  **Aba de Configurações:**
    *   Interface para ativar/desativar dias da semana.
    *   Definição de múltiplos turnos/intervalos por dia (ex: 08:00-12:00 e 14:00-18:00).
    *   Gestão de Exceções: Adicionar datas específicas com horários diferenciados ou bloqueio total (feriados).
2.  **Visualização do Calendário:**
    *   Exibição dos agendamentos existentes em visualização de Dia/Semana/Mês.
    *   Indicação visual de horários bloqueados ou fora do expediente.

## Integração com a Área Pública (`src/pages/app/Booking.tsx`)

1.  **Lógica de Cálculo de Disponibilidade:**
    *   Refatorar o `fetchAvailableTimes` para considerar:
        1.  Expediente da barbearia (`shop_working_hours`).
        2.  Exceções da data (`schedule_exceptions`).
        3.  Horário de trabalho do barbeiro selecionado (se aplicável).
        4.  Agendamentos existentes (`appointments`).
        5.  Duração do serviço selecionado.
2.  **Validações:**
    *   Impedir seleção de domingos se estiverem desativados.
    *   Garantir que o último horário disponível permita a conclusão do serviço dentro do horário de encerramento.

## Detalhes Técnicos

*   Uso de `date-fns` para manipulação de datas e horários.
*   Sincronização imediata via `supabase.upsert` nas configurações.
*   Interface responsiva utilizando componentes `shadcn/ui` e Tailwind CSS.
