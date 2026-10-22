# Especificação de Finalizações (Spec)

**Data de geração:** 21/10/2026 22:17 (Horário de Brasília)

Esta especificação aborda exclusivamente o que falta implementar (page, behavior, component) com base no relatório de análise do sistema, sem introduzir novas funcionalidades.

## 1. Behavior: Sincronização em Segundo Plano (Service Worker)
- **Escopo**: Adicionar suporte a eventos de `sync` e manipulação de push notifications no arquivo `/public/sw.js` para garantir funcionamento de lembretes de programação offline.

## 2. Component: Indicador de Conectividade (Network Status)
- **Escopo**: Criar componente indicador visual de status de rede (Online/Offline) integrando eventos do navegador (`online`/`offline`) na interface do painel e player.

## 3. Behavior / Component: Acessibilidade e Gestão de Foco em Modais
- **Escopo**: Implementar foco gerenciado (focus trap / ARIA attributes) em modais (como `SleepTimerModal`, popovers e abas do `ControlPanel`) para leitores de tela e navegação estrita por teclado.

## 4. Component: Métricas de Latência de Stream no Painel Administrativo
- **Escopo**: Adicionar widget de monitoramento de latência e status de bitrate ativo no painel de controle do estúdio (`ControlPanel.tsx`).
