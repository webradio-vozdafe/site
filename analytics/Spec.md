# Especificação Técnica de Finalizações (Spec)

**Data e Hora de Geração:** 25/10/2026 17:55 (Horário de Brasília)

Esta especificação detalha os componentes, comportamentos e páginas que demandam finalização, com base no relatório `analytics/report.md`.

---

## 1. Behavior / API: Integração com a Media Session API
- **Arquivo Alvo:** `src/context/RadioContext.tsx`
- **Classificação:** Behavior / API
- **Especificação:**
  - Verificar a existência de `'mediaSession' in navigator`.
  - Configurar `navigator.mediaSession.metadata` sempre que `currentTrackInfo`, `currentShow` ou `radioData` forem atualizados, com `title`, `artist`, `album` e `artwork`.
  - Definir os manipuladores de ação (`setActionHandler`) para `'play'` e `'pause'`, conectando-os ao método `togglePlay()`.

## 2. Behavior / Component: Ciclo de Vida do Podcast (`onEnded`)
- **Arquivo Alvo:** `src/context/RadioContext.tsx`
- **Classificação:** Behavior
- **Especificação:**
  - Adicionar listener para o evento `'ended'` no elemento de áudio gerenciado.
  - Quando disparado durante a reprodução de um podcast, redefinir `activePodcast` para `null` e reconfigurar a fonte para o streaming ao vivo (`effectiveStreamUrl`), mantendo o estado de reprodução pausado.

## 3. Component / Performance: Paginação Suave no Mural de Orações
- **Arquivo Alvo:** `src/components/PrayerWallSection.tsx`
- **Classificação:** Component / Performance
- **Especificação:**
  - Introduzir estado `visibleCount` com valor inicial de `6`.
  - Exibir botão "Carregar Mais Pedidos" quando `filteredRequests.length > visibleCount`.
  - Ao clicar, incrementar `visibleCount` em `6` pedidos. Resetar `visibleCount` para `6` ao alternar a categoria ou modificar o termo de busca.

## 4. Component / Feedback: Indicação Visual no Soundboard do Estúdio
- **Arquivo Alvo:** `src/components/ControlPanel.tsx`
- **Classificação:** Component / Feedback
- **Especificação:**
  - Criar estado `activeSoundboardEffect: string | null`.
  - Ao acionar `playSoundEffect(type)`, definir o estado com o tipo correspondente e agendar a limpeza para o tempo exato de duração do efeito sonoro.
  - Aplicar classes de realce com brilho dourado e escala suave no botão ativo.
