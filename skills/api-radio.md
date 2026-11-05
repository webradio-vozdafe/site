# Skill — API da Rádio

## Objetivo

Integrar os dados externos da rádio com segurança e previsibilidade.

## Fonte

O projeto utiliza uma API JSON da rádio para dados operacionais. Os campos documentados no contexto do projeto incluem:
- `status`
- `porta`
- `porta_dj`
- `ip`
- `ouvintes_conectados`
- `titulo`
- `plano_ouvintes`

Não inventar campos adicionais.

## Regras

- Centralizar acesso à API em serviço ou camada apropriada.
- Não espalhar chamadas HTTP diretamente por vários componentes.
- Tratar loading.
- Tratar erro.
- Tratar resposta vazia.
- Validar a estrutura recebida.
- Evitar chamadas duplicadas.
- Evitar polling agressivo.
- Não bloquear a interface.
- Disponibilizar fallback visual quando os dados não estiverem disponíveis.

## Compatibilidade

A aplicação possui streaming por servidor Shoutcast/Icecast e deve manter HTTPS para evitar Mixed Content.

A URL do stream definida no projeto é:
`https://server15.srvsh.com.br:8912/;`

Não alterar endpoint ou stream sem solicitação.

## CORS

Não presumir que CORS está disponível.
Quando uma API não puder ser chamada diretamente pelo browser:
- não criar workaround inseguro;
- verificar a arquitetura existente;
- considerar proxy/backend somente quando solicitado ou necessário e autorizado.

## Dados externos

Nunca confiar cegamente em:
- strings;
- números;
- status;
- URLs;
- metadados.

Normalizar e validar antes de renderizar ou utilizar.

## Resiliência

Falhas da API não podem derrubar a aplicação inteira.

A interface deve continuar funcional sempre que possível.
