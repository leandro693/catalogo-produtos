# 📘 Guia rápido — Gerenciar o catálogo

Este guia mostra como **incluir produtos**, **ajustar preços** e **publicar** as mudanças
no seu site. Você não precisa saber programar.

---

## 1. Abrir o painel de administração

O painel é o arquivo **`admin.html`**. Há duas formas de abrir:

- **Site publicado (GitHub Pages):** acesse `https://SEU-USUARIO.github.io/catalogo-produtos/admin.html`
- **No seu computador:** baixe a pasta do projeto (no GitHub: botão verde **`< > Code` → Download ZIP**),
  extraia e dê **duplo-clique em `admin.html`**.

Na tela de senha, digite a senha do painel (a inicial é **`maradel`** — você pode trocá-la no
arquivo `js/admin.js`, na linha `var ADMIN_PASSWORD = "maradel";`).

---

## 2. Ajustar o preço de um produto

1. Na seção **Produtos**, clique em **Editar** no produto desejado.
2. Altere o campo **Preço (R$)**. Use **ponto** como decimal: `139.90` (não use vírgula).
3. Clique em **Salvar produto**.

## 3. Incluir um produto novo

1. Clique em **+ Novo produto**.
2. Preencha:
   - **Nome** (obrigatório)
   - **Categoria** — pode escolher uma existente ou digitar uma nova (ex.: "Calçados")
   - **Preço (R$)** (obrigatório)
   - **Descrição** — texto curto
   - **Imagem** — cole um **link** de foto **ou** clique para **enviar um arquivo** do seu aparelho
   - **Disponível para venda** e **Produto em destaque** (marque se quiser)
3. Clique em **Salvar produto**.

> 💾 Suas edições ficam guardadas automaticamente no navegador. Você pode fechar e voltar
> depois que elas continuam lá (até você publicar).

---

## 4. Publicar as mudanças

Depois de editar, é preciso **publicar** para que as alterações apareçam no site. Há **dois jeitos**:

### Jeito A — Publicar direto no GitHub (recomendado) 🚀

Envia as mudanças direto para o repositório, **sem baixar nem enviar arquivos manualmente**.
Só precisa ser configurado **uma única vez** (criar um token).

**Passo único de configuração — criar o token:**

1. No GitHub, clique na sua foto (canto superior direito) → **Settings**.
2. No menu lateral, vá até o final: **Developer settings**.
3. **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
4. Preencha:
   - **Token name:** `catalogo` (qualquer nome)
   - **Expiration:** escolha um prazo (ex.: 90 dias ou o máximo)
   - **Repository access:** marque **Only select repositories** → selecione **`catalogo-produtos`**
   - **Permissions** → **Repository permissions** → **Contents** → selecione **Read and write**
5. Clique em **Generate token** e **copie** o token (começa com `github_pat_...`).
   ⚠️ Ele só aparece uma vez — copie antes de fechar.

**Usando no painel:**

1. Na seção **Publicar direto no GitHub**, preencha:
   - **Repositório:** `leandro693/catalogo-produtos`
   - **Branch:** a mesma branch que o site usa (a que você configurou em Settings → Pages).
   - **Token do GitHub:** cole o token copiado.
2. Deixe marcado **Lembrar o token neste navegador** (assim não precisa colar de novo).
3. Clique em **🚀 Publicar direto no GitHub**.
4. Aparece **✅ Publicado no GitHub!** — o site atualiza em cerca de 1 minuto.

> 🔒 **Segurança:** o token dá acesso de escrita ao repositório e fica salvo **apenas no seu
> navegador** — ele **nunca** é gravado no site nem no catálogo. Por isso use um token
> *fine-grained* limitado só a este repositório. Se usar um computador compartilhado,
> **desmarque** "Lembrar o token".

### Jeito B — Baixar e enviar os arquivos (manual)

1. Clique em **⬇️ Publicar / Exportar**. O navegador baixa dois arquivos: **`config.js`** e **`products.js`**.
2. No GitHub, entre na pasta **`js`**, abra **`products.js`**, clique no **lápis (Edit)**,
   apague todo o conteúdo e cole o do arquivo baixado. Clique em **Commit changes**.
3. Repita para **`config.js`** (se você mexeu em nome da loja, WhatsApp ou cor).
4. O site atualiza em cerca de 1 minuto.

---

## 5. Continuar de onde parou (em outro computador)

Se for editar em outro aparelho/navegador, primeiro clique em **Importar arquivos** e selecione
os `config.js` e `products.js` atuais (da pasta `js/`) — assim o painel carrega o catálogo atual
para você continuar a partir dele.

---

## Dúvidas comuns

- **Mudei o preço mas o site não mudou.** Você editou, mas precisa **Publicar** (passo 4).
  Depois aguarde ~1 min e atualize a página (às vezes é preciso limpar o cache do navegador).
- **A foto não aparece.** Confira se o link da imagem é válido, ou envie o arquivo direto pelo painel.
- **Deu erro 403/404 ao publicar direto.** O token precisa da permissão **Contents: Read and write**
  neste repositório, e a **branch** informada precisa existir. Confira e tente de novo.
