# Relatório de Análise Geral do Sistema — Pendências de Finalização

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (FM 104.9 MHz & Web HD)  
**Escopo:** Mapeamento exclusivo de recursos em andamento e ajustes finos de finalização (SEM NOVAS FUNCIONALIDADES).

---

## 1. Visão Geral do Sistema
A Rádio Vóz da Fé é uma Progressive Web App (PWA) de transmissão web em tempo real construída sobre React 18, TypeScript strict, Vite 5, Tailwind CSS v4 e Firebase (Authentication e Cloud Firestore).

Após rigorosa auditagem da base de código existente, identificou-se que o núcleo da aplicação (Player ao vivo, Mural de Orações, Pedidos de Música, Painel do Estúdio, PWA e Autenticação) está funcional. No entanto, existem pontos específicos de **finalização técnica, resiliência e polimento de comportamento** que necessitam ser concluídos para atingir 100% de estabilidade de produção.

---

## 2. Mapeamento de Pendências de Finalização por Domínio

### A. Player de Áudio e Web Audio API (`src/context/RadioContext.tsx`, `src/components/AudioVisualizer.tsx`, `src/components/SleepTimerModal.tsx`)
1. **Visualizador de Frequência (`AudioVisualizer.tsx`):**
   - *Ponto em andamento:* O laço de renderização `requestAnimationFrame` continua consumindo ciclos de GPU/CPU mesmo quando o áudio está pausado ou no mudo.
   - *Finalização necessária:* Pausar o laço de animação quando `isPlaying` for `false` ou `isMuted` for `true`, limpando o canvas com um gradiente estático elegante.
2. **Sleep Timer / Temporizador de Desligamento (`SleepTimerModal.tsx` & `RadioContext.tsx`):**
   - *Ponto em andamento:* O temporizador encerra a reprodução ao zerar o tempo, mas não exibe um indicador visual discreto com a contagem regressiva ativa no `MiniBottomPlayer` ou `Navbar`.
   - *Finalização necessária:* Conectar o estado do tempo restante do Sleep Timer à barra do Mini Player para o ouvinte acompanhar quanto tempo resta para o desligamento automático.
3. **Reconexão Automática com Exponential Backoff (`RadioContext.tsx`):**
   - *Ponto em andamento:* O erro de stream exibe o botão manual "Tentar Novamente", mas se a rede oscilar e retornar, a reconexão automática depende do evento `online`.
   - *Finalização necessária:* Implementar tentativa automática de reconexão progressiva (3 tentativas com intervalos de 3s, 6s e 12s) antes de declarar falha definitiva no player.

### B. Painel do Estúdio e Pauta do Altar (`src/components/ControlPanel.tsx`)
1. **Filtro e Ordenação Dinâmica na Pauta do Altar:**
   - *Ponto em andamento:* A Pauta do Altar compila pedidos de oração e músicas com dedicatórias em bloco de texto, mas carece de filtro rápido por categoria (ex: "Saúde", "Família", "Música") e ordenação por data de envio.
   - *Finalização necessária:* Finalizar seletores de filtro por categoria de oração e opção de ocultar pedidos já atendidos na visualização da pauta.
2. **Moderação de Conteúdo e Exclusão Segura:**
   - *Ponto em andamento:* A exclusão de mensagens de contato ou pedidos pendentes exige confirmação visual clara para evitar cliques acidentais pelo locutor durante a transmissão ao vivo.
   - *Finalização necessária:* Implementar modal/dialog de confirmação de exclusão acessível (teclado `Escape` / `Enter`) antes de deletar registros no Firestore.

### C. Acessibilidade e Navegação por Teclado (`src/components/MobileDrawer.tsx`, `src/components/SleepTimerModal.tsx`, `src/components/PWAInstallButton.tsx`)
1. **Captura e Restituição de Foco em Modais (Focus Trap):**
   - *Ponto em andamento:* Ao abrir o `MobileDrawer` ou `SleepTimerModal`, o foco do teclado não fica restrito dentro do modal, ferindo as diretrizes WCAG 2.1 AA descritas em `skills/accessibility.md`.
   - *Finalização necessária:* Adicionar travamento de foco (`focus trap`) e suporte ao fechamento nativo por tecla `Escape` com retorno do foco ao elemento acionador.
2. **Anúncios de Estado para Leitores de Tela (ARIA Live Regions):**
   - *Ponto em andamento:* As mudanças do estado do player ("AO VIVO", "Conectando...", "Pausado") e a contagem de intercessões ("Deus te abençoe") ocorrem visualmente, mas não anunciam via `aria-live="polite"`.
   - *Finalização necessária:* Inserir regiões `aria-live` nos indicadores de status do player e contadores do mural de orações.

### D. PWA, Service Worker e Estado Offline (`/public/sw.js`, `src/hooks/usePWAInstall.ts`)
1. **Indicador de Sincronização e Estado Offline (`OfflineIndicator.tsx`):**
   - *Ponto em andamento:* O componente `OfflineIndicator.tsx` notifica quando a conexão cai, mas não exibe o status dos dados salvos localmente em fila para sincronização.
   - *Finalização necessária:* Conectar o indicador para informar ao usuário quando seus pedidos salvos localmente forem enviados com sucesso assim que a rede reestabelecer.

---

## 3. Conclusão da Análise
Nenhuma nova funcionalidade ou alteração de arquitetura é necessária. O sistema encontra-se estruturalmente sólido. As finalizações identificadas visam exclusivamente elevar o nível de polimento, acessibilidade (WCAG 2.1 AA), resiliência de rede e eficiência computacional da aplicação existente.
