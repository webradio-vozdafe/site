# Issue 01: Tratamento de Erros e Resiliência do Firestore Listener

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Status:** Concluído  
**Data e Hora de Conclusão:** 05/11/2026 08:55 (Horário de Brasília)  
**Prioridade:** Alta  
**Componente:** `/src/context/RadioContext.tsx`

---

## Descrição do Problema
O helper `handleFirestoreError` em `RadioContext.tsx` executa `throw new Error(...)` dentro das funções de callback de erro das inscrições `onSnapshot`. Como o callback executa assincronamente, o lançamento da exceção não é capturado por blocos `try/catch`, gerando *uncaught error rejections* no console e riscos de travamento da interface.

## Tarefas de Implementação
1. Em `/src/context/RadioContext.tsx`, reescrever `handleFirestoreError` para utilizar `console.warn` em vez de `throw new Error(...)`.
2. Assegurar que quando ocorrer um erro nos listeners de `prayerRequests`, `songRequests`, `contactMessages` ou `podcasts`, o estado da aplicação preserve os dados armazenados em `localStorage` ou mantenha o array otimista local.
3. Impedir que ouvintes não autenticados gerem logs de erro de permissão ao tentar conectar ao listener restrito de `contactMessages`.

## Critérios de Aceite
* O console do navegador não deve exibir exceções não tratadas ao desconectar do banco de dados ou ao utilizar perfis anônimos.
* Os dados locais do aplicativo permanecem funcionais mesmo em estado offline.
