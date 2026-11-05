# Skill — React

## Padrão

Utilizar React 18 com componentes funcionais e Hooks.

## Componentes

- Cada componente deve possuir responsabilidade clara.
- Preferir composição a componentes monolíticos.
- Extrair componentes reutilizáveis quando houver repetição real.
- Evitar lógica de negócio complexa dentro do JSX.
- Manter componentes de apresentação separados de serviços quando apropriado.

## Hooks

- Respeitar Rules of Hooks.
- Dependências de `useEffect` devem ser corretas.
- Evitar efeitos usados apenas para calcular valores derivados.
- Usar `useMemo` e `useCallback` somente quando houver benefício real.
- Criar hooks personalizados para lógica reutilizável.

## Estado

O `RadioContext` centraliza o estado global da rádio.

Não duplicar estado global em componentes locais sem necessidade.

Usar estado local para comportamento estritamente local.

## Eventos e recursos

- Limpar listeners.
- Limpar timers.
- Encerrar subscriptions.
- Desconectar recursos Web Audio quando necessário.
- Garantir cleanup de `onSnapshot`.

## Acessibilidade

Componentes interativos devem possuir:
- nome acessível;
- foco visível;
- teclado funcional;
- estados de carregamento e erro comunicáveis.

## Performance

Evitar:
- renderizações desnecessárias;
- listeners duplicados;
- subscriptions duplicadas;
- criação repetida de objetos pesados;
- carregamento de módulos que não são necessários.

## Não fazer

- Não usar `any` para contornar erros.
- Não colocar segredos no frontend.
- Não reescrever a aplicação inteira para corrigir um componente.
