# Issue 03: Padronização de Status de Hinos e Aprimoramento da Pauta do Altar

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Status:** Concluído  
**Data e Hora de Conclusão:** 05/11/2026 08:58 (Horário de Brasília)  
**Prioridade:** Média  
**Componentes:** `/src/components/ControlPanel.tsx`, `/src/components/SongRequestSection.tsx` e `/firebase-blueprint.json`

---

## Descrição do Problema
1. O status de pedidos de hino possui divergências de nomenclatura: `firebase-blueprint.json` define `["na_fila", "tocando", "atendido"]`, enquanto o `ControlPanel.tsx` e `SongRequestSection.tsx` utilizam `'no_ar'`.
2. A Pauta do Altar no Painel do Estúdio não compila os pedidos de hinos nem oferece recursos de cópia e exportação exigidos no PRD (Seção 4.6).

## Tarefas de Implementação
1. Padronizar o enum de status em toda a aplicação e no `firebase-blueprint.json` para: `'na_fila' | 'no_ar' | 'atendido'`.
2. Atualizar as checagens e seletores no `ControlPanel.tsx` e `SongRequestSection.tsx` para utilizarem este enum unificado.
3. Aprimorar a Pauta do Altar em `ControlPanel.tsx` para incluir os hinos pedidos com dedicatórias ao lado dos pedidos de oração.
4. Adicionar botão de cópia rápida formatada da pauta para facilitar a leitura do locutor durante os cultos ao vivo.

## Critérios de Aceite
* Alterações no status dos pedidos de música no Painel do Estúdio refletem nos cards visuais dos ouvintes em tempo real.
* A Pauta do Altar compila orações e hinos com dedicatórias em um formato limpo e fácil de copiar.
