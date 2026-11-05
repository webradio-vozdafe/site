# Issue 04: Focus Trap nos Modais e Anúncios ARIA Live

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Prioridade:** Alta  
**Componentes:** `/src/components/MobileDrawer.tsx`, `/src/components/SleepTimerModal.tsx` e componentes globais de alerta

---

## Descrição do Problema
1. O foco do teclado não fica preso dentro dos modais (`MobileDrawer` e `SleepTimerModal`), violando a diretriz WCAG 2.1 AA.
2. Mudanças de estado cruciais do player e intercessões não são anunciadas por leitores de tela.

## Tarefas de Implementação
1. Adicionar lógica de captura de foco (`Focus Trap`) em `MobileDrawer.tsx` e `SleepTimerModal.tsx` ao navegar com a tecla `Tab`.
2. Restaurar o foco para o elemento originador ao fechar o modal com `Escape`.
3. Inserir uma região `aria-live="polite"` invisível no layout global para anúncios de leitores de tela.

## Critérios de Aceite
* A navegação por teclado não "vaza" para fora dos modais abertos.
* Pressionar `Escape` fecha os modais e retorna o foco corretamente.
* Leitores de tela anunciam atualizações de transmissão e confirmações de formulários.
