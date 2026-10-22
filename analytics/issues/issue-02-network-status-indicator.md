# Issue 02: Indicador de Conectividade de Rede (Component)

**Data de geração:** 21/10/2026 22:17 (Horário de Brasília)

## Descrição
Desenvolver e integrar um componente visual de status de rede (Online/Offline) na barra de controle e cabeçalho do sistema.

## Requisitos de Implementação
- Monitorar o estado de conectividade via `navigator.onLine` e eventos `online` / `offline`.
- Exibir badge ou banner discreto quando o usuário perder a conexão com a internet.
- Fornecer opção de tentar reconectar manualmente o stream de áudio.
