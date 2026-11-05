# Skill — TypeScript

## Configuração

O projeto deve operar em TypeScript strict.

## Regras

- Evitar `any`.
- Evitar casts sem justificativa.
- Preferir tipos explícitos em contratos públicos.
- Modelar estados e respostas de API.
- Usar union types para estados finitos.
- Usar tipos discriminados quando isso melhorar segurança.
- Evitar `as` excessivo.
- Não usar `@ts-ignore` sem justificativa excepcional.

## Dados da rádio

Os dados externos devem ser tratados como dados não confiáveis até serem validados.

Criar tipos para:
- status;
- porta;
- porta DJ;
- IP/servidor;
- ouvintes conectados;
- título/nome;
- plano de ouvintes;
- metadados adicionais realmente existentes na API.

Não inventar campos que não tenham sido definidos pelo projeto ou pela API real.

## Firestore

Criar tipos coerentes para:
- User;
- PrayerRequest;
- SongRequest;
- ContactMessage.

Os papéis administrativos devem ser representados por tipos restritos, como:
`'admin' | 'listener'`.

## Null e undefined

Tratar explicitamente:
- resposta vazia;
- dados ausentes;
- falha de rede;
- documentos inexistentes.

## Build

Qualquer alteração TypeScript deve terminar com verificação de:
- erros de compilação;
- imports inválidos;
- tipos incompatíveis;
- contratos quebrados.
