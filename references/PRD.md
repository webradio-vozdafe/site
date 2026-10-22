# Product Requirements Document (PRD) — Rádio Vóz da Fé (Completo & Detalhado)

**Documento Oficial de Requisitos de Produto (PRD)**  
**Versão:** 2.0.0 (Edição Definitiva)  
**Data de Atualização:** 22/10/2026 20:24 (Horário de Brasília)  
**Status do Projeto:** Em Produção / Estável  
**Emissora:** Rádio Vóz da Fé — FM 104.9 MHz & Web HD  
**Slogan:** *"A frequência do céu tocando o seu coração"*

---

## 1. Visão Geral do Produto e Objetivos Estratégicos

### 1.1. Missão e Propósito
A **Rádio Vóz da Fé** é uma plataforma digital de radiodifusão web de alta fidelidade e comunidade cristã interativa. O sistema foi desenvolvido para transmitir conteúdo gospel 24 horas por dia (louvores, pregações, orações e boletins informativos) combinando duas experiências distintas em uma única aplicação web progressiva (PWA):
1. **Portal do Ouvinte:** Experiência imersiva, limpa e inspiradora para recepção de áudio ao vivo, interação com mural de orações, pedidos de hinos e leitura devocional.
2. **Painel do Estúdio / Mesa Digital:** Centro de comando operacional restrito a locutores, pastores e administradores para operação ao vivo, controle de metadados, moderação de pedidos e relatórios de audiência em tempo real.

### 1.2. Objetivos de Negócio e Métricas de Sucesso (KPIs)
- **Alcance e Retenção:** Crescimento constante do número de ouvintes simultâneos (pico no horário nobre das 08h às 14h).
- **Engajamento Comunitário:** Volume de intercessões realizadas no mural de orações e quantidade de pedidos de louvores atendidos.
- **Disponibilidade (SLA):** Manutenção de 99.98% de estabilidade no streaming de áudio e persistência em nuvem via Firebase Firestore.
- **Acessibilidade Universal:** Conformidade total com WCAG 2.1 nível AA e navegação fluida em dispositivos móveis e desktops.

---

## 2. Perfis de Usuário (Personas Detalhadas)

| Persona | Descrição e Contexto | Necessidades Principais | Permissões no Sistema |
| :--- | :--- | :--- | :--- |
| **Ouvinte Visitante** | Crente ou buscador espiritual acessando a rádio via web móvel ou desktop. | Ouvir rádio imediatamente com 1 clique, visualizar o programa atual, ver o versículo do dia e interagir de forma anônima. | Acesso público (Portal, Player, Mural, Contato, Grade). |
| **Ouvinte Cadastrado** | Ouvinte frequente autenticado via conta Google ou credenciais. | Registrar pedidos de oração nominais, solicitar hinos com dedicatórias, gerenciar seu perfil de ouvinte e receber push notifications. | Acesso público + Autenticação de usuário (`listener`). |
| **Locutor / Operador de Estúdio** | Apresentador responsável pela programação ao vivo e condução dos programas. | Disparar vinhetas oficiais e hora certa no ar, abrir microfone do estúdio, atualizar metadados da música atual e compilar pautas de oração para o altar. | Acesso ao Painel de Controle (`admin` / operador). |
| **Administrador Geral** | Pastor presidente ou gestor técnico da rádio. | Gerenciar a grade de programação, cadastrar versículos, moderar mensagens, exportar e restaurar backups em JSON e auditar métricas de audiência. | Acesso total administrador (`admin`). |

---

## 3. Arquitetura Técnica e Stack de Desenvolvimento

