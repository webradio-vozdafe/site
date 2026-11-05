# Issue 02: Sincronização Dinâmica da Grade Horária e Ticker de Versículos

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Status:** Concluído  
**Data e Hora de Conclusão:** 05/11/2026 08:57 (Horário de Brasília)  
**Prioridade:** Alta  
**Componentes:** `/src/components/ScheduleSection.tsx` e `/src/App.tsx`

---

## Descrição do Problema
1. Em `ScheduleSection.tsx`, a lista de programas é filtrada diretamente da constante estática `SCHEDULE_PROGRAMS`, ignorando os programas criados ou alterados no Painel do Estúdio.
2. Em `App.tsx`, o botão de alterar versículo calcula o índice utilizando `DAILY_VERSES.length` (estático) em vez de `verses.length` (dinâmico).

## Tarefas de Implementação
1. Modificar `ScheduleSection.tsx` para importar e consumir a propriedade `programs` disponibilizada pelo hook `useRadio()`.
2. Atualizar o filtro de dia da semana na linha 63 de `ScheduleSection.tsx` para operar sobre `programs`.
3. Em `App.tsx`, substituir `DAILY_VERSES.length` por `verses.length` no handler de troca de versículo.

## Critérios de Aceite
* Qualquer programa adicionado ou editado no Painel do Estúdio deve refletir imediatamente na página pública de Programação.
* A navegação entre versículos na página inicial deve percorrer todos os versículos do contexto sem estourar o limite do array.
