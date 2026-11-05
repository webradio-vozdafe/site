# Plano Estratégico de Implementação — Issues / Analytics (Finalizações)

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Data e Hora de Conclusão:** 05/11/2026 10:07 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (FM 104.9 MHz & Web HD)  
**Status do Documento:** EXECUÇÃO CONCLUÍDA (100% das Issues Finalizadas e Validadas)  
**Diretiva:** Execução rigorosa dos módulos e sinalização de progresso.

---

## 1. Visão Geral do Planejamento
Este documento estabelece o plano de execução para implementar sequencialmente todas as 5 issues derivadas da análise de finalizações no repositório (`/analytics/issues/`). O plano foi executado respeitando as diretrizes de **modificação mínima, resiliência do sistema, acessibilidade WCAG 2.1 AA e preservação das funcionalidades existentes**.

---

## 2. Cronograma e Ordem Técnica de Execução

| Etapa | Issue Alvo | Foco Técnico | Status |
| :---: | :--- | :--- | :---: |
| **Fase 1** | `issue-01-audio-visualizer-and-reconnection.md` | Interrupção de rAF no canvas com áudio inativo e reconexão automática exponencial no `RadioContext`. | **[CONCLUÍDO]** |
| **Fase 2** | `issue-02-sleep-timer-badge.md` | Exibição de badge compacto com contagem regressiva no `MiniBottomPlayer` e `Navbar`. | **[CONCLUÍDO]** |
| **Fase 3** | `issue-03-pauta-do-altar-filters-and-deletion.md` | Filtros por categoria na Pauta do Altar e modal de confirmação acessível em `ControlPanel.tsx`. | **[CONCLUÍDO]** |
| **Fase 4** | `issue-04-accessibility-focus-trap-and-aria-live.md` | Implementação de Focus Trap em modais (`MobileDrawer`, `SleepTimerModal`) e região `aria-live`. | **[CONCLUÍDO]** |
| **Fase 5** | `issue-05-offline-sync-indicator.md` | Notificação de contagem de itens em fila local e aviso de reconexão no `OfflineIndicator.tsx`. | **[CONCLUÍDO]** |

---

## 3. Detalhamento Técnico das Etapas

### Fase 1: Visualizador e Reconexão de Áudio (`issue-01-audio-visualizer-and-reconnection.md`)
* **Pesquisa & Análise:** Avaliar o ciclo de vida do `requestAnimationFrame` em `AudioVisualizer.tsx` e os eventos de erro no `RadioContext.tsx`.
* **Plano de Ação:**
  1. Adicionar condição de pausa no laço de animação do `AudioVisualizer.tsx` quando `!isPlaying || isMuted`.
  2. Implementar função `scheduleExponentialRetry(attempt)` no `RadioContext.tsx` utilizando `setTimeout` progressivos (3s, 6s, 12s).
* **Validação:** Verificar redução de uso de CPU com player pausado e testar simulação de queda de rede.

### Fase 2: Visualização do Sleep Timer (`issue-02-sleep-timer-badge.md`)
* **Pesquisa & Análise:** Verificar a disponibilidade do tempo restante do Sleep Timer no `RadioContext.tsx`.
* **Plano de Ação:**
  1. Formatar os minutos restantes (`Math.ceil(remainingMs / 60000)`).
  2. Inserir badge estilizado com paleta `--gold` no `MiniBottomPlayer.tsx` e `Navbar.tsx`.
* **Validação:** Ativar o timer para 15 minutos e checar a presença do badge `⏱ 15m`.

### Fase 3: Filtros da Pauta do Altar e Modal de Confirmação (`issue-03-pauta-do-altar-filters-and-deletion.md`)
* **Pesquisa & Análise:** Verificar o estado de filtragem dos arrays de oração e músicas no `ControlPanel.tsx`.
* **Plano de Ação:**
  1. Criar estado `selectedCategoryFilter` no `ControlPanel.tsx`.
  2. Criar sub-componente modal de confirmação de exclusão acessível.
* **Validação:** Selecionar a categoria "Família" e conferir a atualização da pauta filtrada.

### Fase 4: Focus Trap e Acessibilidade (`issue-04-accessibility-focus-trap-and-aria-live.md`)
* **Pesquisa & Análise:** Mapear elementos focáveis em `MobileDrawer.tsx` e `SleepTimerModal.tsx`.
* **Plano de Ação:**
  1. Adicionar ouvinte de tecla `Tab` para interceptar a navegação e mantê-la no container modal.
  2. Adicionar região `<div aria-live="polite" className="sr-only" />` no `App.tsx`.
* **Validação:** Navegar por teclado usando `Tab` com o modal aberto e checar se o foco permanece contido.

### Fase 5: Indicador de Fila Offline (`issue-05-offline-sync-indicator.md`)
* **Pesquisa & Análise:** Verificar o leitor de fila local no `usePWAInstall.ts` ou `RadioContext.tsx`.
* **Plano de Ação:**
  1. Exibir badge informativo no `OfflineIndicator.tsx` indicando pendências offline.
  2. Disparar toast ao retornar a conexão `online`.
* **Validação:** Enviar pedido offline e conferir o aviso de contagem no indicador.

---

## 4. Estratégia de Verificação e Qualidade
Quando autorizado a iniciar as alterações, cada etapa será validada executando:
1. `compile_applet`: Verificação TypeScript strict sem erros.
2. `lint_applet`: Verificação de sintaxe e imports sem avisos.

---

*Fim do Plano Estratégico de Implementação — Rádio Vóz da Fé.*