### 3.1. Visão Geral da Arquitetura
A aplicação adota uma arquitetura frontend moderna baseada em **Single Page Application (SPA)** com gerenciamento de estado global reativo em React Context, integrada a serviços em nuvem gerenciados (BaaS - Firebase).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENTE (BROWSER / PWA)                         │
│       React 18 + TypeScript + Vite 5 + Tailwind CSS + Lucide           │
├────────────────────────────────┬───────────────────────────────────────┤
│         Portal do Ouvinte      │           Painel do Estúdio           │
│  - Player de Áudio HTML5       │  - Mesa Digital & Soundboard WebAudio │
│  - Mural de Oração (Firestore) │  - Pauta para Altar (Orações/Hinos)   │
│  - Devocionais e TTS           │  - Métricas de Audiência & SLA        │
├────────────────────────────────┴───────────────────────────────────────┤
│                        ESTADO GLOBAL (RadioContext)                    │
│      Gerenciamento de Reprodução, Sincronização e Coleções Firestore   │
├────────────────────────────────┬───────────────────────────────────────┤
│         SERVIÇOS DE ÁUDIO      │          SERVIÇOS DE SUPORTE          │
│  - Stream Icecast / Shoutcast  │  - Firebase Auth (Google / Email)     │
│  - Web Audio API (Sintetizador)│  - Cloud Firestore (NoSQL Realtime)   │
│  - Web Speech API (TTS)        │  - PWA Service Worker (Cache / Sync)  │
└────────────────────────────────┴───────────────────────────────────────┘
```

### 3.2. Especificação Tecnológica
- **Linguagem:** TypeScript strict mode.
- **Build Tool:** Vite com HMR otimizado.
- **Estilização:** Tailwind CSS v4 com design system personalizado baseado em paleta orgânica/sacra (`--forest`, `--gold`, `--paper`, `--cream`, `--ink`).
- **Banco de Dados & Autenticação:** Google Firebase (Firestore Database + Firebase Authentication).
- **APIs de Mídia do Navegador:**
  - `<audio>` nativo com tratamento robusto de erros e reconexão automática.
  - Web Audio API para síntese algorítmica de vinhetas, bips de hora certa, e efeitos sonoros no estúdio.
  - Web Speech API (`SpeechSynthesis`) para acessibilidade e leitura do versículo diário.
- **PWA Compliance:** Service Worker em `/public/sw.js` com cache estático, manifesto de aplicativo e suporte a sincronização em segundo plano.

---

## 4. Especificação Funcional por Módulo

### 4.1. Módulo de Player e Transmissão de Áudio (`NowPlayingSection` & `LivePlayerHero`)
- **Streaming Ao Vivo:** Conexão direta com o servidor Shoutcast/Icecast (`https://server15.srvsh.com.br:8912/;`).
- **Controles de Reprodução:** Play/Pause com animação de ondas sonoras (`AudioVisualizer`), indicador "NO AR" pulsante e controle deslizante de volume com mudez instantânea.
- **Seleção de Qualidade:** Menu suspenso para alternar entre perfis de bitrate (HD 128 kbps e Econômico 64 kbps).
- **Sleep Timer (Temporizador de Sono):** Modal interativo com opções de 15 a 120 minutos, exibindo contagem regressiva em tempo real e desligando o player automaticamente ao esgotar o tempo.
- **Mini Player Flutuante:** Barra persistente no rodapé ativada automaticamente quando o usuário rola a página para além de 350px.
- **Proteção contra Queda de Conexão:** Detecção de perda de pacotes ou erros de stream com botão dedicado de reconexão (*Retry*).

### 4.2. Módulo de Programação e Grade Horária (`ScheduleSection`)
- Exibição de todos os programas semanais e diários com capa ilustrativa, horário, locutor e descrição detalhada.
- Destaque automático para o programa ativo no momento atual com base no horário de Brasília (`America/Sao_Paulo`).

### 4.3. Módulo do Mural de Oração (`PrayerWallSection`)
- **Envio de Pedidos:** Formulário modal com nome, cidade, UF, categoria (Saúde, Família, Vida Espiritual, Finanças, Causas Urgentes, Gratidão) e conteúdo.
- **Intercessão Ativa:** Botão "Orar por este pedido" que incrementa o contador de clamores e dispara animação festiva de confetes (`canvas-confetti`).
- **Sincronização em Tempo Real:** Escuta contínua das alterações no Firestore (`onSnapshot`), garantindo que novos pedidos apareçam instantaneamente para todos os ouvintes conectados.

### 4.4. Módulo de Pedidos de Hino (`SongRequestSection`)
- Permite aos ouvintes solicitarem louvores específicos, informando nome, música, cantor, dedicatória opcional e contato.
- Os pedidos entram na fila digital para moderação e atendimento pela equipe de locução no estúdio.

### 4.5. Módulo Devocional e Versículo do Diário
- Exibição rotativa de passagens bíblicas com tema, referência, texto sagrado, reflexão devocional e comentário pastoral.
- **Ações de Interação:**
  - **Ouvir Mensagem:** Síntese de voz em português narrando o versículo.
  - **Copiar Versículo:** Cópia formatada para a área de transferência.
  - **Compartilhamento Social:** Links diretos para compartilhamento otimizado no WhatsApp, Facebook e X (Twitter).

