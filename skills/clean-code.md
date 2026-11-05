# Skill — Clean Code

## Objetivo

Manter o código legível, previsível, testável e fácil de evoluir.

## Regras

- Preferir funções pequenas e com responsabilidade clara.
- Usar nomes semânticos.
- Evitar duplicação.
- Evitar abstrações prematuras.
- Evitar funções gigantes.
- Evitar componentes gigantes.
- Evitar efeitos colaterais escondidos.
- Centralizar regras de negócio quando forem compartilhadas.
- Não misturar apresentação, acesso a dados e regras complexas no mesmo componente.
- Remover código morto somente quando tiver segurança de que não é utilizado.
- Não introduzir dependências apenas para resolver problemas simples.
- Não usar comentários para justificar código confuso; primeiro tente tornar o código claro.

## Tratamento de erros

- Não ignorar exceções.
- Não usar `catch` vazio.
- Apresentar fallback adequado na interface quando necessário.
- Registrar erros de forma segura, sem expor segredos.

## Refatoração

Antes de refatorar:
1. entender o comportamento atual;
2. identificar dependências;
3. preservar contratos públicos;
4. fazer mudanças incrementais;
5. validar build e testes.

Não refatorar por estética quando o usuário pediu apenas uma correção localizada.
