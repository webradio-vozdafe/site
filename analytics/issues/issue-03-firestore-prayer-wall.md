# Issue 03: Atualização Otimista no Mural de Oração e Resiliência no Firestore

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Origem:** `analytics/Spec.md` — Módulo 3  
**Status:** [x] Concluído

---

## 1. Descrição e Objetivo
Assegurar resposta visual imediata no Mural de Oração via atualizações otimistas e implementar tratamento defensivo para exceções em operações com o Cloud Firestore.

## 2. Componentes e Arquivos Afetados
- `src/components/PrayerWallSection.tsx`
- `src/components/SongRequestSection.tsx`
- `src/context/RadioContext.tsx`

## 3. Tarefas de Finalização
1. [x] Aplicar incremento otimista imediato no estado local da contagem de orações ao clicar no botão de intercessão, sincronizando em segundo plano com o Firestore.
2. [x] Tratar exceções de permissão e desconexão durante gravações ou escutas em tempo real (`onSnapshot`), exibindo avisos amigáveis via `showNotice`.
3. [x] Validar e higienizar os campos de formulários de orações e solicitações musicais antes do envio ao banco de dados.
