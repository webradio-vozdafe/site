# AGENTS.md — Voz da Fé

## 1. Identidade do projeto

Projeto: Rádio Vóz da Fé — FM 104.9 MHz & Web HD.
Slogan: "A frequência do céu tocando o seu coração".

A aplicação é uma SPA/PWA de rádio web com dois ambientes:
- Portal do Ouvinte;
- Painel do Estúdio / Mesa Digital.

O projeto utiliza React 18, TypeScript strict, Vite 5, Tailwind CSS v4, Lucide Icons e Firebase.

## 2. Objetivo do agente

Atuar como engenheiro de software sênior, priorizando:
1. correção de erros;
2. preservação das funcionalidades existentes;
3. qualidade e organização do código;
4. segurança;
5. performance;
6. acessibilidade;
7. experiência PWA;
8. consistência visual.

## 3. Regra de escopo

Execute exatamente o que foi solicitado.

NÃO:
- adicionar funcionalidades não solicitadas;
- alterar arquitetura sem necessidade;
- reescrever arquivos inteiros quando uma alteração localizada resolver;
- inventar APIs, dados, endpoints ou requisitos;
- modificar identidade visual sem solicitação;
- excluir arquivos ou pastas sem confirmação humana;
- criar versões alternativas sem solicitação.

Se houver ambiguidade que impeça uma implementação segura, faça uma pergunta curta e objetiva.

## 4. Arquitetura

Respeitar a arquitetura modular em camadas e a separação entre:
- apresentação;
- estado global;
- serviços de áudio;
- serviços Firebase;
- PWA;
- módulos do Portal do Ouvinte;
- módulos do Painel do Estúdio.

Feature-Driven Architecture é preferível quando a estrutura existente permitir.

## 5. Stack oficial

- React 18
- TypeScript strict
- Vite 5
- Tailwind CSS v4
- Lucide Icons
- Firebase Authentication
- Cloud Firestore
- HTML5 Audio
- Web Audio API
- Web Speech API
- Service Worker em `/public/sw.js`

## 6. Estado global

`RadioContext.tsx` é o núcleo reativo para:
- reprodução;
- loading;
- volume;
- mute;
- qualidade;
- erros de áudio;
- programa atual;
- próximo programa;
- faixa atual;
- dados da rádio;
- sleep timer;
- sincronização Firestore.

Não duplicar no componente um estado que já pertence ao contexto global.

## 7. Módulos principais

Preservar os módulos definidos no projeto:
- LivePlayerHero / NowPlayingSection
- MiniBottomPlayer
- ScheduleSection
- PrayerWallSection
- SongRequestSection
- devocionais
- ControlPanel

## 8. Firebase

Coleções principais:
- users
- prayerRequests
- songRequests
- contactMessages

Papéis:
- admin
- listener

Qualquer operação administrativa deve respeitar autenticação e autorização.

## 9. Áudio

O player deve:
- tratar loading;
- tratar erro;
- permitir retry;
- reconectar quando apropriado;
- manter controle de volume e mute;
- suportar qualidade configurável;
- preservar o sleep timer;
- evitar múltiplos players concorrentes.

## 10. PWA

Preservar:
- manifest;
- Service Worker;
- cache;
- funcionamento parcial offline;
- Background Sync quando existente.

Não fazer cache agressivo de stream de áudio ao vivo.

## 11. Qualidade

Antes de concluir uma alteração:
- verificar TypeScript;
- verificar build;
- verificar imports;
- verificar efeitos colaterais;
- verificar responsividade;
- verificar acessibilidade;
- verificar segurança;
- verificar performance.

Critério de homologação: `tsc` e build Vite sem erros ou avisos críticos.

## 12. Arquivos de skills

As regras detalhadas ficam em:
- skills/clean-code.md
- skills/react.md
- skills/typescript.md
- skills/api-radio.md
- skills/pwa.md
- skills/ui-design.md
- skills/accessibility.md
- skills/security.md
- skills/performance.md
- skills/testing.md

Quando uma skill for relevante para a tarefa, siga-a.

## 13. Regra de exclusão

Antes de excluir qualquer arquivo ou pasta:
1. informe o que será excluído;
2. peça confirmação humana;
3. somente depois execute a exclusão.

Nunca excluir silenciosamente.

## 14. Princípio de decisão

Prioridade:
1. instrução explícita do usuário;
2. requisitos do projeto;
3. arquitetura existente;
4. segurança;
5. estabilidade;
6. performance;
7. qualidade do código.

Não substitua uma instrução explícita por preferência pessoal.
