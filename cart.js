// ============================================
// devFlow Creative — cart engine
// Shared across every page via localStorage.
// ============================================

const CART_KEY = "devflow_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  flashCartIcon();
}

function removeFromCart(id) {
  saveCart(getCart().filter((c) => c.id !== id));
}

function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  item.qty = qty;
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, c) => sum + c.qty * c.price, 0);
}

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatPKR(n) {
  return "Rs " + Math.round(n).toLocaleString("en-PK");
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.setAttribute("data-empty", count === 0 ? "true" : "false");
  });
}

function flashCartIcon() {
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }],
      { duration: 260, easing: "ease-out" }
    );
  });
}

function itemIconSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="13" rx="1"/><path d="M8 6V5a4 4 0 0 1 8 0v1"/></svg>`;
}

function cartThumb(item) {
  try {
    if (typeof allProducts === "function" && typeof productArt === "function") {
      const p = allProducts()[item.id];
      if (p) return productArt(p);
    }
  } catch (e) {}
  return itemIconSvg();
}

function renderCartDrawer() {
  const itemsEl = document.getElementById("cartItems");
  const footEl = document.getElementById("cartFooter");
  if (!itemsEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br>Browse the catalog to add something.</div>`;
    if (footEl) footEl.style.display = "none";
    return;
  }

  if (footEl) footEl.style.display = "block";

  itemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-thumb">${cartThumb(item)}</div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand || item.cat || "devFlow"}</div>
        <div class="cart-item-name">${escHtml(item.name)}</div>
        <div class="cart-item-row">
          <div class="qty-ctrl">
            <button type="button" onclick="setQty('${item.id}', ${item.qty - 1})" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" onclick="setQty('${item.id}', ${item.qty + 1})" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-price">${formatPKR(item.price * item.qty)}</div>
        </div>
        <button type="button" class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    </div>`
    )
    .join("");

  const subtotalEl = document.getElementById("cartSubtotal");
  if (subtotalEl) subtotalEl.textContent = formatPKR(cartTotal());
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

// Wire up any element carrying add-to-cart data attributes.
function wireAddToCartButtons() {
  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        brand: btn.dataset.brand || "",
        cat: btn.dataset.cat || "",
      };
      addToCart(item);
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("added");
      }, 1100);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();
  wireAddToCartButtons();

  document.getElementById("cartOpenBtn")?.addEventListener("click", openCart);
  document.getElementById("cartCloseBtn")?.addEventListener("click", closeCart);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);

  // Keep the badge in sync if the cart changes in another open tab/window.
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) {
      updateCartBadge();
      renderCartDrawer();
    }
  });
});
