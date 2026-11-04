# Relatório de Análise Geral do Sistema — Rádio Vóz da Fé

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Status:** Análise de Finalizações e Pendências (Sem novas implementações)

---

## 1. Visão Geral e Objetivo
Este relatório apresenta uma análise técnica minuciosa do sistema **Rádio Vóz da Fé**, alinhado às diretrizes do PRD (`references/PRD.md`) e da Arquitetura do Sistema (`references/architecture.md`). O foco deste documento abrange exclusivamente as **funcionalidades em andamento e pendentes de finalização**, identificando pontos de ajuste, polimento e resiliência. **Nenhuma nova funcionalidade ou expansão de escopo é criada neste relatório.**

---

## 2. Mapeamento Geral de Implementações em Andamento e Pendências

### 2.1. Módulo PWA, Instalação e Ciclo de Vida do Service Worker
- **Estado Atual:** Manifesto PWA (`/public/manifest.json`), ícones compatíveis gerados (192x192, 512x512, maskable e apple-touch-icon), Service Worker (`/public/sw.js`) e hook de captura de instalação (`usePWAInstall.ts`) ativados.
- **Pendências de Finalização:**
  1. **Detecção de Standalone e Ocultação:** Garantir que o botão de instalação seja ocultado de forma consistente quando a aplicação for aberta no modo `standalone` em navegadores móveis e desktops.
  2. **Tratamento de Iframe e WebViews:** Refinar o fluxo de direcionamento e cópia do link do applet no modal de instalação quando acessado via WebView (ex.: WhatsApp/Instagram) ou iframe de preview.
  3. **Versionamento e Cache do SW:** Assegurar invalidação e atualização automática do cache do Service Worker na liberação de novas compilações.

### 2.2. Módulo de Áudio, Qualidade e Auto-Reconexão
- **Estado Atual:** Reprodução de áudio via elemento HTML5 `<audio>` conectando ao stream Shoutcast, seletor de bitrate e tentativa de reconexão manual.
- **Pendências de Finalização:**
  1. **Persistência de Qualidade:** Salvar a preferência de bitrate (HD 128 kbps ou Econômico 64 kbps) no `localStorage` e restaurá-la na inicialização do app.
  2. **Gestão do Ciclo de Vida do Áudio:** Garantir a destruição e recriação limpa da instância de áudio no `RadioContext` durante a troca de bitrate ou reconexões para evitar sobreposição de sons ou vazamentos de memória.
  3. **Reconexão Automática Pós-Offline:** Disparar a reconexão automática do player assim que o evento de rede `online` for detectado, caso o áudio estivesse sendo reproduzido anteriormente.

### 2.3. Módulo Firestore, Tempo Real e Tratamento de Erros
- **Estado Atual:** Mural de Oração (`PrayerWallSection.tsx`) e Pedidos de Hino (`SongRequestSection.tsx`) com escuta em tempo real (`onSnapshot`) e efeito de confetes (`canvas-confetti`).
- **Pendências de Finalização:**
  1. **Atualização Otimista:** Aplicar incremento otimista imediato na contagem de orações na interface antes da confirmação de gravação do Firestore.
  2. **Tratamento de Erros e Permissões:** Tratar graciosamente exceções de rede ou rejeições de segurança do Firestore exibindo avisos ao usuário sem travar a interface.
  3. **Higienização de Formulários:** Garantir a validação estrita e higienização dos campos de texto (nome, mensagem, dedicatória) antes da persistência no banco.

### 2.4. Módulo Painel de Controle do Estúdio (`ControlPanel.tsx`)
- **Estado Atual:** Ferramentas operacionais no estúdio, incluindo soundboard (Web Audio API), chamada de hora certa (Web Speech API / TTS), pauta do altar, gerenciador de versículos e exportação/importação de backup.
- **Pendências de Finalização:**
  1. **Ativação da Web Audio API:** Garantir que o `AudioContext` seja ativado/desbloqueado no primeiro clique do usuário no ambiente do estúdio para evitar bloqueios de áudio.
  2. **Fallback para Síntese de Voz (TTS):** Tratar cenários onde a voz em português (`pt-BR`) não estiver disponível no sistema do usuário, providenciando aviso visual ou fallback textual.
  3. **Validação Estrutural de Backup:** Validar o esquema e integridade dos arquivos JSON importados antes de substituir os dados em memória/Firestore.

### 2.5. Módulo Sleep Timer e Ajustes do Mini Player Móvel
- **Estado Atual:** Temporizador de desligamento programado (`SleepTimerModal.tsx`) e player flutuante no rodapé (`MiniBottomPlayer.tsx`).
- **Pendências de Finalização:**
  1. **Precisão do Sleep Timer:** Utilizar cálculo baseado na estampa de tempo do sistema (`Date.now()`) para prevenir desvios na contagem regressiva quando a aba entrar em segundo plano.
  2. **Ajuste do Mini Player em Dispositivos Móveis:** Ajustar z-index e margem inferior do `MiniBottomPlayer.tsx` para evitar sobreposição com a barra de navegação inferior móvel (`BottomNavigation.tsx`).

---

## 3. Conclusão
O sistema **Rádio Vóz da Fé** encontra-se em estágio avançado e estável. As pendências relatadas cobrem exclusivamente o polimento, a resiliência e a finalização das rotinas existentes, garantindo conformidade com o PRD e a arquitetura do projeto sem adição de novas funcionalidades.
