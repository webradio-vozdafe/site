# Skill — Testing

## Objetivo

Garantir que alterações não quebrem funcionalidades existentes.

## Validação mínima

Antes de considerar uma alteração concluída:
1. verificar TypeScript;
2. executar build de produção;
3. verificar imports;
4. verificar console errors relevantes;
5. verificar comportamento afetado.

## Requisitos de homologação

O projeto exige:
- compilação TypeScript rigorosa sem erros;
- build Vite sem erros ou avisos críticos;
- autenticação Google validada;
- sincronização em tempo real do mural de orações validada;
- responsividade em 320px+, tablet e desktop.

## Testes funcionais

Quando a área for alterada, verificar especialmente:

### Player
- play;
- pause;
- volume;
- mute;
- qualidade;
- retry;
- sleep timer;
- perda de conexão.

### Prayer Wall
- envio;
- atualização em tempo real;
- contador de intercessões;
- estados de erro.

### Song Requests
- validação;
- envio;
- fila;
- moderação.

### Auth
- login;
- logout;
- papel listener;
- papel admin;
- bloqueio de área administrativa.

### PWA
- instalação;
- carregamento;
- Service Worker;
- cache;
- comportamento offline parcial.

## Testes de regressão

Após qualquer alteração compartilhada, verificar:
- navegação;
- layout;
- RadioContext;
- player;
- autenticação;
- Firestore;
- PWA.

## Não mascarar falhas

Não:
- desabilitar testes;
- adicionar `any`;
- ignorar erros;
- esconder warnings;
- remover validações apenas para fazer o build passar.
