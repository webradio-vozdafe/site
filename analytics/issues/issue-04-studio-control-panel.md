# Issue 04: Painel do Estúdio, Web Audio API e Síntese de Voz (TTS)

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Origem:** `analytics/Spec.md` — Módulo 4  
**Status:** [x] Concluído

---

## 1. Descrição e Objetivo
Finalizar a inicialização do contexto de áudio do estúdio, validar a sintaxe de backups importados e fornecer tratamento gracioso para síntese de voz (TTS).

## 2. Componentes e Arquivos Afetados
- `src/components/ControlPanel.tsx`
- `src/context/RadioContext.tsx`

## 3. Tarefas de Finalização
1. [x] Garantir que o `AudioContext` da Web Audio API seja devidamente retomado/desbloqueado no momento do primeiro gesto do operador na mesa digital.
2. [x] Tratar cenários em que a voz em português (`pt-BR`) do `window.speechSynthesis` não estiver presente, evitando erros não capturados.
3. [x] Validar a estrutura do objeto JSON importado na rotina de restauração de backup antes de substituir o estado das coleções da rádio.
