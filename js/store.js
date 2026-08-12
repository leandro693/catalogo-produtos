/* ==========================================================================
 * Loja pública — catálogo, carrinho e envio do pedido pelo WhatsApp.
 * Lê os dados de js/config.js (window.CATALOG_CONFIG) e
 * js/products.js (window.CATALOG_PRODUCTS).
 * ======================================================================== */
(function () {
  "use strict";

  var CONFIG = window.CATALOG_CONFIG || {};
  var PRODUCTS = Array.isArray(window.CATALOG_PRODUCTS) ? window.CATALOG_PRODUCTS : [];

  var CART_KEY = "catalogo_cart_v1";
  var state = {
    cart: loadCart(),        // { id: quantidade }
    category: "Todos",
    search: ""
  };

  var money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: CONFIG.currency || "BRL"
  });

  // ---- Helpers -----------------------------------------------------------
  function $(id) { return document.getElementById(id); }

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {}
  }
  function productById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }
  function cartCount() {
    var n = 0;
    for (var id in state.cart) { if (state.cart.hasOwnProperty(id)) n += state.cart[id]; }
    return n;
  }
  function cartTotal() {
    var t = 0;
    for (var id in state.cart) {
      if (!state.cart.hasOwnProperty(id)) continue;
      var p = productById(id);
      if (p) t += (Number(p.price) || 0) * state.cart[id];
    }
    return t;
  }

  // ---- Branding ----------------------------------------------------------
  function applyBranding() {
    if (CONFIG.primaryColor) {
      document.documentElement.style.setProperty("--primary", CONFIG.primaryColor);
      document.documentElement.style.setProperty("--primary-dark", shade(CONFIG.primaryColor, -18));
    }
    document.title = CONFIG.storeName || "Catálogo";
    $("storeName").textContent = CONFIG.storeName || "Minha Loja";
    $("storeTagline").textContent = CONFIG.tagline || "";
    if (CONFIG.logo) {
      var logo = $("storeLogo");
      logo.src = CONFIG.logo;
      logo.hidden = false;
      logo.alt = CONFIG.storeName || "Logo";
    }
  }

  // Escurece/clareia uma cor hex por uma porcentagem (-100 a 100)
  function shade(hex, percent) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    if (!m) return hex;
    var r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    var f = percent / 100;
    function adj(c) {
      return Math.max(0, Math.min(255, Math.round(c + (f < 0 ? c * f : (255 - c) * f))));
    }
    function h2(c) { var s = c.toString(16); return s.length === 1 ? "0" + s : s; }
    return "#" + h2(adj(r)) + h2(adj(g)) + h2(adj(b));
  }

  // ---- Categories --------------------------------------------------------
  function categories() {
    var seen = {}, list = ["Todos"];
    PRODUCTS.forEach(function (p) {
      if (p.category && !seen[p.category]) { seen[p.category] = true; list.push(p.category); }
    });
    return list;
  }

  function renderCategories() {
    var wrap = $("categories");
    wrap.innerHTML = "";
    categories().forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "chip" + (cat === state.category ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        state.category = cat;
        renderCategories();
        renderProducts();
      });
      wrap.appendChild(btn);
    });
  }

  // ---- Products ----------------------------------------------------------
  function filteredProducts() {
    var q = state.search.trim().toLowerCase();
    return PRODUCTS.filter(function (p) {
      var okCat = state.category === "Todos" || p.category === state.category;
      var okSearch = !q ||
        (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
        (p.description && p.description.toLowerCase().indexOf(q) !== -1);
      return okCat && okSearch;
    });
  }

  function renderProducts() {
    var wrap = $("products");
    wrap.innerHTML = "";
    var list = filteredProducts();

    if (!list.length) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = PRODUCTS.length
        ? "Nenhum produto encontrado para essa busca."
        : "Ainda não há produtos cadastrados. Use a área do administrador para adicionar.";
      wrap.appendChild(empty);
      return;
    }

    list.forEach(function (p) {
      var available = p.available !== false;
      var card = document.createElement("article");
      card.className = "card" + (available ? "" : " unavailable");

      var thumb = document.createElement("div");
      thumb.className = "thumb";
      if (p.image) {
        var img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name || "";
        img.loading = "lazy";
        img.onerror = function () { this.remove(); };
        thumb.appendChild(img);
      }
      card.appendChild(thumb);

      var body = document.createElement("div");
      body.className = "card-body";
      body.innerHTML =
        '<span class="card-cat"></span>' +
        '<h3></h3>' +
        '<p class="desc"></p>' +
        '<span class="price"></span>';
      body.querySelector(".card-cat").textContent = p.category || "";
      body.querySelector("h3").textContent = p.name || "";
      body.querySelector(".desc").textContent = p.description || "";
      body.querySelector(".price").textContent = money.format(Number(p.price) || 0);

      var btn = document.createElement("button");
      btn.className = "add-btn";
      if (available) {
        btn.textContent = "Adicionar";
        btn.addEventListener("click", function () { addToCart(p.id); });
      } else {
        btn.textContent = "Esgotado";
        btn.disabled = true;
      }
      body.appendChild(btn);

      card.appendChild(body);
      wrap.appendChild(card);
    });
  }

  // ---- Cart --------------------------------------------------------------
  function addToCart(id) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart();
    updateCartBadge();
    renderCart();
    showToast("Adicionado ao carrinho");
  }
  function changeQty(id, delta) {
    state.cart[id] = (state.cart[id] || 0) + delta;
    if (state.cart[id] <= 0) delete state.cart[id];
    saveCart();
    updateCartBadge();
    renderCart();
  }
  function removeItem(id) {
    delete state.cart[id];
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function updateCartBadge() {
    $("cartCount").textContent = cartCount();
  }

  function renderCart() {
    var wrap = $("cartItems");
    var footer = $("cartFooter");
    wrap.innerHTML = "";

    var ids = Object.keys(state.cart);
    if (!ids.length) {
      wrap.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.<br>Adicione produtos para começar.</div>';
      footer.hidden = true;
      return;
    }
    footer.hidden = false;

    ids.forEach(function (id) {
      var p = productById(id);
      if (!p) { delete state.cart[id]; return; }
      var qty = state.cart[id];
      var line = (Number(p.price) || 0) * qty;

      var row = document.createElement("div");
      row.className = "cart-item";

      var img = document.createElement("img");
      if (p.image) { img.src = p.image; img.onerror = function () { this.style.visibility = "hidden"; }; }
      img.alt = p.name || "";
      row.appendChild(img);

      var info = document.createElement("div");
      info.className = "info";
      info.innerHTML =
        '<h4></h4>' +
        '<div class="unit"></div>' +
        '<div class="qty">' +
          '<button class="dec" aria-label="Diminuir">−</button>' +
          '<span></span>' +
          '<button class="inc" aria-label="Aumentar">+</button>' +
        '</div>' +
        '<button class="remove-link">Remover</button>';
      info.querySelector("h4").textContent = p.name || "";
      info.querySelector(".unit").textContent = money.format(Number(p.price) || 0) + " cada";
      info.querySelector(".qty span").textContent = qty;
      info.querySelector(".dec").addEventListener("click", function () { changeQty(id, -1); });
      info.querySelector(".inc").addEventListener("click", function () { changeQty(id, 1); });
      info.querySelector(".remove-link").addEventListener("click", function () { removeItem(id); });
      row.appendChild(info);

      var lt = document.createElement("div");
      lt.className = "line-total";
      lt.textContent = money.format(line);
      row.appendChild(lt);

      wrap.appendChild(row);
    });

    $("cartTotal").textContent = money.format(cartTotal());
    saveCart();
  }

  // ---- Drawer ------------------------------------------------------------
  function openCart() {
    $("overlay").classList.add("open");
    $("cartDrawer").classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $("overlay").classList.remove("open");
    $("cartDrawer").classList.remove("open");
    document.body.style.overflow = "";
  }

  // ---- WhatsApp checkout -------------------------------------------------
  function buildMessage() {
    var lines = [];
    lines.push(CONFIG.greeting || "Olá! Gostaria de fazer o seguinte pedido:");
    lines.push("");
    lines.push("*" + (CONFIG.storeName || "Pedido") + "*");
    lines.push("");

    Object.keys(state.cart).forEach(function (id) {
      var p = productById(id);
      if (!p) return;
      var qty = state.cart[id];
      var line = (Number(p.price) || 0) * qty;
      lines.push("• " + qty + "x " + p.name + " — " + money.format(line));
    });

    lines.push("");
    lines.push("*Total: " + money.format(cartTotal()) + "*");

    var name = $("custName").value.trim();
    var phone = $("custPhone").value.trim();
    var addr = $("custAddress").value.trim();
    lines.push("");
    if (name) lines.push("Nome: " + name);
    if (phone) lines.push("Telefone: " + phone);
    if (addr) lines.push("Entrega/Obs.: " + addr);

    return lines.join("\n");
  }

  function checkout() {
    if (!Object.keys(state.cart).length) return;
    var name = $("custName").value.trim();
    if (!name) {
      showToast("Por favor, informe seu nome");
      $("custName").focus();
      return;
    }
    var number = (CONFIG.whatsapp || "").replace(/\D/g, "");
    if (!number) {
      showToast("Número de WhatsApp não configurado");
      return;
    }
    var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(buildMessage());
    window.open(url, "_blank");
  }

  // ---- Toast -------------------------------------------------------------
  var toastTimer;
  function showToast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  // ---- Init --------------------------------------------------------------
  function init() {
    applyBranding();
    renderCategories();
    renderProducts();
    updateCartBadge();
    renderCart();

    $("search").addEventListener("input", function (e) {
      state.search = e.target.value;
      renderProducts();
    });
    $("openCart").addEventListener("click", openCart);
    $("closeCart").addEventListener("click", closeCart);
    $("overlay").addEventListener("click", closeCart);
    $("checkout").addEventListener("click", checkout);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCart();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
