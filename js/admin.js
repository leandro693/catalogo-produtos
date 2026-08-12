/* ==========================================================================
 * Painel de administração — cadastro de produtos, configurações e publicação.
 *
 * Fluxo:
 *  - Ao abrir, carrega os dados já publicados (config.js / products.js) e,
 *    se houver rascunho salvo no navegador (localStorage), usa o rascunho.
 *  - Todas as edições ficam no rascunho (localStorage) até você Publicar.
 *  - "Publicar / Exportar" baixa config.js e products.js prontos para subir.
 * ======================================================================== */
(function () {
  "use strict";

  // Senha do painel (troque aqui se quiser). NÃO é segurança real — apenas
  // evita acesso casual. Veja observação no README.
  var ADMIN_PASSWORD = "maradel";
  var SESSION_KEY = "catalogo_admin_ok";
  var DRAFT_PRODUCTS_KEY = "catalogo_draft_products";
  var DRAFT_CONFIG_KEY = "catalogo_draft_config";
  var IMG_WARN_BYTES = 250 * 1024; // ~250 KB

  function $(id) { return document.getElementById(id); }

  // Estado de trabalho (rascunho)
  var products = [];
  var config = {};

  // ---- Autenticação simples ---------------------------------------------
  function isLogged() {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
  }
  function login() {
    var pass = $("gatePass").value;
    if (pass === ADMIN_PASSWORD) {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
      showApp();
    } else {
      $("gateMsg").textContent = "Senha incorreta.";
    }
  }
  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    location.reload();
  }
  function showApp() {
    $("gate").classList.add("hidden");
    $("app").classList.remove("hidden");
    boot();
  }

  // ---- Carregar dados (rascunho ou publicado) ----------------------------
  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

  function loadData() {
    // config
    var draftCfg = safeParse(localStorage.getItem(DRAFT_CONFIG_KEY));
    config = draftCfg || deepCopy(window.CATALOG_CONFIG || {});
    // defaults
    config.storeName = config.storeName || "Minha Loja";
    config.whatsapp = config.whatsapp || "";
    config.primaryColor = config.primaryColor || "#7c3aed";
    config.logo = config.logo || "";
    config.greeting = config.greeting || "Olá! Gostaria de fazer o seguinte pedido:";
    config.tagline = config.tagline || "Escolha seus produtos e finalize pelo WhatsApp";
    config.currency = config.currency || "BRL";

    // products
    var draftProds = safeParse(localStorage.getItem(DRAFT_PRODUCTS_KEY));
    products = draftProds || deepCopy(window.CATALOG_PRODUCTS || []);
  }

  function safeParse(raw) {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_CONFIG_KEY, JSON.stringify(config));
      localStorage.setItem(DRAFT_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      showToast("Não foi possível salvar o rascunho (armazenamento cheio).");
    }
  }

  // ---- Configurações -----------------------------------------------------
  function fillConfigForm() {
    $("cfgName").value = config.storeName;
    $("cfgWhats").value = config.whatsapp;
    $("cfgTagline").value = config.tagline;
    $("cfgGreeting").value = config.greeting;
    $("cfgColor").value = /^#[0-9a-f]{6}$/i.test(config.primaryColor) ? config.primaryColor : "#7c3aed";
    $("cfgLogo").value = config.logo;
  }

  function bindConfigForm() {
    function sync() {
      config.storeName = $("cfgName").value.trim();
      config.whatsapp = $("cfgWhats").value.replace(/\D/g, "");
      config.tagline = $("cfgTagline").value.trim();
      config.greeting = $("cfgGreeting").value.trim();
      config.primaryColor = $("cfgColor").value;
      config.logo = $("cfgLogo").value.trim();
      saveDraft();
    }
    ["cfgName", "cfgWhats", "cfgTagline", "cfgGreeting", "cfgColor", "cfgLogo"].forEach(function (id) {
      $(id).addEventListener("input", sync);
      $(id).addEventListener("change", sync);
    });
  }

  // ---- Lista de produtos -------------------------------------------------
  function money(v) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: config.currency || "BRL" })
      .format(Number(v) || 0);
  }

  function renderProdList() {
    var wrap = $("prodList");
    wrap.innerHTML = "";
    if (!products.length) {
      wrap.innerHTML = '<p class="note">Nenhum produto ainda. Clique em "+ Novo produto".</p>';
      refreshCatList();
      return;
    }
    products.forEach(function (p, index) {
      var row = document.createElement("div");
      row.className = "prod-row" + (p.available === false ? " is-out" : "");

      var img = document.createElement("img");
      if (p.image) { img.src = p.image; img.onerror = function () { this.style.visibility = "hidden"; }; }
      img.alt = "";
      row.appendChild(img);

      var info = document.createElement("div");
      info.className = "p-info";
      info.innerHTML = "<strong></strong><small></small>";
      info.querySelector("strong").textContent = p.name || "(sem nome)";
      info.querySelector("small").innerHTML =
        (p.category ? escapeHtml(p.category) + " · " : "") + money(p.price) +
        (p.available === false ? ' · <span class="tag-out">Esgotado</span>' : "") +
        (p.featured ? " · ⭐" : "");
      row.appendChild(info);

      var actions = document.createElement("div");
      actions.className = "p-actions";

      var up = mkBtn("↑", function () { move(index, -1); });
      var down = mkBtn("↓", function () { move(index, 1); });
      var edit = mkBtn("Editar", function () { openModal(p.id); });
      var del = mkBtn("Excluir", function () { removeProduct(p.id); });
      up.disabled = index === 0;
      down.disabled = index === products.length - 1;
      actions.appendChild(up);
      actions.appendChild(down);
      actions.appendChild(edit);
      actions.appendChild(del);
      row.appendChild(actions);

      wrap.appendChild(row);
    });
    refreshCatList();
  }

  function mkBtn(label, fn) {
    var b = document.createElement("button");
    b.textContent = label;
    b.addEventListener("click", fn);
    return b;
  }

  function move(index, delta) {
    var to = index + delta;
    if (to < 0 || to >= products.length) return;
    var tmp = products[index];
    products[index] = products[to];
    products[to] = tmp;
    saveDraft();
    renderProdList();
  }

  function removeProduct(id) {
    var p = productById(id);
    if (!p) return;
    if (!confirm('Excluir o produto "' + (p.name || "") + '"?')) return;
    products = products.filter(function (x) { return x.id !== id; });
    saveDraft();
    renderProdList();
    showToast("Produto excluído");
  }

  function productById(id) {
    for (var i = 0; i < products.length; i++) { if (products[i].id === id) return products[i]; }
    return null;
  }

  function refreshCatList() {
    var seen = {}, dl = $("catList");
    dl.innerHTML = "";
    products.forEach(function (p) {
      if (p.category && !seen[p.category]) {
        seen[p.category] = true;
        var opt = document.createElement("option");
        opt.value = p.category;
        dl.appendChild(opt);
      }
    });
  }

  // ---- Modal de produto --------------------------------------------------
  function openModal(id) {
    var editing = productById(id);
    $("modalTitle").textContent = editing ? "Editar produto" : "Novo produto";
    $("fId").value = editing ? editing.id : "";
    $("fName").value = editing ? (editing.name || "") : "";
    $("fCategory").value = editing ? (editing.category || "") : "";
    $("fPrice").value = editing && editing.price != null ? editing.price : "";
    $("fDesc").value = editing ? (editing.description || "") : "";
    $("fImage").value = editing ? (editing.image || "") : "";
    $("fAvailable").checked = editing ? editing.available !== false : true;
    $("fFeatured").checked = editing ? !!editing.featured : false;
    $("fImageFile").value = "";
    updateImgPreview(editing ? editing.image : "");
    $("prodModal").classList.add("open");
    $("fName").focus();
  }

  function closeModal() {
    $("prodModal").classList.remove("open");
  }

  function updateImgPreview(src) {
    var prev = $("fImagePreview");
    if (src) { prev.src = src; prev.classList.remove("hidden"); }
    else { prev.classList.add("hidden"); prev.removeAttribute("src"); }
    $("imgWarn").classList.toggle("hidden", !(src && src.length > IMG_WARN_BYTES));
  }

  function handleImageFile(file) {
    if (!file) return;
    if (file.size > IMG_WARN_BYTES) {
      showToast("Imagem grande — o catálogo pode ficar pesado.");
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      $("fImage").value = e.target.result; // data URI
      updateImgPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function saveProduct() {
    var name = $("fName").value.trim();
    var priceRaw = $("fPrice").value;
    if (!name) { showToast("Informe o nome do produto"); $("fName").focus(); return; }
    if (priceRaw === "" || isNaN(Number(priceRaw))) { showToast("Informe um preço válido"); $("fPrice").focus(); return; }

    var id = $("fId").value || genId();
    var data = {
      id: id,
      name: name,
      category: $("fCategory").value.trim(),
      price: Number(priceRaw),
      description: $("fDesc").value.trim(),
      image: $("fImage").value.trim(),
      available: $("fAvailable").checked,
      featured: $("fFeatured").checked
    };

    var existing = productById(id);
    if (existing) {
      var idx = products.indexOf(existing);
      products[idx] = data;
    } else {
      products.push(data);
    }
    saveDraft();
    renderProdList();
    closeModal();
    showToast("Produto salvo");
  }

  function genId() {
    var max = 0;
    products.forEach(function (p) {
      var m = /^p(\d+)$/.exec(p.id || "");
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return "p" + (max + 1);
  }

  // ---- Publicar / Exportar ----------------------------------------------
  function buildConfigFile() {
    var c = {
      storeName: config.storeName,
      whatsapp: config.whatsapp,
      primaryColor: config.primaryColor,
      logo: config.logo,
      greeting: config.greeting,
      currency: config.currency || "BRL",
      tagline: config.tagline
    };
    return "/* Gerado pelo painel admin. */\n" +
      "window.CATALOG_CONFIG = " + JSON.stringify(c, null, 2) + ";\n";
  }

  function buildProductsFile() {
    return "/* Gerado pelo painel admin. */\n" +
      "window.CATALOG_PRODUCTS = " + JSON.stringify(products, null, 2) + ";\n";
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function publish() {
    if (!config.whatsapp) {
      if (!confirm("O número do WhatsApp está vazio. Os pedidos não terão para onde ir. Publicar mesmo assim?")) {
        $("cfgWhats").focus();
        return;
      }
    }
    download("config.js", buildConfigFile());
    // pequeno atraso para não bloquear o segundo download em alguns navegadores
    setTimeout(function () { download("products.js", buildProductsFile()); }, 400);
    showToast("Arquivos baixados! Substitua-os na pasta js/ do site.");
  }

  // ---- Importar arquivos publicados -------------------------------------
  function handleImportFiles(files) {
    var arr = Array.prototype.slice.call(files);
    var pending = arr.length;
    if (!pending) return;
    arr.forEach(function (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        parseImported(e.target.result);
        pending--;
        if (pending === 0) {
          saveDraft();
          fillConfigForm();
          renderProdList();
          applyColorLive();
          showToast("Arquivos importados");
        }
      };
      reader.readAsText(file);
    });
  }

  // Extrai o objeto/array atribuído a window.CATALOG_CONFIG / CATALOG_PRODUCTS
  function parseImported(text) {
    try {
      var cfgMatch = text.match(/CATALOG_CONFIG\s*=\s*([\s\S]*?);?\s*$/);
      var prodMatch = text.match(/CATALOG_PRODUCTS\s*=\s*([\s\S]*?);?\s*$/);
      if (/CATALOG_CONFIG/.test(text)) {
        var cfgObj = evalLiteral(text, "CATALOG_CONFIG");
        if (cfgObj && typeof cfgObj === "object") config = Object.assign(config, cfgObj);
      }
      if (/CATALOG_PRODUCTS/.test(text)) {
        var prodObj = evalLiteral(text, "CATALOG_PRODUCTS");
        if (Array.isArray(prodObj)) products = prodObj;
      }
    } catch (e) {
      showToast("Não foi possível ler um dos arquivos.");
    }
  }

  // Executa o arquivo num escopo controlado e captura a variável global definida.
  function evalLiteral(fileText, varName) {
    var sandbox = { CATALOG_CONFIG: undefined, CATALOG_PRODUCTS: undefined };
    var fn = new Function("window", fileText + "\nreturn window;");
    var result = fn(sandbox);
    return result[varName];
  }

  // ---- Cor ao vivo no painel --------------------------------------------
  function applyColorLive() {
    if (/^#[0-9a-f]{6}$/i.test(config.primaryColor)) {
      document.documentElement.style.setProperty("--primary", config.primaryColor);
      document.documentElement.style.setProperty("--primary-dark", shade(config.primaryColor, -18));
    }
  }
  function shade(hex, percent) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    if (!m) return hex;
    var r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    var f = percent / 100;
    function adj(c) { return Math.max(0, Math.min(255, Math.round(c + (f < 0 ? c * f : (255 - c) * f)))); }
    function h2(c) { var s = c.toString(16); return s.length === 1 ? "0" + s : s; }
    return "#" + h2(adj(r)) + h2(adj(g)) + h2(adj(b));
  }

  // ---- Util --------------------------------------------------------------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var toastTimer;
  function showToast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2000);
  }

  // ---- Boot --------------------------------------------------------------
  function boot() {
    loadData();
    fillConfigForm();
    bindConfigForm();
    renderProdList();
    applyColorLive();

    $("cfgColor").addEventListener("input", applyColorLive);

    $("addProdBtn").addEventListener("click", function () { openModal(null); });
    $("saveProdBtn").addEventListener("click", saveProduct);
    $("cancelProdBtn").addEventListener("click", closeModal);
    $("prodModal").addEventListener("click", function (e) {
      if (e.target === $("prodModal")) closeModal();
    });

    $("fImage").addEventListener("input", function () { updateImgPreview($("fImage").value.trim()); });
    $("fImageFile").addEventListener("change", function (e) { handleImageFile(e.target.files[0]); });

    $("publishBtn").addEventListener("click", publish);
    $("importBtn").addEventListener("click", function () { $("importFile").click(); });
    $("importFile").addEventListener("change", function (e) { handleImportFiles(e.target.files); e.target.value = ""; });

    $("logoutBtn").addEventListener("click", logout);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  // ---- Init (gate) -------------------------------------------------------
  function init() {
    if (isLogged()) {
      showApp();
    } else {
      $("gateBtn").addEventListener("click", login);
      $("gatePass").addEventListener("keydown", function (e) { if (e.key === "Enter") login(); });
      $("gatePass").focus();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
