# Issue 05: Desduplicação do Listener Online e Fallback Offline no Service Worker

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Status:** Concluído  
**Data e Hora de Conclusão:** 05/11/2026 08:58 (Horário de Brasília)  
**Prioridade:** Média  
**Componentes:** `/src/App.tsx`, `/src/context/RadioContext.tsx` e `/public/sw.js`

---

## Descrição do Problema
1. O evento `window.addEventListener('online')` é escutado tanto em `App.tsx` quanto em `RadioContext.tsx`, disparando chamadas duplas a `retryPlayback()` que falham em celulares devido às políticas de autoplay.
2. O Service Worker em `/public/sw.js` não possui um fallback de navegação SPA para rotas dinâmicas como `/programacao` ou `/oracao` quando a página é recarregada offline.

## Tarefas de Implementação
1. Remover o ouvinte de evento `online` do arquivo `App.tsx`, centralizando todo o comportamento de recuperação de rede no `RadioContext.tsx`.
2. No `retryPlayback()`, tratar o retorno de `audio.play()` com `.catch()` para evitar exceções de Autoplay Block nos navegadores móveis.
3. Atualizar `/public/sw.js` para adicionar um fallback `caches.match('/index.html')` no evento `fetch` de navegação (`request.mode === 'navigate'`).

## Critérios de Aceite
* A reconexão à internet não gera alertas de erro nem dispara tentativas ruidosas em segundo plano.
* O recarregamento de sub-páginas do aplicativo em modo offline exibe a interface do PWA normalmente.
