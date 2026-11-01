# Issue 04: Destaque de Status "No Ar" na Fila de Hinos

**Data e Hora de Geração:** 31/10/2026 22:30 (Horário de Brasília)

## Descrição
Melhorar a apresentação visual da lista de hinos solicitados pelos ouvintes para destacar os louvores marcados como "No Ar" pelo estúdio.

## Requisitos de Implementação
1. Identificar pedidos com `status === 'no_ar'` e `'atendido'` em `SongRequestSection.tsx`.
2. Adicionar badge "NO AR NO ESTÚDIO" com animação de ponto pulsante nos pedidos ao vivo.
3. Aplicar estilo visual de destaque nos cartões correspondentes.
