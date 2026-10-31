# Issue 02: Suporte e Preservação da URL SD de 64 kbps

**Data e Hora de Geração:** 28/10/2026 10:46 (Horário de Brasília)

## Descrição
Garantir que a seleção da transmissão econômica (64 kbps) carregue e preserve a URL `https://server15.srvsh.com.br:8912/SD` sem sanitizações que removam o ponto de montagem `/SD`.

## Escopo e Requisitos
1. Verificar a função `getEffectiveStreamUrl` em `src/context/RadioContext.tsx`.
2. Assegurar que ao selecionar um perfil de `currentQuality`, o valor exato de `currentQuality.url` seja respeitado pelo elemento de áudio.
