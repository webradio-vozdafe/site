# Issue 03: Acessibilidade e Navegação por Teclado em Modais (Behavior / Component)

**Data de geração:** 21/10/2026 22:17 (Horário de Brasília)

## Descrição
Garantir acessibilidade completa (A11y), foco gerenciado (focus trap) e atributos ARIA nos modais e abas do painel de controle.

## Requisitos de Implementação
- Adicionar suporte à tecla `ESC` para fechar modais (`SleepTimerModal`, popovers, modais de edição).
- Garantir atributos `aria-modal`, `aria-label` e `role="dialog"` em componentes de sobreposição.
- Gerenciar o retorno do foco para o elemento ativador ao fechar modais.
