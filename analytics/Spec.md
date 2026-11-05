# Especificação Funcional e Técnica de Implementação (Spec) — Rádio Vóz da Fé

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (FM 104.9 MHz & Web HD)  
**Documento de Origem:** `/analytics/report.md` & `/references/PRD.md`  
**Escopo:** Especificação do que falta implementar e corrigir (Páginas, Comportamentos, Componentes e Mapeamentos).

---

## 1. Visão Geral da Especificação
Esta especificação define os requisitos funcionais, comportamentais e de componentes necessários para sanar todos os erros diagnosticados no relatório `/analytics/report.md` e garantir conformidade com a edição do PRD (Versão 2.0.0).

---

## 2. Requisitos de Comportamento & Tratamento de Erros (Behavior)

### SPEC-BE-01: Tratamento Gracioso de Erros no Firestore Listener
* **Objetivo:** Impedir o lançamento de exceções não tratadas (*uncaught errors*) durante a sincronização em tempo real.
* **Especificação Comportamental:**
  * Em `RadioContext.tsx`, reestruturar `handleFirestoreError` para capturar e registrar erros via `console.warn` em vez de executar `throw new Error(...)`.
  * Em caso de falha de conexão ou permissão nos listeners `onSnapshot` (`prayerRequests`, `songRequests`, `contactMessages`, `podcasts`), a aplicação deve manter e exibir os dados armazenados em `localStorage` ou o estado otimista local.

### SPEC-BE-02: Gerenciamento Unificado do Evento de Conexão `online`
* **Objetivo:** Eliminar requisições duplicadas e falhas de Autoplay ao reconectar a internet.
* **Especificação Comportamental:**
  * Remover a escuta do evento `online` no arquivo `App.tsx` e manter unicamente no `RadioContext.tsx`.
  * No `retryPlayback()`, verificar a propriedade `audio.paused` e tratar a rejeição da promessa do `play()` para exibir uma mensagem amigável sem acionar alertas ruidosos na tela.

### SPEC-BE-03: Resiliência Offline e Roteamento no Service Worker (PWA)
* **Objetivo:** Garantir que reloads em sub-rotas como `/programacao` e `/oracao` funcionem sem internet.
* **Especificação Comportamental:**
  * Atualizar a estratégia de navegação em `/public/sw.js` para capturar requisições de página (`mode === 'navigate'`) e retornar a cópia armazenada de `/index.html` do cache do Service Worker quando a rede falhar.

---

## 3. Requisitos de Componentes e Sincronização de Estado (Components & State)

### SPEC-CP-01: Reestruturação da Grade de Programação (`ScheduleSection.tsx`)
* **Objetivo:** Exibir dinamicamente a grade de programação cadastrada ou editada no Painel do Estúdio.
* **Especificação de Componente:**
  * Modificar `ScheduleSection.tsx` para consumir o estado `programs` oriundo do hook `useRadio()`.
  * Atualizar o filtro de seleção de dia (`selectedDay`) para utilizar `programs.filter(...)` garantindo que novos programas adicionados pelo estúdio apareçam instantaneamente para o público.

### SPEC-CP-02: Sincronização Dinâmica do Ticker de Versículos (`App.tsx`)
* **Objetivo:** Evitar erros de estouro de array ao avançar a leitura da Palavra do Dia.
* **Especificação de Componente:**
  * Em `App.tsx`, substituir as ocorrências de `DAILY_VERSES.length` por `verses.length` para o cálculo do próximo índice (`(activeVerseIdx + 1) % verses.length`).

### SPEC-CP-03: Módulo Pauta do Altar e Exportação para Cultos ao Vivo (`ControlPanel.tsx`)
* **Objetivo:** Atender integralmente ao Requisito 4.6 do PRD.
* **Especificação de Componente:**
  * No `ControlPanel.tsx`, aprimorar a aba "Pauta do Altar" para compilar tanto os pedidos de oração quanto os pedidos de hinos e dedicatórias pendentes.
  * Adicionar botões de ação: "Copiar Pauta do Altar", "Imprimir Pauta" e "Filtrar por Categoria".

---

## 4. Requisitos de Segurança & Controle de Acesso (RBAC & Mapping)

### SPEC-SC-01: Controle Estrito de Acesso ao Painel do Estúdio (RBAC)
* **Objetivo:** Garantir que apenas usuários com papel `admin` consigam abrir a interface do Estúdio.
* **Especificação de Segurança:**
  * Em `App.tsx` e `ControlPanel.tsx`, validar explicitamente `isLoggedIn && isAdmin` antes de alternar a flag `isControlPanelOpen`.
  * Em `LoginView.tsx`, assegurar que os e-mails autorizados (`vibraefm@gmail.com`, `webradiovozdafe@gmail.com`) recebam automaticamente a propriedade `role: 'admin'` no documento do Firestore `/users/{uid}`.

### SPEC-SC-02: Padronização dos Enums do Status de Pedidos de Hino
* **Objetivo:** Harmonizar os valores de status entre banco de dados, regras de segurança e componentes visuais.
* **Especificação de Mapeamento:**
  * Padronizar o enum de status em toda a aplicação para: `'na_fila' | 'no_ar' | 'atendido'`.
  * Atualizar `firebase-blueprint.json` e as verificações do `ControlPanel.tsx` e `SongRequestSection.tsx` para utilizarem estritamente essa convenção.

---

*Fim da Especificação Funcional e Técnica — Rádio Vóz da Fé.*
