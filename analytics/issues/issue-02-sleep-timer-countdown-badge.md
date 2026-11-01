# Issue 02: Exibição do Cronômetro de Desligamento no Player

**Data e Hora de Geração:** 31/10/2026 22:30 (Horário de Brasília)

## Descrição
Exibir um indicador visual com contagem regressiva em minutos e segundos no player flutuante quando o timer de sono estiver ativo.

## Requisitos de Implementação
1. Obter `sleepTimerRemainingSec` do `RadioContext`.
2. Formatar o tempo restante em `MM:SS`.
3. Renderizar um badge com o ícone de lua (`Moon`) no `MiniBottomPlayer` e no player principal informando quanto tempo resta para o desligamento automático.
