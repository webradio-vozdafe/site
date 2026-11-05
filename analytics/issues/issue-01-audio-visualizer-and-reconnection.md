# Issue 01: Otimização do Visualizador de Áudio e Reconexão com Exponential Backoff

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Prioridade:** Média  
**Componentes:** `/src/components/AudioVisualizer.tsx` e `/src/context/RadioContext.tsx`

---

## Descrição do Problema
1. Em `AudioVisualizer.tsx`, a animação do canvas roda ininterruptamente via `requestAnimationFrame` mesmo quando a rádio está pausada, consumindo recursos desnecessários.
2. Em `RadioContext.tsx`, falhas de rede no elemento `<audio>` não possuem mecanismo automático de tentativas de reconexão progressiva (backoff exponencial).

## Tarefas de Implementação
1. Em `AudioVisualizer.tsx`, interromper o laço de animação `requestAnimationFrame` quando `isPlaying === false` ou `isMuted === true`.
2. Renderizar uma linha central limpa em estado de repouso no canvas quando inativo.
3. Em `RadioContext.tsx`, adicionar lógica de até 3 tentativas automáticas de reconexão com intervalos de 3s, 6s e 12s ao detectar erro ou congelamento da transmissão.

## Critérios de Aceite
* O uso de CPU/GPU pelo canvas é zerado com o player pausado.
* O player tenta reconectar automaticamente até 3 vezes antes de exigir clique manual do usuário.
