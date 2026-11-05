# Issue 02: Badge do Sleep Timer no Mini Player e Navbar

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Prioridade:** Baixa  
**Componentes:** `/src/components/MiniBottomPlayer.tsx`, `/src/components/Navbar.tsx` e `/src/context/RadioContext.tsx`

---

## Descrição do Problema
O ouvinte programa o Sleep Timer, mas não tem visibilidade imediata de quantos minutos faltam para a rádio desligar sem precisar abrir o modal de configuração.

## Tarefas de Implementação
1. Disponibilizar a contagem em minutos `sleepTimerRemaining` no contexto ou via seletor para componentes consumidores.
2. Adicionar um badge visual compacto (ex: `⏱ 15m`) ao lado do ícone de timer no `MiniBottomPlayer.tsx` e no menu da `Navbar.tsx`.
3. Ocultar automaticamente o badge quando o timer não estiver ativo ou atingir zero.

## Critérios de Aceite
* O tempo restante é visível de relance na barra de navegação e no mini player.
* O badge desaparece quando o tempo se esgota.
