# Issue 05: Indicador de Fila Offline e Confirmação de Re-sincronização

**Data e Hora de Geração:** 05/11/2026 10:01 (Horário de Brasília)  
**Prioridade:** Média  
**Componente:** `/src/components/OfflineIndicator.tsx`

---

## Descrição do Problema
Quando o ouvinte está sem internet e faz um pedido de oração ou música, o sistema salva o pedido offline, mas o `OfflineIndicator.tsx` não informa se existem dados pendentes de envio.

## Tarefas de Implementação
1. Conectar `OfflineIndicator.tsx` ao estado de fila local de pedidos salvos offline.
2. Exibir mensagem adaptativa indicando o número de pedidos em fila (ex: `"Você está offline. 1 pedido de oração salvo."`).
3. Disparar um aviso temporário de confirmação quando a internet retornar e a sincronização for realizada.

## Critérios de Aceite
* O ouvinte sabe exatamente quantos itens foram armazenados localmente para envio posterior.
* A reconexão é acompanhada de feedback transparente ao usuário.