### 4.6. Módulo do Painel de Controle do Estúdio (`ControlPanel.tsx`)
Restrito a administradores e operadores autenticados, o painel oferece:
- **Mesa de Operações & Soundboard:**
  - Botão de abertura de Microfone no Ar com aviso de alerta sonoro.
  - Disparador de Vinheta Oficial cantada (sintetizada via Web Audio + TTS).
  - Chamada de Hora Certa automática sincronizada com o relógio de Brasília.
  - Fundos sonoros de Clamor e Louvor.
- **Editor de Metadados da Transmissão:** Atualização imediata do título, artista e álbum exibidos no player dos ouvintes.
- **Pauta do Altar (Orações e Hinos):** Compilação automática de todos os pedidos de intercessão e solicitações musicais pendentes formatados para leitura em cultos ao vivo.
- **Gestão de Conteúdo (Programação, Versículos e Podcasts):** CRUD completo para adicionar, editar ou remover itens exibidos no portal público.
- **Métricas e Relatórios:** Gráficos de audiência por faixa horária, mapa de ouvintes por estado brasileiro e status de SLA do servidor de streaming.
- **Backup e Restauração:** Exportação de toda a base de dados em arquivo JSON e ferramenta de importação para recuperação de desastres.

---

## 5. Requisitos Não Funcionais (RNF)

| Requisito | Categoria | Descrição Técnica |
| :--- | :--- | :--- |
| **RNF-01** | **Performance & Latência** | Tempo de carregamento inicial (First Contentful Paint) inferior a 1.2s. Latência de início de áudio menor que 1.5s. |
| **RNF-02** | **Disponibilidade (SLA)** | Garantia de operação 24/7 com redundância de servidores de streaming e tratamento de falhas em chamadas de rede. |
| **RNF-03** | **Acessibilidade (A11y)** | Atendimento estrito aos padrões WCAG 2.1 AA (contraste mínimo de cores, navegação total por teclado com foco visível, suporte a leitores de tela via ARIA labels e tecla ESC nos modais). |
| **RNF-04** | **PWA & Offline-First** | Registro de Service Worker para cache inteligente de assets estáticos e funcionamento parcial offline. |
| **RNF-05** | **Segurança em Nuvem** | Autenticação Firebase Auth com tokens seguros e regras de segurança no Cloud Firestore validando permissões de papel (`role === 'admin'`). |

---

## 6. Estrutura de Dados do Firestore (Esquema NoSQL)

### 6.1. Coleção `users`
- `uid` (String, ID do usuário no Auth)
- `email` (`string`)
- `displayName` (`string`)
- `role` (`'admin' | 'listener'`)
- `phone` (`string`)
- `address` (`string`)
- `createdAt` (`ISO timestamp`)

### 6.2. Coleção `prayerRequests`
- `id` (`string`)
- `authorName` (`string`)
- `city` (`string`)
- `state` (`string`)
- `category` (`'Saúde' | 'Família' | 'Vida Espiritual' | 'Finanças' | 'Causas Urgentes' | 'Gratidão'`)
- `content` (`string`)
- `prayersCount` (`number`)
- `createdAt` (`string`)
- `status` (`'pending' | 'active' | 'answered'`)

### 6.3. Coleção `songRequests`
- `id` (`string`)
- `requesterName` (`string`)
- `songTitle` (`string`)
- `artist` (`string`)
- `dedication` (`string`)
- `phone` (`string`)
- `status` (`'na_fila' | 'atendido' | 'tocado'`)
- `createdAt` (`string`)

### 6.4. Coleção `contactMessages`
- `id` (`string`)
- `name` (`string`)
- `email` (`string`)
- `subject` (`string`)
- `message` (`string`)
- `createdAt` (`string`)

---

## 7. Critérios de Homologação e Conclusão

1. **Validação de Build:** Compilação TypeScript rigorosa (`tsc`) e build de produção Vite sem erros ou avisos críticos.
2. **Testes de Integração Firebase:** Autenticação Google e sincronização em tempo real do mural de orações validadas em ambiente de homologação.
3. **Validação de Responsividade:** Layout testado em resoluções mobile (320px+), tablet e desktop de alta densidade.

---
*Fim do Documento de Requisitos de Produto (PRD) — Rádio Vóz da Fé.*
