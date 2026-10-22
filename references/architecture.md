# Arquitetura do Sistema — Rádio Vóz da Fé

**Documento:** Arquitetura de Software & Topologia de Sistemas  
**Versão:** 1.0.0  
**Data de Criação:** 22/10/2026 20:26 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (FM 104.9 MHz & Web HD)

---

## 1. Visão Geral da Arquitetura

O sistema da **Rádio Vóz da Fé** foi projetado seguindo uma arquitetura modular em camadas, separando claramente a experiência de consumo de conteúdo do ouvinte (*Portal do Ouvinte*) e o ambiente operacional e administrativo (*Painel do Estúdio / Mesa Digital*). 

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENTE (BROWSER / PWA)                         │
│       React 18 + TypeScript + Vite 5 + Tailwind CSS + Lucide Icons     │
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

---

## 2. Camada de Apresentação (Frontend)

O frontend é construído como uma **Single Page Application (SPA)** escalável utilizando React 18 e TypeScript, empacotada pelo Vite para máxima velocidade de carregamento e HMR otimizado.

### 2.1. Hierarquia e Modularidade de Componentes
- **`App.tsx` / `MainView`**: Orquestrador principal de rotas e visualizações (`ao-vivo`, `programacao`, `oracao`, `pedir-hino`, `devocionais`, `sobre`, `perfil`, `login`, e `ControlPanel`).
- **`Navbar.tsx` & `Footer`**: Cabeçalho de navegação responsivo (desktop e mobile) com indicador de status de transmissão, contagem de ouvintes e links condicionais baseados na autenticação do usuário (`isLoggedIn`).
- **`LivePlayerHero.tsx` & `NowPlayingSection`**: Seções de destaque do player de áudio principal com seletor de bitrate, espectro visualizador (`AudioVisualizer`) e metadados da música atual.
- **`MiniBottomPlayer.tsx`**: Player flutuante persistente no rodapé ativado automaticamente ao rolar a página para baixo.
- **`ScheduleSection.tsx`**: Grade de programação diária e semanal com indicação em tempo real do programa "No Ar".
- **`PrayerWallSection.tsx` & `SongRequestSection`**: Módulos comunitários para envio e intercessão em pedidos de oração e solicitação de hinos.
- **`ControlPanel.tsx`**: Central de comando do estúdio com abas para mesa digital, moderação de orações, pauta pastoral, gerenciador de versículos, podcasts e configurações.

---

## 3. Camada de Estado Global (`RadioContext.tsx`)

O núcleo reativo da aplicação reside no contexto global `RadioContext`, que centraliza:
1. **Estado de Reprodução de Áudio:** `isPlaying`, `isLoading`, `volume`, `isMuted`, `currentQuality`, `audioError`.
2. **Metadados de Transmissão:** `currentShow`, `nextShow`, `currentTrackInfo`, `radioData`.
3. **Temporizador de Sono (Sleep Timer):** Gestão de contagem regressiva para interrupção programada da reprodução.
4. **Sincronização em Tempo Real (Firestore):** Ouvintes em tempo real (`onSnapshot`) para listas de orações, pedidos de hinos, contatos e versículos.

---

## 4. Camada de Multimídia e Áudio

### 4.1. Streaming de Rádio Ao Vivo
- Utiliza elemento HTML5 `<audio>` associado à URL Shoutcast/Icecast configurada (`https://server15.srvsh.com.br:8912/;`).
- Gerencia eventos de buffer, erro de rede e reconexão automática.

### 4.2. Sintetizador de Efeitos Sonoros (Web Audio API)
- O soundboard do estúdio gera programaticamente bips de hora certa, acordes de vinhetas e fundos sonoros harmônicos em tempo real sem dependência de arquivos de áudio externos pesados, garantindo latência zero.

### 4.3. Síntese de Fala (Web Speech API)
- Utiliza a API nativa do navegador (`SpeechSynthesisUtterance`) em português (`pt-BR`) para locução e leitura em voz alta de versículos e chamadas de hora certa.

---

## 5. Camada de Backend e Persistência (Firebase)

A persistência de dados e autenticação são totalmente descentralizadas e gerenciadas pelos serviços em nuvem do Google Firebase.

### 5.1. Firebase Authentication
- Suporte a login federado via **Google** e autenticação por e-mail/senha.
- Identificação automática de papéis administrativos (`role === 'admin'`) para liberação do Painel do Estúdio.

### 5.2. Cloud Firestore (Banco de Dados NoSQL)
- **Coleções Principais:**
  - `users`: Perfis de usuários e controle de papéis (`admin` / `listener`).
  - `prayerRequests`: Mural interativo de orações com contagem de intercessões (`prayersCount`).
  - `songRequests`: Fila de pedidos musicais moderados pelo estúdio.
  - `contactMessages`: Mensagens e e-mails encaminhados pelos ouvintes.
- **Segurança:** Regras de segurança rigorosas no Firestore (`firestore.rules`) garantindo leitura pública e escrita restrita ou validada por autenticação.

---

## 6. Progressive Web App (PWA) e Resiliência Offline

- **`manifest.json`**: Metadados para instalação do aplicativo em dispositivos móveis e desktops.
- **Service Worker (`/public/sw.js`)**:
  - Estratégia de cache estático para assets da aplicação (HTML, CSS, JS principais).
  - Suporte a sincronização em segundo plano (*Background Sync*) para formulários enviados sem conexão com a internet.

---

## 7. Considerações de Segurança e Performance

1. **CORS e Proxy de Áudio:** Os streams de áudio utilizam protocolos HTTPS e servidores otimizados para evitar bloqueios de conteúdo misto (*Mixed Content*).
2. **Minimização de Bundle:** Code splitting via Vite e carregamento dinâmico de componentes garantem carregamento inicial ultrarrápido.
3. **Tratamento de Exceções:** Limites de erro (*Error Boundaries*) e fallbacks em requisições assíncronas evitam telas em branco na aplicação.

---
*Fim do documento de arquitetura do sistema.*
