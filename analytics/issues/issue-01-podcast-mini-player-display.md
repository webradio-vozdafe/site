# Issue 01: Sincronização do Podcast Ativo no Mini Player Flutuante

**Data e Hora de Geração:** 31/10/2026 22:30 (Horário de Brasília)

## Descrição
Exibir o título do episódio de podcast e nome do pregador no `MiniBottomPlayer` quando uma gravação de áudio estiver sendo reproduzida.

## Requisitos de Implementação
1. Obter `activePodcast` do contexto `useRadio()`.
2. Quando `activePodcast` estiver definido, substituir o nome do programa da rádio ao vivo pelas informações do episódio de podcast.
3. Exibir a capa do podcast no miniatura do player flutuante.
