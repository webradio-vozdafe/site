# Especificação de Requisitos de Finalização (Spec.md) — Rádio Vóz da Fé

**Data e Hora de Geração:** 03/11/2026 às 13:49 (Horário de Brasília - BRT)  
**Base do Relatório:** `analytics/report.md`  
**Escopo:** Especificação exclusiva do que falta finalizar no sistema (Página, Comportamento e Componentes).

---

## 1. Módulo 1: PWA, Instalação e Ciclo de Vida do Service Worker

### 1.1. Componente: `PWAInstallButton.tsx`
- **Comportamento Esperado:**
  - Detectar o evento `beforeinstallprompt` capturado no estado global (`window.__pwaInstallPrompt`).
  - Ao clicar em "Instalar", executar a chamada assíncrona do prompt de instalação nativo do navegador.
  - Exibir modal de orientação (`showGuide`) quando o evento de prompt nativo não for disparado diretamente (ex.: navegadores iOS Safari ou exibição em iframe).
  - Atualizar o estado `isInstalled` e ocultar o botão de instalação após a confirmação do evento `appinstalled` ou ao rodar em `display-mode: standalone`.

### 1.2. Arquivo e Script: `/public/sw.js` & `src/main.tsx`
- **Comportamento Esperado:**
  - Registrar o Service Worker `/sw.js` no carregamento da aplicação em ambientes suportados.
  - Gerenciar a estratégia de cache estático dos arquivos principais (`index.html`, manifesto e assets).
  - Executar a limpeza de caches antigos na etapa de ativação (`activate`) do Service Worker.

---

## 2. Módulo 2: Player de Áudio, Qualidade e Recuperação de Conexão

### 2.1. Componente: `NowPlayingSection.tsx` & Contexto `RadioContext.tsx`
- **Comportamento Esperado:**
  - Permitir a alternância entre os bitrates de transmissão (HD 128 kbps, Alt 128 kbps e Econômico 64 kbps).
  - Persistir a opção de qualidade selecionada pelo usuário no `localStorage` do navegador para manter a preferência entre sessões.
  - Ao alternar a qualidade ou reconectar, interromper completamente o fluxo de áudio anterior e reinstanciar o objeto de áudio de forma limpa.

### 2.2. Comportamento Global de Rede (`isOnline` / Auto-Reconexão)
- **Comportamento Esperado:**
  - Escutar os eventos nativos `online` e `offline` da janela.
  - Ao reconectar à internet (`online`), acionar a rotina de reconexão do player de áudio se ele estava em execução antes da queda da conexão.
  - Exibir notificação informativa no topo da tela sem interromper a usabilidade do ouvinte.

---

## 3. Módulo 3: Mural de Oração e Pedidos de Hino (Firestore em Tempo Real)

### 3.1. Componente: `PrayerWallSection.tsx`
- **Comportamento Esperado:**
  - Ao clicar em "Orar por este pedido", disparar a atualização do contador de orações no Firestore e exibir efeito festivo (`canvas-confetti`).
  - Aplicar atualização otimista na interface do ouvinte para que o número de orações seja incrementado instantaneamente.
  - Tratar exceções de rede ou bloqueios de permissão no Firestore exibindo aviso amigável ao usuário sem interromper a execução do aplicativo.

### 3.2. Componente: `SongRequestSection.tsx` & Formulários
- **Comportamento Esperado:**
  - Validar e higienizar os campos obrigatórios (nome, música e cantor) antes de enviar a solicitação para a coleção `songRequests` do Firestore.
  - Exibir mensagem de confirmação de envio e limpar o formulário após a gravação bem-sucedida.

---

## 4. Módulo 4: Painel do Estúdio (Mesa Digital, Web Audio e TTS)

### 4.1. Componente: `ControlPanel.tsx`
- **Comportamento Esperado:**
  - Inicializar e retomar o contexto de áudio da Web Audio API (`AudioContext.resume()`) mediante interação do operador para liberação de efeitos e vinhetas.
  - Executar a locução da hora certa e versículos via Web Speech API (`SpeechSynthesis`), tratando a ausência de vozes em português (`pt-BR`) com fallback silencioso ou textual.
  - Validar a integridade estrutural de arquivos JSON importados na ferramenta de restauração de backup antes de sobrescrever os dados no sistema.

---

## 5. Módulo 5: Sleep Timer e Adaptabilidade do Mini Player Móvel

### 5.1. Componentes: `SleepTimerModal.tsx` & `MiniBottomPlayer.tsx`
- **Comportamento Esperado:**
  - Manter a contagem regressiva do temporizador de sono precisa utilizando cálculo baseado na hora do sistema (`Date.now()`), prevenindo desacelerações por throttling da aba em segundo plano.
  - Ajustar o posicionamento e os limites verticais do `MiniBottomPlayer.tsx` em dispositivos móveis para evitar sobreposição com o menu de navegação flutuante (`BottomNavigation.tsx`).
