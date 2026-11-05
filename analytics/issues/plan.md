# Plano Estratégico de Implementação — Issues / Analytics

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Data e Hora de Conclusão da Execução:** 05/11/2026 08:58 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (FM 104.9 MHz & Web HD)  
**Status do Documento:** EXECUÇÃO CONCLUÍDA (100% das Issues Resolvidas e Validadas)  
**Diretiva:** Execução rigorosa dos módulos e sinalização de progresso.

---

## 1. Visão Geral do Planejamento
Este documento detalha o plano de execução para sanar sequencialmente todas as 5 issues mapeadas na pasta `/analytics/issues/`. O plano foi executado seguindo os princípios de **modificação mínima, resiliência do sistema e preservação das funcionalidades existentes**.

---

## 2. Cronograma e Ordem Técnica de Execução

| Etapa | Issue Alvo | Foco Técnico | Status de Conclusão |
| :---: | :--- | :--- | :---: |
| **Fase 1** | `issue-01-firestore-resilience.md` | Estabilização de exceções e captura silenciosa de falhas no `RadioContext`. | **[CONCLUÍDO]** |
| **Fase 2** | `issue-04-rbac-and-studio-security.md` | Proteção de acesso ao Painel do Estúdio (`isAdmin`) e checagem no `App.tsx`. | **[CONCLUÍDO]** |
| **Fase 3** | `issue-02-schedule-and-verses-sync.md` | Sincronização reativa da grade (`ScheduleSection`) e ticker (`App.tsx`). | **[CONCLUÍDO]** |
| **Fase 4** | `issue-03-song-request-status-and-pauta.md` | Unificação dos enums do Firestore (`na_fila`, `no_ar`, `atendido`) e Pauta do Altar. | **[CONCLUÍDO]** |
| **Fase 5** | `issue-05-audio-autoplay-and-pwa-offline.md` | Desduplicação do listener `online` e fallback SPA no `/public/sw.js`. | **[CONCLUÍDO]** |

---

## 3. Detalhamento Técnico das Etapas

### Fase 1: Resiliência do Firestore (`issue-01-firestore-resilience.md`)
* **Pesquisa & Análise:** Verificar todas as ocorrências de `handleFirestoreError` em `src/context/RadioContext.tsx`.
* **Plano de Ação:**
  1. Alterar a assinatura e implementação do `handleFirestoreError` para logar avisos em `console.warn` em vez de disparar `throw`.
  2. Ajustar as inscrições `onSnapshot` para manter os dados armazenados em `localStorage` quando houver falha de rede ou falta de permissão.
* **Validação:** Desconectar temporariamente a rede e verificar se a interface continua responsiva sem quebras no React.

### Fase 2: Segurança RBAC (`issue-04-rbac-and-studio-security.md`)
* **Pesquisa & Análise:** Mapear o fluxo de abertura do Painel do Estúdio em `App.tsx` e o cadastro de administradores em `LoginView.tsx`.
* **Plano de Ação:**
  1. Adicionar validação `isLoggedIn && isAdmin` antes de setar `isControlPanelOpen(true)`.
  2. Garantir que os e-mails mestres (`vibraefm@gmail.com`, `webradiovozdafe@gmail.com`) recebam a role `'admin'` no Firestore `/users/{uid}`.
* **Validação:** Testar acesso com usuário ouvinte comum e validar redirecionamento seguro para `/perfil`.

### Fase 3: Sincronização de Grade e Ticker (`issue-02-schedule-and-verses-sync.md`)
* **Pesquisa & Análise:** Verificar a importação direta de `SCHEDULE_PROGRAMS` em `ScheduleSection.tsx` e o cálculo de índice em `App.tsx`.
* **Plano de Ação:**
  1. Substituir `SCHEDULE_PROGRAMS` por `programs` do `useRadio()` em `ScheduleSection.tsx`.
  2. Atualizar o ticker de versículos em `App.tsx` para calcular o resto da divisão por `verses.length`.
* **Validação:** Adicionar um programa de teste no Painel e conferir se ele aparece imediatamente na aba de Programação pública.

### Fase 4: Padronização de Enums e Pauta do Altar (`issue-03-song-request-status-and-pauta.md`)
* **Pesquisa & Análise:** Revisar os valores dos campos de status em `firebase-blueprint.json`, `ControlPanel.tsx` e `SongRequestSection.tsx`.
* **Plano de Ação:**
  1. Padronizar o enum para: `'na_fila' | 'no_ar' | 'atendido'`.
  2. Atualizar a exibição da Pauta do Altar em `ControlPanel.tsx` compilando orações e hinos com dedicatórias em uma área de cópia rápida.
* **Validação:** Mudar o status de um pedido para "No Ar" no Painel e checar o destaque visual no card do ouvinte.

### Fase 5: Ajustes de Autoplay e PWA Offline (`issue-05-audio-autoplay-and-pwa-offline.md`)
* **Pesquisa & Análise:** Inspecionar os escutadores do evento `online` em `App.tsx` e a estratégia de fetch em `/public/sw.js`.
* **Plano de Ação:**
  1. Remover o listener `online` redundante de `App.tsx`.
  2. Tratar a promessa do `play()` em `RadioContext.tsx` com captura de erros de Autoplay.
  3. Adicionar fallback `/index.html` em `/public/sw.js` para rotas de navegação SPA.
* **Validação:** Testar reloads em sub-rotas como `/oracao` estando offline.

---

## 4. Estratégia de Verificação e Qualidade
Ao receber autorização para executar as alterações, cada etapa será validada executando:
1. `compile_applet`: Verificação de compilação rigorosa do TypeScript.
2. `lint_applet`: Verificação de sintaxe, imports e integridade de enums.

---

*Fim do Plano Estratégico de Implementação — Rádio Vóz da Fé.*
