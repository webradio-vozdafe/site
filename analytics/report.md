# Relatório Geral de Erros e Diagnóstico do Sistema — Rádio Vóz da Fé

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Projeto:** Rádio Vóz da Fé (Web Rádio HD & PWA)  
**Versão de Análise:** 2.0.0-audit  
**Escopo:** Mapeamento e Diagnóstico de Erros do Código Existente (Sem aplicação de alterações)

---

## 1. Resumo Executivo
Este relatório apresenta a análise técnica detalhada do codebase da aplicação **Rádio Vóz da Fé**, comparando a implementação atual com os requisitos estabelecidos na pasta `references/` (`PRD.md`, `architecture.md` e `ai-rules.md`).

A auditoria identificou **7 falhas críticas e inconsistências técnicas** que afetam o tratamento de exceções do Firestore, a sincronização do estado global com componentes da grade horária, o controle de acesso de papéis (RBAC), a ordenação do player de áudio e a compatibilidade dos valores de status entre o banco de dados e a interface.

---

## 2. Relatório de Erros Diagnosticados

### Erro 01: Exceções Não Tratadas no Firestore Listener (`handleFirestoreError`)
* **Arquivo Afetado:** `/src/context/RadioContext.tsx` (Linhas 55–74, 334, 352, 379, 405)
* **Sintoma:** O aplicativo gera rejeições de promessas e erros de runtime no console quando há falhas temporárias de rede, restrições de permissão do Firestore ou ao conectar ouvintes não autenticados na coleção `contactMessages`.
* **Causa Raiz:** A função helper `handleFirestoreError` lança uma nova exceção (`throw new Error(...)`) de dentro das funções de callback de erro do `onSnapshot`. Como o `onSnapshot` do Firebase executa de forma assíncrona, exceções lançadas dentro desse listener não são capturadas pelo bloco `try/catch` do componente React, causando *uncaught error rejections*.
* **Impacto:** Interrupção do fluxo de execução em segundo plano, logs poluídos com falhas não tratadas e risco de renderização inconsistente para ouvintes em conexões instáveis.

---

### Erro 02: Desconexão de Estado na Grade de Programação (`ScheduleSection`)
* **Arquivos Afetados:** `/src/components/ScheduleSection.tsx` (Linha 63) vs `/src/context/RadioContext.tsx` (Linha 116)
* **Sintoma:** Alterações, inclusões ou remoções de programas realizadas pelo administrador no Painel do Estúdio não são refletidas na página pública de Programação (`ScheduleSection`).
* **Causa Raiz:** O componente `ScheduleSection.tsx` consome diretamente o array estático `SCHEDULE_PROGRAMS` importado do arquivo `/src/data/radioData.ts` na linha 63, em vez de utilizar o estado reativo `programs` fornecido pelo hook `useRadio()`.
* **Impacto:** Quebra de integridade de dados entre a gestão do estúdio e o portal do ouvinte. O administrador altera a grade no painel, mas o público continua vendo a lista estática original.

---

### Erro 03: Inconsistência de Mapeamento dos Status de Pedidos de Hinos
* **Arquivos Afetados:** `/src/components/ControlPanel.tsx`, `/src/components/SongRequestSection.tsx` e `/firebase-blueprint.json`
* **Sintoma:** Pedidos de hinos alterados no estúdio para o status "No Ar" ou "Atendido" não sincronizam corretamente com os filtros da interface e do Firestore.
* **Causa Raiz:** Divergência nos enums de status:
  * `firebase-blueprint.json` define os enums como: `["na_fila", "tocando", "atendido"]`.
  * `ControlPanel.tsx` utiliza a string `'no_ar'` e `'atendido'`.
  * `SongRequestSection.tsx` renderiza verificações com `'no_ar'` e `'na_fila'`.
