# Especificação Técnica — O que Falta Implementar (Finalizações)

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (FM 104.9 MHz & Web HD)  
**Base do Documento:** `/analytics/report.md`  
**Escopo:** Especificação técnica detalhada das finalizações pendentes por página, comportamento e componente.

---

## 1. Escopo de Especificação (Página, Comportamento, Componente)

---

### Módulo A: Player & Audio Pipeline

#### 1. Componente: `AudioVisualizer.tsx`
* **Tipo:** Otimização de Comportamento de Componente
* **Comportamento Atual:** O loop `requestAnimationFrame` executa continuamente no canvas, mesmo quando o áudio está pausado ou em silêncio.
* **Comportamento Especificado:**
  - O laço de animação deve ser cancelado (`cancelAnimationFrame`) quando `isPlaying === false` ou `isMuted === true`.
  - Quando inativo, renderizar no canvas um estado de repouso limpo (linha central sutil com degradê nas cores da paleta `--gold`/`--forest`).
  - Reiniciar o laço de animação suavemente ao retomar a reprodução.

#### 2. Componentes: `MiniBottomPlayer.tsx` & `Navbar.tsx` (Sleep Timer Badge)
* **Tipo:** Exibição de Comportamento de Estado
* **Comportamento Atual:** O Sleep Timer desliga o áudio no tempo programado, mas o tempo restante só é visível se o ouvinte abrir o `SleepTimerModal.tsx`.
* **Comportamento Especificado:**
  - Exibir um badge compacto de contagem regressiva (ex: `⏱ 14m`) junto ao botão do Sleep Timer no `MiniBottomPlayer` e na `Navbar` quando `sleepTimerRemaining > 0`.
  - Atualizar o badge a cada minuto em contagem regressiva.
  - Remover o badge automaticamente ao atingir zero ou ao cancelar o temporizador.

#### 3. Comportamento: Reconexão Automática de Áudio (`RadioContext.tsx`)
* **Tipo:** Comportamento de Resiliência da Camada de Serviço
* **Comportamento Atual:** Falhas de transmissão exibem o botão manual "Tentar Novamente", mas não tentam reconexão automática ao recuperar sinal.
* **Comportamento Especificado:**
  - Em caso de evento `error` ou `stalled` no elemento `<audio>`, disparar até 3 tentativas automáticas de reconexão.
  - Intervalos de tempo com backoff exponencial: 3 segundos na 1ª tentativa, 6 segundos na 2ª tentativa e 12 segundos na 3ª tentativa.
  - Exibir estado intermediário `"Reconectando... (tentativa X/3)"` no player sem travar a interface.

---

### Módulo B: Painel do Estúdio & Pauta do Altar

#### 1. Componente: `ControlPanel.tsx` (Filtros da Pauta do Altar)
* **Tipo:** Comportamento e Funcionalidade de Componente
* **Comportamento Atual:** A Pauta do Altar exibe todos os pedidos em sequência textual sem opções de filtragem rápida por categoria.
* **Comportamento Especificado:**
  - Adicionar seletor de filtro por Categoria (`"Todas"`, `"Família"`, `"Saúde"`, `"Libertação"`, `"Gratidão"`, `"Hinos Pedidos"`).
  - Adicionar toggle para ocultar/exibir pedidos marcados como `"atendido"`.
  - Garantir que a cópia formatada em 1-clique respeite os filtros ativos na tela.

#### 2. Componente: `ControlPanel.tsx` (Modal de Confirmação de Exclusão)
* **Tipo:** Componente de Segurança de Interface
* **Comportamento Atual:** Exclusões de mensagens ou pedidos usam `window.confirm` genérico do navegador.
* **Comportamento Especificado:**
  - Substituir `window.confirm` por um modal de confirmação acessível customizado com visual alinhado à marca (cores `--forest` e `--gold`).
  - Oferecer botões claros de "Cancelar" e "Confirmar Exclusão".
  - Suportar atalho `Escape` para cancelar e `Enter` para confirmar.

---

### Módulo C: Acessibilidade & WCAG 2.1 AA

#### 1. Componentes: `MobileDrawer.tsx` & `SleepTimerModal.tsx` (Focus Trap & ARIA)
* **Tipo:** Comportamento Acessível de Modais
* **Comportamento Atual:** Modais abertos não prendem o foco do teclado (Tab navega para elementos de fundo fora do modal).
* **Comportamento Especificado:**
  - Implementar Focus Trap: ao navegar com `Tab` ou `Shift+Tab`, o foco deve circular estritamente entre os elementos focáveis do modal ativo.
  - Ao pressionar a tecla `Escape`, o modal deve fechar imediatamente e o foco deve retornar ao botão que abriu o modal.
  - Adicionar `aria-modal="true"` e `role="dialog"` com rótulos `aria-labelledby` apropriados.

#### 2. Comportamento: `aria-live` em Atualizações em Tempo Real
* **Tipo:** Comportamento de Acessibilidade
* **Comportamento Atual:** Alterações no status do player e incrementos de intercessão no Mural de Orações são puramente visuais.
* **Comportamento Especificado:**
  - Adicionar contêiner invisível com `aria-live="polite"` e `aria-atomic="true"`.
  - Emitir anúncios curtos ao leitor de tela (ex: `"Rádio Voz da Fé ao vivo"`, `"Oração enviada com sucesso"`, `"Intercessão registrada"`).

---

### Módulo D: PWA & Notificações de Sincronização

#### 1. Componente: `OfflineIndicator.tsx` (Status de Fila Offline)
* **Tipo:** Polimento de Componente PWA
* **Comportamento Atual:** O indicador mostra apenas "Você está offline" sem informar sobre pedidos em fila.
* **Comportamento Especificado:**
  - Quando houver pedidos armazenados em cache local aguardando envio, exibir mensagem complementar: `"Você está offline. Seus pedidos foram salvos e serão enviados ao reconectar."`
  - Ao recuperar a conexão e concluir o envio silencioso, exibir toast temporário: `"Sua conexão retornou. Pedidos sincronizados com o estúdio!"`
