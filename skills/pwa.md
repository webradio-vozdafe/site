# Skill — PWA

## Objetivo

Manter a Voz da Fé instalável, responsiva e resiliente.

## Componentes

Preservar:
- `manifest.json`;
- `/public/sw.js`;
- ícones;
- metadata de instalação;
- estratégia de cache;
- Background Sync quando já implementado.

## Offline

O aplicativo deve funcionar parcialmente offline.

Priorizar cache de:
- shell da aplicação;
- HTML;
- CSS;
- JavaScript;
- assets estáticos.

Não tratar o stream ao vivo como asset estático.

## Service Worker

- Evitar cachear respostas dinâmicas incorretamente.
- Atualizar cache de forma controlada.
- Evitar versões antigas presas indefinidamente.
- Não quebrar o carregamento da aplicação após atualização do SW.
- Não interceptar o stream de áudio de forma que prejudique reprodução.

## Instalação

Manter:
- manifest válido;
- ícones adequados;
- nome e nome curto coerentes;
- theme/background definidos conforme identidade visual;
- experiência mobile.

## Background Sync

Quando existente, utilizar para formulários que possam ser enviados posteriormente.

Não duplicar submissões.

## Responsividade

Validar no mínimo:
- 320px;
- mobile;
- tablet;
- desktop.

## Não fazer

Não transformar o PWA em aplicativo nativo.
Não adicionar bibliotecas PWA desnecessárias.
