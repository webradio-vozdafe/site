# Issue 03: Sincronização Otimista das Intercessões no Mural de Oração

**Data e Hora de Geração:** 31/10/2026 22:30 (Horário de Brasília)

## Descrição
Garantir o incremento otimista instantâneo do contador total de intercessões no cabeçalho do mural ao clicar em "Estou orando por esta causa".

## Requisitos de Implementação
1. No `PrayerWallSection.tsx`, atualizar otimisticamente a contagem individual do pedido no clique do usuário.
2. Atualizar a soma total de orações exibida no painel de intercessão imediatamente, sem atraso de sincronização com o banco.
