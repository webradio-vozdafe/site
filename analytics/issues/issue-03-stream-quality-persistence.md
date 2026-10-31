# Issue 03: Persistência da Qualidade de Áudio Selecionada no LocalStorage

**Data e Hora de Geração:** 28/10/2026 10:46 (Horário de Brasília)

## Descrição
Persistir a escolha de qualidade de transmissão do ouvinte no `localStorage` para que a preferência seja mantida após recarregar ou reabrir o site.

## Escopo e Requisitos
1. No `RadioContext.tsx`, inicializar o estado `currentQuality` verificando `localStorage.getItem('vozdafe_stream_quality_url')`.
2. Em `setQuality(q)`, gravar o `q.url` selecionado no `localStorage`.
