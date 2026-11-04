# Issue 01: PWA, Instalação e Ciclo de Vida do Service Worker

**Data e Hora de Geração:** 04/11/2026 às 14:32 (Horário de Brasília - BRT)  
**Origem:** `analytics/Spec.md` — Módulo 1  
**Status:** [x] Concluído

---

## 1. Descrição e Objetivo
Garantir o perfeito funcionamento da instalação do aplicativo como PWA e o ciclo de vida do Service Worker em múltiplos navegadores e contextos.

## 2. Componentes e Arquivos Afetados
- `src/components/PWAInstallButton.tsx`
- `src/hooks/usePWAInstall.ts`
- `public/sw.js`
- `src/main.tsx`

## 3. Tarefas de Finalização
1. [x] Verificar a detecção do modo `standalone` via `matchMedia('(display-mode: standalone)')` com listener dinâmico de alteração para ocultar automaticamente botões de instalação após o registro da PWA.
2. [x] Manter a captura do evento `beforeinstallprompt` e o acionamento direto da janela nativa de instalação do navegador.
3. [x] Garantir a atualização automática do Service Worker via `virtual:pwa-register` com o parâmetro `immediate: true` e limpeza de caches obsoletos no evento `activate`.
