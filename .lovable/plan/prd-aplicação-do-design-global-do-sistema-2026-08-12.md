# PRD — Aplicação do Design Global do Sistema

## 1. Objetivo
Aplicar o design da referência fornecida (Estética Clean/Light com tons de roxo/azul suave e cards brancos) como padrão visual para todo o sistema, mantendo uma interface profissional, moderna, limpa e totalmente responsiva.

## 2. Padrão Visual (Baseado na Referência)
- **Cores**: Fundo cinza muito claro/gelo, cards brancos puros, destaques em Azul/Roxo suave (conforme ícones da imagem).
- **Cards**: Bordas arredondadas generosas (`rounded-2xl` ou `3xl`), sombra suave (`shadow-sm` ou `shadow-md`), sem bordas pesadas.
- **Tipografia**: Arial (global) com pesos variados para hierarquia.
- **Dashboard**: Cards de estatísticas horizontais com ícones coloridos em fundos pastéis.

## 3. Áreas de Aplicação
- **Dashboard**: Reconstruir para o estilo "Light" da imagem, com cards de resumo no topo e tabelas limpas.
- **Login**: Mudar para fundo claro com card centralizado.
- **Páginas Internas (Clientes, Serviços, Agenda)**: Aplicar o mesmo padrão de cards brancos sobre fundo gelo.
- **Barra de Navegação**: Sidebar branca com ícones discretos.

## 4. Etapas de Implementação

### Fase 1: Design System (CSS)
- Atualizar variáveis de cor no `src/index.css` para o tema "Light".
- Definir tokens para cards e sombras baseados na imagem.

### Fase 2: Layout Base
- Ajustar `AppSidebar.tsx` e `MobileNav.tsx` para o novo esquema de cores (branco/cinza claro).
- Garantir que o `BarbershopConfirmModal` siga o novo padrão.

### Fase 3: Páginas Administrativas
- **Dashboard**: Refatorar para usar o layout de 4 cards no topo e listas brancas limpas abaixo.
- **Clientes/Serviços/Agenda**: Remover o estilo "Glassmorphism" escuro e aplicar cards brancos com sombras suaves.

### Fase 4: Área Pública e Login
- **Auth.tsx**: Centralizar formulário em card branco sobre fundo gelo.
- **Booking.tsx (Área Pública)**: Adaptar para o tema light profissional.

## 5. Critérios de Aceitação
- Todo o sistema utiliza o fundo claro com cards brancos.
- A fonte Arial é mantida conforme instrução prévia.
- O mobile é totalmente funcional e segue a identidade visual.
- Nenhuma funcionalidade de agendamento ou gestão é perdida.