* **Impacto:** Falha na atualização do status do pedido no Firestore quando as regras ou esquemas aplicam validações estritas de enum, resultando em rejeições silenciosas de escrita ou divergência nos cards visuais dos ouvintes.

---

### Erro 04: Controle de Acesso e Redirecionamento Direto sem Validação Estrita de Papel (`isAdmin`)
* **Arquivos Afetados:** `/src/App.tsx` (Linhas 186, 233-239) e `/src/components/LoginView.tsx` (Linhas 25, 43, 67)
* **Sintoma:** Qualquer usuário autenticado (incluindo ouvintes comuns sem privilégios) pode abrir o Painel do Estúdio se a rota for acionada ou se o estado `isLoggedIn` for verdadeiro.
* **Causa Raiz:** Em `App.tsx`, a verificação para abrir o Painel de Controle checa apenas `isLoggedIn` (`if (isLoggedIn) setIsControlPanelOpen(true)`), omitindo a checagem da flag `isAdmin`. Além disso, a verificação de e-mail mestre em `LoginView.tsx` possui listas de e-mails hardcoded sem sincronizar completamente com a role persistida no documento `/users/{uid}`.
* **Impacto:** Vulnerabilidade na UI do Painel do Estúdio, permitindo que ouvintes comuns acessem ferramentas de operação da rádio.

---

### Erro 05: Cálculo de Índice Extrapolado no Ticker de Versículos
* **Arquivos Afetados:** `/src/App.tsx` (Linhas 947, 990) vs `/src/context/RadioContext.tsx` (Linha 122)
* **Sintoma:** Ao clicar no botão "Mudar Versículo" na página inicial quando versículos adicionais são criados pelo Painel, ocorre erro de inconsistência no limite do array.
* **Causa Raiz:** `App.tsx` calcula o novo índice do versículo utilizando o tamanho do array estático `DAILY_VERSES.length` em vez do array dinâmico `verses.length` vindo do contexto (`const currentVerse = verses[activeVerseIdx] || verses[0]`).
* **Impacto:** Versículos adicionados dinamicamente no painel administrativo podem nunca ser exibidos ou provocar saltos incorretos na rotação do ticker.

---

### Erro 06: Duplicação de Disparos de Reconexão e Loop de Playback em Celulares / Autoplay Block
* **Arquivos Afetados:** `/src/App.tsx` (Linhas 282-300) e `/src/context/RadioContext.tsx` (Linhas 758-766, 796-808)
* **Sintoma:** Em navegadores móveis (Safari iOS e Chrome Android), ao retornar do estado offline ou trocar a qualidade do áudio, o aplicativo gera múltiplos alertas de erro e tentativas de reconexão sobrepostas.
* **Causa Raiz:** O evento `window.addEventListener('online')` está registrado de forma redundante no `App.tsx` e no `RadioContext.tsx`. Ambos acionam simultaneamente o método `retryPlayback()`, que tenta executar `audio.play()` sem uma ação direta do usuário (*gesture*), acionando o bloqueio de Autoplay do navegador.
* **Impacto:** Notificações de erro indesejadas e travamento da reprodução de áudio em dispositivos móveis.

---

### Erro 07: Ausência de Fallback Offline no Service Worker para Rotas SPA
* **Arquivo Afetado:** `/public/sw.js`
* **Sintoma:** Ao atualizar a página estando offline em rotas amigáveis como `/programacao`, `/oracao` ou `/pedir-hino`, o navegador exibe a tela de erro de conexão nativa (404 / Offline Page) em vez da PWA.
* **Causa Raiz:** O Service Worker em `/public/sw.js` intercepta requisições de navegação (`mode === 'navigate'`), mas não possui um fallback genérico para retornar a página `index.html` em cache para rotas do lado do cliente (SPA Client Routing).
* **Impacto:** Compromete a resiliência offline do aplicativo PWA exigida no PRD (Requisito RNF-04).

---

*Fim do Relatório Geral de Erros — Rádio Vóz da Fé.*
