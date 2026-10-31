# Especificação Técnica de Finalizações (Spec)

**Data e Hora de Geração:** 28/10/2026 10:46 (Horário de Brasília)

Esta especificação define o comportamento, componentes e páginas que devem ser ajustados para sanar as pendências identificadas no relatório `analytics/report.md`.

---

## 1. Component / UI: Unicidade de Chave na Seleção de Qualidade (React Key)
- **Arquivo Alvo:** `src/App.tsx`
- **Classificação:** Component / UI
- **Especificação:**
  - Localizar a iteração sobre `STREAM_QUALITIES` no popover de qualidade de áudio.
  - Substituir `key={q.bitrate}` por `key={q.url}` (ou `key={q.label}`), eliminando a colisão de chaves duplicadas (`"128 kbps"`).

## 2. Behavior / Streaming: Preservação de Ponto de Montagem `/SD`
- **Arquivo Alvo:** `src/context/RadioContext.tsx`
- **Classificação:** Behavior / Audio
- **Especificação:**
  - No método `getEffectiveStreamUrl(data, qual)`, quando o usuário selecionar explicitamente uma qualidade (`qual`), priorizar `qual.url` sem reescrever URLs válidas contendo sufixos como `/SD`.
  - Garantir que a alternância para a qualidade econômica de 64 kbps carregue `https://server15.srvsh.com.br:8912/SD`.

## 3. Behavior / Storage: Persistência de Qualidade de Transmissão
- **Arquivo Alvo:** `src/context/RadioContext.tsx`
- **Classificação:** Behavior / Storage
- **Especificação:**
  - Inicializar `currentQuality` verificando o valor salvo em `localStorage.getItem('vozdafe_stream_quality_url')`.
  - No método `setQuality(q)`, salvar `q.url` no `localStorage` sob a chave `vozdafe_stream_quality_url`.

## 4. Component / Feedback: Feedback Ativo no Botão de Reconexão
- **Arquivos Alvos:** `src/App.tsx` e `src/components/NowPlayingSection.tsx`
- **Classificação:** Component / Feedback
- **Especificação:**
  - Obter `isLoading` no `NowPlayingSection.tsx` via `useRadio()`.
  - No botão "Reconectar", desabilitar o clique enquanto `isLoading` for verdadeiro e exibir indicador de carregamento giratório com o rótulo "Reconectando...".
