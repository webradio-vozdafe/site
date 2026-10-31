# Issue 04: Estado de Carregamento e Bloqueio no Botão de Reconexão

**Data e Hora de Geração:** 28/10/2026 10:46 (Horário de Brasília)

## Descrição
Melhorar a experiência de usuário durante a reconexão da transmissão, desabilitando o botão e exibindo indicador de atividade enquanto a tentativa de conexão estiver em processamento.

## Escopo e Requisitos
1. No alerta de áudio em `src/App.tsx` e no cartão de reprodução em `src/components/NowPlayingSection.tsx`, conectar o estado `isLoading`.
2. Durante `isLoading`, desabilitar o botão de reconexão e exibir animação de spinner com o texto "Reconectando...".
