# Plano: Integração Completa de Clientes e Serviços com a Área Pública

Implementar a funcionalidade completa para os módulos de Clientes e Serviços, garantindo a integração total com a área pública de agendamento e o banco de dados.

## Alterações Técnicas

### 1. Banco de Dados (Supabase)
- **Ajustar Agendamentos:** Modificar a tabela `appointments` para aceitar agendamentos de "convidados" (clientes não logados), garantindo que `client_id` seja opcional e adicionando campos para nome e telefone se necessário.
- **Políticas RLS:** Atualizar permissões para permitir que usuários anônimos visualizem serviços e criem agendamentos (se aplicável).
- **Triggers:** Criar ou ajustar triggers para gerenciar o histórico de preços e durações nos agendamentos, preservando os valores originais mesmo se o serviço for editado.

### 2. Módulo de Serviços (Administração)
- **CRUD Completo:** Implementar criação, edição e arquivamento de serviços em `src/pages/app/Services.tsx`.
- **Estados:** Adicionar lógica para alternar entre "Ativo" e "Arquivado".
- **Integração:** Garantir que a alteração de um serviço reflita instantaneamente na área pública.

### 3. Módulo de Clientes (Administração)
- **Listagem e Busca:** Refinar `src/pages/app/Clients.tsx` para listar clientes reais vindos dos agendamentos e perfis.
- **Detalhes e Histórico:** Implementar em `src/pages/app/ClientDetails.tsx` a visualização completa do histórico de agendamentos de cada cliente.
- **Identificação Automática:** Implementar lógica para evitar duplicidade de clientes baseada em nome/telefone durante novos agendamentos.

### 4. Área Pública (Landing Page / Agendamento)
- **Dados Reais:** Atualizar `src/pages/app/Booking.tsx` para carregar serviços ativos e profissionais do banco de dados.
- **Lógica de Agendamento:** 
    - Calcular horários disponíveis baseados na duração real do serviço.
    - Capturar dados de clientes não logados e vinculá-los ou criar perfis.
- **Fluxo de Aprovação:** Garantir que novos agendamentos gerem notificações administrativas pendentes.

### 5. Notificações e Dashboard
- **Sincronização:** Atualizar o Dashboard para mostrar dados reais de agendamentos confirmados e pendentes.
- **Ações Rápidas:** Permitir que o administrador confirme ou negue solicitações diretamente das notificações.

## Experiência do Usuário
- O fluxo de agendamento será fluido e baseado na disponibilidade real.
- O administrador terá controle total sobre o catálogo de serviços e a base de clientes.
- Histórico preservado e interface responsiva em todos os dispositivos.
