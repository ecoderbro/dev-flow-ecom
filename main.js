// ============================================
// devFlow Creative — shared UI helpers
// ============================================

function laptopIconSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
    <rect x="4" y="4" width="16" height="10.5" rx="0.8"/>
    <path d="M2 18.5h20l-1.6-3H3.6L2 18.5Z"/>
    <path d="M10 18.5h4" stroke-linecap="round"/>
  </svg>`;
}

function deviceIconSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
    <rect x="3" y="4" width="18" height="12" rx="1"/>
    <path d="M9 20h6M12 16v4" stroke-linecap="round"/>
  </svg>`;
}

function fmtPrice(n) {
  return "Rs " + Math.round(n).toLocaleString("en-PK");
}

function discountedPrice(price, discount) {
  return discount ? price - (price * discount) / 100 : price;
}

// ---------- Laptop card (used on brand pages + index featured strip) ----------
function laptopCardHTML(l) {
  const finalPrice = discountedPrice(l.price, l.discount);
  return `
  <article class="product-card">
    <div class="product-thumb">
      ${l.discount ? `<span class="badge">-${l.discount}%</span>` : ""}
      ${productArt(l)}
    </div>
    <div class="product-body">
      <div class="product-brand">${l.brand}</div>
      <div class="product-name">${l.name}</div>
      <div class="product-specs">
        <span>${l.screen}"</span>
        <span>${l.ram}GB RAM</span>
        <span>${l.storage}</span>
        <span>${l.color}</span>
      </div>
      <div class="product-price-row">
        <span class="price-now">${fmtPrice(finalPrice)}</span>
        ${l.discount ? `<span class="price-old">${fmtPrice(l.price)}</span>` : ""}
      </div>
      <button type="button" class="add-cart-btn" data-add-to-cart
        data-id="${l.id}" data-name="${escAttr(l.name)}" data-price="${finalPrice}" data-brand="${l.brand.toUpperCase()}">
        Add to cart
      </button>
    </div>
  </article>`;
}

// ---------- Simple card (peripherals / monitors) ----------
function simpleCardHTML(item, opts) {
  opts = opts || {};
  const finalPrice = discountedPrice(item.price, item.discount);
  const specs = opts.specs ? opts.specs(item) : `<span>${item.color}</span>`;
  return `
  <article class="product-card">
    <div class="product-thumb">
      ${item.discount ? `<span class="badge">-${item.discount}%</span>` : ""}
      ${productArt(item)}
    </div>
    <div class="product-body">
      <div class="product-brand">${item.cat}</div>
      <div class="product-name">${item.name}</div>
      <div class="product-specs">${specs}</div>
      <div class="product-price-row">
        <span class="price-now">${fmtPrice(finalPrice)}</span>
        ${item.discount ? `<span class="price-old">${fmtPrice(item.price)}</span>` : ""}
      </div>
      <button type="button" class="add-cart-btn" data-add-to-cart
        data-id="${item.id}" data-name="${escAttr(item.name)}" data-price="${finalPrice}" data-cat="${escAttr(item.cat)}">
        Add to cart
      </button>
    </div>
  </article>`;
}

// ---------- Mobile nav + mobile filter drawer ----------
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const header = document.querySelector(".site-header");

  if (toggle && nav) {
    // Put Log in / Sign up inside the mobile menu (hidden on desktop via CSS)
    if (!nav.querySelector(".nav-extra")) {
      nav.insertAdjacentHTML(
        "beforeend",
        '<a href="login.html" class="nav-extra">Log in</a><a href="signup.html" class="nav-extra">Sign up</a>'
      );
    }
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mainNav");

    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("click", (e) => { if (header && !header.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 720) setOpen(false); });
  }

  // Collapsible filters on phones (brand pages)
  const filters = document.querySelector(".filters");
  if (filters && !document.querySelector(".filters-toggle")) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filters-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<span>Filters</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M7 12h10M10 17h4" stroke-linecap="round"/></svg>';
    filters.parentNode.insertBefore(btn, filters);
    btn.addEventListener("click", () => {
      const open = filters.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
});

// ---------- Brand listing page filter engine ----------
// Expects: window.PAGE_LAPTOPS (array), a #productGrid container,
// and filter checkboxes named data-filter="screen|ram|color" with data-value.
function initBrandFilters() {
  const grid = document.getElementById("productGrid");
  const resultCount = document.getElementById("resultCount");
  if (!grid || !window.PAGE_LAPTOPS) return;

  const checkboxes = document.querySelectorAll(".filters input[type=checkbox]");

  function applyFilters() {
    const active = { screen: [], ram: [], color: [] };
    checkboxes.forEach((cb) => {
      if (cb.checked) active[cb.dataset.filter].push(cb.dataset.value);
    });

    const filtered = window.PAGE_LAPTOPS.filter((l) => {
      const screenOk = active.screen.length === 0 || active.screen.includes(String(l.screen));
      const ramOk = active.ram.length === 0 || active.ram.includes(String(l.ram));
      const colorOk = active.color.length === 0 || active.color.includes(l.color);
      return screenOk && ramOk && colorOk;
    });

    grid.innerHTML = filtered.length
      ? filtered.map(laptopCardHTML).join("")
      : `<div class="empty-state"><h3>No laptops match those filters</h3><p>Try clearing a filter to see more results.</p></div>`;

    if (resultCount) resultCount.textContent = `${filtered.length} laptop${filtered.length === 1 ? "" : "s"}`;
    wireAddToCartButtons();
  }

  checkboxes.forEach((cb) => cb.addEventListener("change", applyFilters));

  const resetBtn = document.getElementById("filterReset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      checkboxes.forEach((cb) => (cb.checked = false));
      applyFilters();
    });
  }

  applyFilters();
}
