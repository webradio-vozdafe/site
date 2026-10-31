# 🚀 Guia Oficial de Hospedagem no cPanel — Rádio Vóz da Fé

Este repositório já foi **100% preparado e pré-configurado** para ser hospedado no cPanel com máximo desempenho, suporte a áudio ao vivo, rotas SPA e HTTPS.

---

## 📋 Resumo das Configurações Criadas Automática no Projeto:

1. **`public/.htaccess`**: Arquivo de configuração do servidor Apache do cPanel com:
   - Fallback de rotas para Single Page Application (`index.html`).
   - Compressão Gzip automática para acelerar o carregamento.
   - Cabeçalhos de cache de navegador e políticas de segurança CORS.
2. **`app.js`**: Servidor Node.js de produção para provedores cPanel que usam o recurso "Setup Node.js App".
3. **`dist/`**: Pasta compilada pronta para produção obtida ao executar `npm run build`.

---

## 🌟 Opção 1: Hospedagem Estática de Arquivos (Método Mais Fácil e Recomendado)

Este método funciona em **100% das hospedagens cPanel** (HostGator, KingHost, Locaweb, Hostinger, GoDaddy, etc.) sem precisar configurar o Node.js no servidor.

### Passo a Passo:

1. **Gerar a Compilação de Produção**:
   - No terminal do projeto, rode o comando:
     ```bash
     npm run build
     ```
   - Uma pasta chamada `dist` será criada/atualizada com todos os arquivos otimizados.

2. **Compactar a Pasta `dist`**:
   - Abra a pasta `dist` no seu computador/ambiente.
   - Selecione todos os arquivos **dentro** dela (incluindo os arquivos ocultos como `.htaccess`, `index.html`, `sw.js`, `manifest.json` e a pasta `assets`).
   - Compacte em um arquivo `.zip` (ex: `vozdafe-dist.zip`).

3. **Enviar para o cPanel**:
   - Acesse o painel **cPanel** do seu domínio.
   - Abra a ferramenta **Gerenciador de Arquivos** (File Manager).
   - Navegue até a pasta **`public_html`** (ou a pasta do seu subdomínio/domínio adicional).
   - Clique em **Carregar** (Upload) e envie o arquivo `vozdafe-dist.zip`.

4. **Extrair os Arquivos**:
   - Volte ao Gerenciador de Arquivos, selecione o `vozdafe-dist.zip` e clique em **Extrair** (Extract).
   - Certifique-se de que os arquivos `index.html`, `.htaccess`, `sw.js` e a pasta `assets/` estejam **diretamente dentro de `public_html`**.

5. **Ativar Certificado SSL (HTTPS)**:
   - No cPanel, procure por **AutoSSL** ou **Let's Encrypt SSL**.
   - Clique em **Run AutoSSL** / **Instalar Certificado** para garantir o cadeado de segurança verde no navegador.

---

## ⚡ Opção 2: Hospedagem via Node.js App no cPanel (Opcional)

Se o seu plano cPanel possui o recurso **"Setup Node.js App"** (Phusion Passenger) habilitado:

1. **Upload do Código**:
   - Envie todos os arquivos do projeto para uma pasta fora do `public_html` (ex: `/home/usuario/vozdafe-app`).
   - *Nota*: Não envie a pasta `node_modules` (ela será gerada no servidor).

2. **Criar a Aplicação no cPanel**:
   - No cPanel, procure por **Configurar Aplicação Node.js** (*Setup Node.js App*).
   - Clique em **Create Application**:
     - **Node.js Version**: Selecione `18.x` ou `20.x`.
     - **Application Mode**: `Production`.
     - **Application Root**: `vozdafe-app` (caminho onde colocou os arquivos).
     - **Application URL**: selecione seu domínio ou subdomínio.
     - **Application Startup File**: `app.js`.

3. **Instalar Dependências e Compilar**:
   - Clique no botão **Run NPM Install**.
   - No terminal SSH do cPanel ou pela interface, rode `npm run build`.

4. **Iniciar o Servidor**:
   - Clique no botão **Restart Application** no topo da página do cPanel.

---

## 🔍 Como Atualizar o WhatsApp, Transmissão e Informações sem Reinstalar

Como o projeto possui integração direta com o Firebase Firestore e armazenamento local inteligente:
- Para alterar o número do **WhatsApp do Estúdio**, alterar o **Link da Transmissão (HD/SD/Alternativo)**, gerenciar **pedidos de hinos** ou **mural de oração**, você pode fazer tudo diretamente acessando o **Painel do Estúdio** pelo próprio site sem precisar editar arquivos no cPanel!

---

## 📞 Suporte & Verificação Final
Acesse o seu domínio no navegador e verifique:
- Reprodutor de áudio conectando instantaneamente.
- Navegação entre as abas e seções sem erros 404 ao recarregar a página.
