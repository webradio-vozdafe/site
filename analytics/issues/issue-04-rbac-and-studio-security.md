# Issue 04: Validação Estrita de Papéis (RBAC) para o Painel do Estúdio

**Data e Hora de Geração:** 05/11/2026 08:50 (Horário de Brasília)  
**Status:** Concluído  
**Data e Hora de Conclusão:** 05/11/2026 08:56 (Horário de Brasília)  
**Prioridade:** Alta  
**Componentes:** `/src/App.tsx`, `/src/components/LoginView.tsx` e `/src/components/ControlPanel.tsx`

---

## Descrição do Problema
O acionamento do Painel do Estúdio em `App.tsx` checa somente a variável `isLoggedIn`, sem validar a condição `isAdmin`. Isso permite que qualquer ouvinte comum logado abra a interface do Estúdio. Além disso, a atribuição do papel `admin` no Firestore em `LoginView.tsx` precisa de consistência estrita.

## Tarefas de Implementação
1. Em `App.tsx`, alterar o tratamento do comando de abertura do estúdio para validar `isLoggedIn && isAdmin`. Se o usuário for um ouvinte comum, redirecioná-lo para a tela de perfil `/perfil`.
2. Em `LoginView.tsx`, garantir que ao realizar o login com o Google, os e-mails mestres cadastrados em `firestore.rules` (`vibraefm@gmail.com`, `webradiovozdafe@gmail.com`) recebam a role `'admin'` no Firestore `/users/{uid}`.
3. Exibir mensagem explicativa para ouvintes comuns tentando acessar áreas administrativas.

## Critérios de Aceite
* Ouvintes comuns autenticados não conseguem visualizar a interface do Painel do Estúdio.
* Apenas usuários com `role: 'admin'` ou os e-mails mestres configurados possuem acesso ao Painel.
