# Especificação de Requisitos de Finalização (Spec.md) — Rádio Vóz da Fé

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Base de Análise:** `analytics/report.md`  
**Escopo:** Especificação técnica focada exclusivamente no que falta finalizar (Páginas, Comportamentos e Componentes).

---

## 1. Módulo 1: PWA, Instalação e Gerenciamento do Service Worker

### 1.1. Componente: `PWAInstallButton.tsx` & Hook `usePWAInstall.ts`
- **Página / Local:** Cabeçalho da aplicação (`Navbar.tsx`), Menu lateral móvel (`MobileDrawer.tsx`) e Botão flutuante (`App.tsx`).
- **Comportamentos Requeridos:**
  - Detectar estado `isInstalled` via media query `(display-mode: standalone)` e ocultar botões de instalação após a confirmação de instalação no dispositivo.
  - Ao clicar no botão de instalação, executar a chamada do prompt nativo `beforeinstallprompt` quando capturado.
  - Oferecer orientação e atalho de abertura em aba direta para contextos limitados (iframes e WebViews de redes sociais).

### 1.2. Arquivos: `/public/sw.js` & `src/main.tsx`
- **Comportamentos Requeridos:**
  - Garantir o registro do Service Worker via `virtual:pwa-register` com estratégia de atualização automática (`immediate: true`).
  - Executar a limpeza de versões de cache desatualizadas durante o evento `activate` no Service Worker.

---

## 2. Módulo 2: Player de Áudio, Qualidade e Auto-Reconexão de Rede

### 2.1. Componente: `NowPlayingSection.tsx` & Contexto `RadioContext.tsx`
- **Página / Local:** Seção principal do player ao vivo (`/inicio`).
- **Comportamentos Requeridos:**
  - Persistir a preferência de bitrate selecionada (HD 128 kbps ou Econômico 64 kbps) no `localStorage` sob a chave `vozdafe_audio_quality`.
  - Ao alternar a qualidade do áudio ou solicitar reconexão, realizar a limpeza da instância do áudio (`audioRef.current.pause()`, remoção de ouvintes de eventos e reatribuição da URL).

### 2.2. Comportamento do Ciclo de Rede (`isOnline`)
- **Página / Local:** Escuta global na aplicação (`App.tsx`).
- **Comportamentos Requeridos:**
  - Monitorar eventos de rede `online` e `offline`.
  - Quando a conexão for restabelecida (`online`), acionar automaticamente a reconexão da rádio caso estivesse em execução antes da perda de sinal.

---

## 3. Módulo 3: Mural de Oração e Pedidos de Hino (Firestore)

### 3.1. Componente: `PrayerWallSection.tsx`
- **Página / Local:** Seção do Mural de Oração (`/oracao`).
- **Comportamentos Requeridos:**
  - Implementar incremento otimista local no contador de orações ao clicar em "Orar por este pedido" antes da resposta da escrita no Firestore.
  - Capturar falhas de gravação ou escuta no Firestore exibindo mensagem informativa amigável via aviso flutuante (`showNotice`).

### 3.2. Componente: `SongRequestSection.tsx`
- **Página / Local:** Seção de Pedido de Hinos (`/pedir-hino`).
- **Comportamentos Requeridos:**
  - Validar e higienizar os campos antes da gravação no Firestore (remover espaços em branco excessivos e aplicar limite de caracteres).
  - Exibir confirmação visual de envio e resetar os campos do formulário.

---

## 4. Módulo 4: Painel do Estúdio (`ControlPanel.tsx`)

### 4.1. Componente: `ControlPanel.tsx`
- **Página / Local:** Painel de Controle do Estúdio (`/estudio`).
- **Comportamentos Requeridos:**
  - Garantir o desbloqueio do `AudioContext` da Web Audio API mediante primeira interação do operador na mesa digital.
  - Adicionar verificação e tratamento na chamada de sintetização de voz (`SpeechSynthesisUtterance`), prevendo cenários em que o idioma `pt-BR` não esteja instalado no sistema.
  - Validar o formato dos dados de entrada durante a importação de backup em JSON, impedindo a sobreposição de estados inválidos.

---

## 5. Módulo 5: Sleep Timer e Ajuste de Layout do Mini Player

### 5.1. Componente: `SleepTimerModal.tsx`
- **Página / Local:** Modal de Temporizador de Sono.
- **Comportamentos Requeridos:**
  - Calcular o tempo restante com base na diferença em milissegundos entre o momento atual e a hora de encerramento alvo (`targetTimestamp - Date.now()`), garantindo precisão mesmo em segundo plano.

### 5.2. Componente: `MiniBottomPlayer.tsx`
- **Página / Local:** Rodapé flutuante da aplicação em telas móveis.
- **Comportamentos Requeridos:**
  - Ajustar o z-index e o espaçamento inferior (`pb-safe`) em telas menores que 640px para evitar sobreposição com o menu de navegação inferior (`BottomNavigation.tsx`).
