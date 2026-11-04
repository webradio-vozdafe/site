# Issue 05: Temporizador de Sono e Ajustes de Layout do Mini Player

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Origem:** `analytics/Spec.md` — Módulo 5  
**Status:** [x] Concluído

---

## 1. Descrição e Objetivo
Assegurar a precisão do temporizador de desligamento automático e resolver sobreposições visuais entre o mini player e a navegação inferior móvel.

## 2. Componentes e Arquivos Afetados
- `src/components/SleepTimerModal.tsx`
- `src/components/MiniBottomPlayer.tsx`
- `src/components/BottomNavigation.tsx`

## 3. Tarefas de Finalização
1. [x] Calcular a contagem regressiva do Sleep Timer com base na estampa de tempo alvo (`targetTimestamp - Date.now()`), garantindo precisão quando a aba estiver em segundo plano.
2. [x] Ajustar os espaçamentos inferiores (`pb-safe`) e níveis de sobreposição (`z-index`) do `MiniBottomPlayer.tsx` em dispositivos com telas estreitas para não ocultar a barra de navegação principal.
