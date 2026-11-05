# Issue 03: Filtros da Pauta do Altar e Modal de Confirmação de Exclusão

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Prioridade:** Média  
**Componente:** `/src/components/ControlPanel.tsx`

---

## Descrição do Problema
1. A Pauta do Altar no Painel do Estúdio compila todos os pedidos sem permitir filtragem rápida por categorias específicas.
2. A exclusão de itens de mensagens ou pedidos utiliza o alerte padrão `window.confirm`.

## Tarefas de Implementação
1. Adicionar seletor de filtro de categorias (`"Todas"`, `"Família"`, `"Saúde"`, `"Gratidão"`, `"Hinos"`) na seção Pauta do Altar de `ControlPanel.tsx`.
2. Adicionar opção para ocultar itens marcados como atendidos na Pauta do Altar.
3. Criar um modal de confirmação acessível customizado (com suporte a `Escape` e `Enter`) para substituição do `window.confirm`.

## Critérios de Aceite
* O locutor consegue filtrar a Pauta do Altar por assunto específico em 1-clique.
* A exclusão de dados exige confirmação em um modal acessível e estilizado.
