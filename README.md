# 🛍️ Catálogo de Vendas com pedido pelo WhatsApp

Um catálogo de produtos online, simples e gratuito. Você compartilha um link, o
cliente escolhe os produtos, monta o pedido e, ao finalizar, o pedido chega
**pronto no seu WhatsApp** (com itens, quantidades e total).

Não precisa de servidor, banco de dados nem programação. São só arquivos de site
(HTML/CSS/JS) que podem ser publicados de graça (ex.: GitHub Pages).

> 📘 **Guia rápido de uso** (incluir produtos, ajustar preços e publicar direto no
> GitHub): veja **[GUIA.md](GUIA.md)**.

---

## 📁 O que tem no projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | A **loja** que o cliente vê (o link que você compartilha). |
| `admin.html` | O **painel** onde você cadastra produtos e configurações. |
| `js/products.js` | A lista de produtos publicados. |
| `js/config.js` | As configurações (nome da loja, WhatsApp, cor). |
| `css/styles.css` | A aparência do site. |

Você **não precisa editar código**: use o painel (`admin.html`).

---

## 🚀 Como usar (passo a passo)

### 1. Abra o painel de administração
Abra `admin.html` no navegador. A senha inicial é **`maradel`**
(troque-a no arquivo `js/admin.js`, na linha `var ADMIN_PASSWORD = "maradel";`).

### 2. Configure a loja
Na seção **Configurações da loja**, preencha:
- **Nome da loja**
- **WhatsApp**: com DDI 55 + DDD + número, só dígitos.
  Exemplo: para (11) 98765-4321 → `5511987654321`.
- Frase do topo, cor principal e logo (opcionais).

### 3. Cadastre os produtos
Na seção **Produtos**, clique em **+ Novo produto** e preencha nome, categoria,
preço, descrição e imagem (cole uma URL de foto **ou** envie um arquivo). As
categorias (Roupas, Cama Mesa e Banho, Perfumes, Celulares…) você mesmo cria ao
digitar — elas viram os filtros da loja automaticamente.

> 💡 **Dica sobre imagens:** prefira colar uma **URL** de imagem (mais leve). Se
> enviar um arquivo, ele fica embutido no catálogo e pode deixá-lo pesado.

### 4. Publique
Clique em **Publicar / Exportar**. Serão baixados dois arquivos:
`config.js` e `products.js`. **Substitua** esses dois arquivos na pasta `js/`
do seu site e envie ao GitHub (commit/push) — ou faça upload deles pela
interface do GitHub. Pronto, a loja está atualizada.

> Para continuar editando outro dia, use **Importar arquivos** e selecione os
> `js/config.js` e `js/products.js` atuais para carregá-los no painel.

---

## 🌐 Como publicar o site de graça (GitHub Pages)

1. Suba estes arquivos para um repositório no GitHub.
2. No repositório, vá em **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Selecione a branch (ex.: `main`) e a pasta `/ (root)`. Clique em **Save**.
5. Em alguns minutos o GitHub mostra o link público, algo como
   `https://SEU-USUARIO.github.io/catalogo-produtos/`.
6. **Esse é o link que você compartilha** com os clientes. 🎉

> Alternativa: você pode publicar também em [Vercel](https://vercel.com) ou
> [Netlify](https://netlify.com) — basta conectar o repositório; não há etapa de
> build, é site estático.

---

## 📲 Como o pedido chega no WhatsApp

Quando o cliente clica em **Enviar pedido no WhatsApp**, o site abre o WhatsApp
com uma mensagem já escrita, tipo:

```
Olá! Gostaria de fazer o seguinte pedido:

*Minha Loja*

• 2x Camiseta Básica Algodão — R$ 99,80
• 1x Perfume Floral 100ml — R$ 129,90

*Total: R$ 229,70*

Nome: João da Silva
Telefone: 11 98765-4321
Entrega/Obs.: Rua X, 123
```

O cliente só confirma o envio. A mensagem cai no **seu** número (o que você
configurou). Você combina pagamento e entrega por lá.

---

## 🔒 Sobre a senha do painel

A senha do `admin.html` é uma trava **simples**, só para evitar que qualquer um
mexa por acidente. Ela **não é segurança de verdade** (fica no código do site).
Se o catálogo tiver dados sensíveis, o ideal é manter o `admin.html` apenas no
seu computador (não publicá-lo) e subir só a loja (`index.html` e os `js/`).

---

## ❓ Dúvidas comuns

- **Troquei o número e não mudou na loja?** Você precisa clicar em
  **Publicar / Exportar** e substituir os arquivos `js/config.js` e
  `js/products.js` no site.
- **A foto não aparece?** Confira se a URL da imagem está correta e acessível
  publicamente.
- **Posso ter várias categorias?** Sim, quantas quiser — basta digitar o nome da
  categoria ao cadastrar o produto.
