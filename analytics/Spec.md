# Especificação Técnica das Finalizações (Spec)

**Data e Hora de Geração:** 31/10/2026 22:30 (Horário de Brasília)  
**Base do Documento:** `/analytics/report.md`  

---

## 1. Escopo da Especificação

Esta especificação detalha as alterações necessárias em componentes, comportamentos e páginas para concluir as finalizações mapeadas no relatório de análise.

---

## 2. Especificações de Componentes e Comportamentos

### 2.1. Componente `MiniBottomPlayer.tsx` — Sincronização de Podcast Ativo
- **Comportamento:**
  - Verificar se `activePodcast` do `RadioContext` não é nulo.
  - Se `activePodcast` estiver ativo:
    - Exibir a imagem da capa do podcast (`activePodcast.coverImage`) ou ícone temático de áudio.
    - Exibir o título do episódio (`activePodcast.title`) na linha principal de texto.
    - Exibir o nome do pregador/apresentador (`activePodcast.speaker`) no subtítulo com a tag `[Podcast/Pregação]`.
  - Se `activePodcast` for nulo:
    - Manter a exibição do programa ao vivo e música atual da rádio.

### 2.2. Componente `MiniBottomPlayer.tsx` & `LivePlayerHero.tsx` — Badge do Sleep Timer
- **Comportamento:**
  - Ler o estado `sleepTimerRemainingSec` do `RadioContext`.
  - Se `sleepTimerRemainingSec` for diferente de `null` e maior que `0`:
    - Formatar os segundos restantes no formato `MM:SS` (ex: `14:59`).
    - Renderizar um selo/badge com ícone de lua (`Moon`) e o texto `"Desligar em MM:SS"`.
    - Ao clicar no badge, abrir o modal de confirmação ou permitir cancelar o timer de sono (`setSleepTimer(null)`).

### 2.3. Componente `PrayerWallSection.tsx` — Contagem Otimista de Intercessões
- **Comportamento:**
  - No manipulador `handlePray(id)`:
    - Adicionar o `id` da oração ao estado `prayedIds`.
    - Incrementar otimisticamente o contador `prayersCount` no item correspondente da lista local de `prayerRequests`.
    - Garantir que a soma exibida no cabeçalho do mural (`totalIntercessions`) reflita o incremento instantaneamente sem aguardar a rodada de sincronização do Firestore.

### 2.4. Componente `SongRequestSection.tsx` — Destaque de Status "No Ar"
- **Comportamento:**
  - No mapeamento dos cartões de pedidos de hinos (`songRequests.map`):
    - Identificar se `request.status === 'no_ar'`.
    - Se estiver `'no_ar'`, aplicar estilização de destaque com borda dourada animada/brilhante, badge `"NO AR NO ESTÚDIO"` com ponto pulsante verde/dourado e plano de fundo destacado.
    - Se estiver `'atendido'`, exibir badge `"Atendido no Ar"`.
