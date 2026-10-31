# Issue 01: Correção de Chave Duplicada no Dropdown de Qualidade

**Data e Hora de Geração:** 28/10/2026 10:46 (Horário de Brasília)

## Descrição
Eliminar o aviso de console do React referente a chaves não únicas ao renderizar a lista de perfis de áudio no player.

## Escopo e Requisitos
1. No menu de seleção de qualidade em `src/App.tsx`, substituir `key={q.bitrate}` por `key={q.url}`.
2. Garantir que cada item da lista possua identificação exclusiva no Virtual DOM.
