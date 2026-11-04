# Issue 02: Persistência de Qualidade de Áudio e Auto-Reconexão de Rede

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Origem:** `analytics/Spec.md` — Módulo 2  
**Status:** [x] Concluído

---

## 1. Descrição e Objetivo
Finalizar a gestão do ciclo de vida do player de áudio, permitindo salvamento da preferência de bitrate e reconexão automática em caso de retorno de sinal de internet.

## 2. Componentes e Arquivos Afetados
- `src/context/RadioContext.tsx`
- `src/components/NowPlayingSection.tsx`
- `src/App.tsx`

## 3. Tarefas de Finalização
1. [x] Salvar a qualidade de áudio selecionada (`currentQuality`) no `localStorage` sob a chave `vozdafe_audio_quality` e recuperar a opção no carregamento inicial.
2. [x] Garantir a pausa, remoção de ouvintes de evento e descarte da instância de áudio antes de instanciar uma nova URL de stream durante a troca de bitrate.
3. [x] Acionar a rotina de reconexão do player de áudio automaticamente quando o evento `online` da janela for disparado, caso a rádio estivesse tocando antes da interrupção.
