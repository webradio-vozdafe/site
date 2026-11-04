# Plano de Execução Técnica das Issues — Rádio Vóz da Fé

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Status do Plano:** [x] **Todas as Issues Concluídas com Sucesso**  
**Arquivos de Entrada:** `/analytics/issues/issue-01-pwa-lifecycle.md` até `issue-05-sleep-timer-mini-player.md`

---

## 1. Visão Geral do Planejamento e Execução
Este plano estabeleceu a estratégia detalhada de execução técnica e validação para a resolução ordenada das 5 issues mapeadas na pasta `/analytics/issues/`. Todas as etapas foram concluídas, testadas e validadas com sucesso sem a introdução de novas funcionalidades fora do escopo.

---

## 2. Status de Execução Técnica por Issue

### 2.1. [x] Issue 01: PWA, Instalação e Ciclo de Vida do Service Worker — CONCLUÍDO
- **Arquivos Mapeados:** `src/components/PWAInstallButton.tsx`, `src/hooks/usePWAInstall.ts`, `public/sw.js`, `src/main.tsx`.
- **Tarefas Finalizadas:**
  1. [x] Validar no hook `usePWAInstall.ts` a verificação contínua do modo `standalone` através de listener reativo em `window.matchMedia('(display-mode: standalone)')`.
  2. [x] Confirmar a captura do evento `beforeinstallprompt` no estado global `window.__pwaInstallPrompt` para disparar a janela nativa do navegador ao clicar nos botões de instalação.
  3. [x] Revisar o parâmetro `immediate: true` na chamada do `registerSW` em `src/main.tsx` para assegurar o registro imediato e o purge de caches antigos no `activate` do Service Worker.
- **Resultado:** Os botões de instalação acionam o prompt nativo do navegador e são ocultados quando a aplicação roda em modo standalone.

### 2.2. [x] Issue 02: Persistência de Qualidade de Áudio e Auto-Reconexão de Rede — CONCLUÍDO
- **Arquivos Mapeados:** `src/context/RadioContext.tsx`, `src/components/NowPlayingSection.tsx`, `src/App.tsx`.
- **Tarefas Finalizadas:**
  1. [x] No `RadioContext.tsx`, adicionar leitura inicial do `localStorage.getItem('vozdafe_audio_quality')` e gravar a seleção no manipulador `setQuality`.
  2. [x] Implementar a rotina de encerramento seguro da instância de áudio (`audioRef.current.pause()`, remoção de ouvintes de eventos e redefinição de atributos) antes da inicialização de nova URL de bitrate.
  3. [x] No handler do evento `window.addEventListener('online')` em `App.tsx`, checar se o estado de reprodução estava ativo antes da queda de sinal e invocar a função `retryPlayback()`.
- **Resultado:** A preferência de qualidade é persistida no navegador e o player reconecta automaticamente ao restabelecer a conexão de rede.

### 2.3. [x] Issue 03: Atualização Otimista no Mural de Oração e Resiliência no Firestore — CONCLUÍDO
- **Arquivos Mapeados:** `src/components/PrayerWallSection.tsx`, `src/components/SongRequestSection.tsx`, `src/context/RadioContext.tsx`.
- **Tarefas Finalizadas:**
  1. [x] No manipulador de intercessão do `PrayerWallSection.tsx`, atualizar o contador `prayersCount` no estado local da lista imediatamente, disparando a atualização no Firestore de forma assíncrona com reversão em caso de erro.
  2. [x] Adicionar bloco `try/catch` nas chamadas do Firestore para exibir mensagens via `showNotice` em caso de falta de conexão ou falhas de gravação.
  3. [x] Aplicar sanitização de strings (`trim()`, remoção de caracteres de controle e limite de tamanho) antes de persistir novos pedidos de oração ou solicitações musicais.
- **Resultado:** Resposta visual instantânea no Mural de Oração e resiliência offline em operações de banco de dados.

### 2.4. [x] Issue 04: Painel do Estúdio, Web Audio API e Síntese de Voz (TTS) — CONCLUÍDO
- **Arquivos Mapeados:** `src/components/ControlPanel.tsx`, `src/context/RadioContext.tsx`.
- **Tarefas Finalizadas:**
  1. [x] Inserir uma chamada `audioContext.resume()` vinculada ao primeiro clique em qualquer controle da mesa digital para garantir o desbloqueio da Web Audio API pelas políticas do navegador.
  2. [x] Verificar no utilitário de locução por voz se `window.speechSynthesis.getVoices()` contém vozes para `pt-BR`. Caso ausente, direcionar para apresentação visual da hora certa/versículo sem falhar com exceções.
  3. [x] Adicionar uma função de validação de esquema JSON no modal de restauração de backup, conferindo a presença das chaves obrigatórias (`programs`, `prayers`, `songs`, `verses`, `contacts`, `podcasts`) antes de sobreescrever a base de dados.
- **Resultado:** Soundboard e chamadas de hora certa operam sem travamentos e backups inválidos são filtrados antes da restauração.

### 2.5. [x] Issue 05: Temporizador de Sono e Ajustes de Layout do Mini Player — CONCLUÍDO
- **Arquivos Mapeados:** `src/components/SleepTimerModal.tsx`, `src/components/MiniBottomPlayer.tsx`, `src/components/BottomNavigation.tsx`.
- **Tarefas Finalizadas:**
  1. [x] Reformular o temporizador de sono no `RadioContext.tsx` armazenando o timestamp final (`targetTime = Date.now() + durationMs`). No intervalo de atualização, calcular `remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000))`.
  2. [x] No `MiniBottomPlayer.tsx`, ajustar as classes utilitárias do Tailwind CSS para usar `bottom-[58px] lg:bottom-0` e `z-40`, mantendo o player perfeitamente alinhado acima da barra móvel (`BottomNavigation.tsx`) sem cobrir elementos interativos.
- **Resultado:** Desligamento programado preciso mesmo com a aba em segundo plano e layout limpo no rodapé móvel.

---

## 3. Matriz de Validação e Testes de Qualidade
1. [x] **Compilação TypeScript:** Executado `npm run lint` (`tsc --noEmit`) sem erros.
2. [x] **Build de Produção:** Executado `npm run build` (`vite build && node scripts/copy-build.js`) com sucesso.
3. [x] **Verificação Visual:** Testes de usabilidade e responsividade concluídos.

---
*Fim do Plano de Execução Técnica — Todas as Etapas Concluídas com Sucesso.*
