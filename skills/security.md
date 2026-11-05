# Skill — Security

## Princípios

Segurança é requisito funcional e não funcional.

## Firebase Authentication

O projeto utiliza:
- Google Authentication;
- e-mail/senha.

Nunca confiar apenas em verificações visuais do frontend.

## Autorização

O papel administrativo é:
`role === 'admin'`.

A proteção real deve ocorrer nas regras do Firestore e na camada de autorização.

Esconder botão no frontend não é controle de segurança.

## Firestore

Coleções principais:
- users
- prayerRequests
- songRequests
- contactMessages

As regras devem restringir escritas e operações administrativas de acordo com autenticação e papel.

## Dados pessoais

Existem campos como:
- email;
- telefone;
- cidade;
- estado;
- endereço.

Minimizar exposição desses dados.

Não registrar dados pessoais desnecessariamente no console.

## Segredos

Nunca colocar:
- senhas;
- tokens privados;
- chaves secretas;
- credenciais administrativas;

em código frontend.

Variáveis públicas de configuração não devem ser tratadas como segredos.

## Entrada do usuário

Validar e normalizar:
- nome;
- cidade;
- estado;
- categoria;
- pedidos;
- dedicatórias;
- mensagens;
- contatos.

Prevenir:
- conteúdo malformado;
- XSS;
- injeção;
- abuso de endpoints;
- submissões repetidas.

## Backup

Exportações JSON devem ser tratadas como dados potencialmente sensíveis.

Não expor backups publicamente.

## Exclusão

Nunca excluir dados ou arquivos sem confirmação humana quando a operação não tiver sido explicitamente autorizada.
