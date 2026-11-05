# Skill — Performance

## Metas

O PRD estabelece:
- First Contentful Paint inferior a 1.2s;
- início do áudio inferior a 1.5s;
- disponibilidade de 99.98%.

Essas metas devem orientar otimizações, sem sacrificar segurança ou estabilidade.

## Vite

Utilizar:
- code splitting;
- carregamento dinâmico;
- bundles menores;
- tree-shaking;
- HMR durante desenvolvimento.

## React

Evitar:
- renderizações desnecessárias;
- Context updates excessivos;
- listas sem `key` estável;
- efeitos repetidos;
- subscriptions duplicadas.

## Firestore

- Evitar listeners desnecessários.
- Encerrar `onSnapshot`.
- Buscar apenas dados necessários.
- Não criar queries repetidas sem necessidade.

## Áudio

O stream ao vivo deve iniciar rapidamente.

Evitar processamento pesado na thread principal durante reprodução.

## Assets

- Otimizar imagens.
- Evitar arquivos grandes desnecessários.
- Lazy-load para conteúdo não crítico.
- Priorizar o conteúdo principal.

## PWA

Cachear o shell da aplicação, mas não armazenar o stream ao vivo como asset estático.

## Métricas

Ao otimizar, medir antes/depois quando possível.

Não aplicar micro-otimizações que prejudiquem legibilidade.

## Regra

Performance deve ser obtida preferencialmente por:
1. arquitetura;
2. carregamento sob demanda;
3. redução de bundle;
4. cache adequado;
5. redução de trabalho desnecessário;
6. otimização de renderização.
