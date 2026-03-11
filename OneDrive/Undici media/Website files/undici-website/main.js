/* ============================================================
   undici — main.js
   undicibrand.com
   ============================================================ */

// ── CURSOR ────────────────────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .swatch, .size-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// ── CAROUSEL ──────────────────────────────────────────────
const colorImages = {
  black:  [...document.querySelectorAll('.carousel-slide[data-color="black"]')],
  white:  [...document.querySelectorAll('.carousel-slide[data-color="white"]')],
  cream:  [...document.querySelectorAll('.carousel-slide[data-color="cream"]')],
  orange: [...document.querySelectorAll('.carousel-slide[data-color="orange"]')],
};

let currentColor = 'black';
let currentIndex = 0;

function getColorSlides() {
  return colorImages[currentColor];
}

function buildDots() {
  const dotsEl = document.getElementById('carouselDots');
  dotsEl.innerHTML = '';
  getColorSlides().forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });
}

function goTo(index) {
  const slides = getColorSlides();
  slides[currentIndex].classList.remove('active');
  currentIndex = (index + slides.length) % slides.length;
  slides[currentIndex].classList.add('active');
  buildDots();
}

function switchColor(color) {
  getColorSlides().forEach(s => s.classList.remove('active'));
  currentColor = color;
  currentIndex = 0;
  getColorSlides()[0].classList.add('active');
  buildDots();
}

document.getElementById('carouselNext').addEventListener('click', () => goTo(currentIndex + 1));
document.getElementById('carouselPrev').addEventListener('click', () => goTo(currentIndex - 1));

// Wire swatches to carousel
document.querySelectorAll('.swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    document.getElementById('colorNameDisplay').textContent = swatch.dataset.name;
    switchColor(swatch.dataset.color);
  });
});

// Init dots
buildDots();

// ── MATRIX RAIN ───────────────────────────────────────────
(function () {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');
  const chars  = 'undici11ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΩΨΦΣΔΛΞαβγδεζηθ∞≠≈∑∏√∫';

  let cols, drops, animId;
  const fontSize = 14;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 8, 6, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const char     = chars[Math.floor(Math.random() * chars.length)];
      const progress = drops[i] / (canvas.height / fontSize);

      if (Math.random() > 0.95) {
        ctx.fillStyle = '#f0ebe0';
        ctx.font = `bold ${fontSize}px 'DM Mono', monospace`;
      } else {
        const r = Math.floor(180 - progress * 120);
        const g = Math.floor(progress * 100);
        ctx.fillStyle = `rgba(${r + 40}, ${g + 80}, 20, ${0.85 - progress * 0.4})`;
        ctx.font = `${fontSize}px 'DM Mono', monospace`;
      }

      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  document.getElementById('enterBtn').addEventListener('click', () => {
    cancelAnimationFrame(animId);
    document.getElementById('enter-overlay').classList.add('hidden');
  });
})();

// ── COUNTDOWN TIMER ───────────────────────────────────────
(function () {
  // Target: March 19, 2026 at 23:59 local time
  const target = new Date('2026-03-19T23:59:00').getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function flashNum(el) {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
  }

  let prevSecs = null;

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      document.querySelector('.countdown-blocks').innerHTML =
        '<span class="countdown-expired">Pre-order Closed</span>';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cdDays').textContent  = pad(days);
    document.getElementById('cdHours').textContent = pad(hours);
    document.getElementById('cdMins').textContent  = pad(mins);

    const secsEl = document.getElementById('cdSecs');
    if (secs !== prevSecs) {
      secsEl.textContent = pad(secs);
      flashNum(secsEl);
      prevSecs = secs;
    }
  }

  tick();
  setInterval(tick, 1000);
})();

// ── VARIANT MAP ───────────────────────────────────────────
// color + size → Shopify Variant ID
const variantMap = {
  black:  { XS: '48308716962011', S: '48285965058267', M: '48285965189339', L: '48285965320411', XL: '48285965451483', XXL: '48285965582555' },
  white:  { XS: '48308716994779', S: '48285965091035', M: '48285965222107', L: '48285965353179', XL: '48285965484251', XXL: '48285965615323' },
  cream:  { XS: '48308717027547', S: '48285965123803', M: '48285965254875', L: '48285965385947', XL: '48285965517019', XXL: '48285965648091' },
  orange: { XS: '48308717060315', S: '48285965156571', M: '48285965287643', L: '48285965418715', XL: '48285965549787', XXL: '48285965680859' },
};

let qty           = 1;
let selectedColor = 'black';
let selectedSize  = 'S';

const qtyNumEl  = document.getElementById('qtyNum');
const shopifyBtn = document.getElementById('shopifyBtn');

function updateCheckoutLink() {
  qtyNumEl.textContent = qty;
  const variantId = variantMap[selectedColor]?.[selectedSize];
  if (variantId) {
    // IMPORTANT: Always use bu4f1a-ng.myshopify.com — never undicibrand.com
    shopifyBtn.href = `https://bu4f1a-ng.myshopify.com/cart/${variantId}:${qty}`;
    shopifyBtn.querySelector('span').textContent = 'Pre-order Now — $45';
    shopifyBtn.style.opacity       = '1';
    shopifyBtn.style.pointerEvents = 'auto';
  } else {
    shopifyBtn.href = '#';
    shopifyBtn.querySelector('span').textContent = 'Select Size & Color';
    shopifyBtn.style.opacity = '0.5';
  }
}

// ── QUANTITY SELECTOR ─────────────────────────────────────
document.getElementById('qtyMinus').addEventListener('click', () => {
  if (qty > 1) { qty--; updateCheckoutLink(); }
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  qty++;
  updateCheckoutLink();
});

// Add qty buttons to cursor hover effect
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  btn.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// ── SIZE SELECTOR ─────────────────────────────────────────
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = btn.textContent.trim();
    updateCheckoutLink();
  });
});

// ── COLOR → CHECKOUT SYNC ─────────────────────────────────
document.querySelectorAll('.swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    selectedColor = swatch.dataset.color;
    updateCheckoutLink();
  });
});

// Init checkout link
updateCheckoutLink();

// ── CART SYSTEM ───────────────────────────────────────────
const cartState = [];
const cartThumbs = {
  black:  'https://cdn.shopify.com/s/files/1/0787/2321/9675/files/GF_reference_4.png?v=1772255032',
  white:  'https://cdn.shopify.com/s/files/1/0787/2321/9675/files/White_shirt_model.jpg?v=1772062863',
  cream:  'https://cdn.shopify.com/s/files/1/0787/2321/9675/files/beige_with_hanger_mockup.png?v=1772061911',
  orange: 'https://cdn.shopify.com/s/files/1/0787/2321/9675/files/Orange_mockup_2_63144bc9-9005-4537-814c-9cb8cade79e0.png?v=1772061441',
};
const colorNames = {
  black:  'Void Black',
  white:  'Sacred White',
  cream:  'Desert Realm',
  orange: 'Ember Ascent',
};
const PRICE = 45;

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

function buildCheckoutUrl() {
  if (cartState.length === 0) return '#';
  const items = cartState.map(item => `${item.variantId}:${item.qty}`).join(',');
  // IMPORTANT: Always use bu4f1a-ng.myshopify.com — never undicibrand.com
  return `https://bu4f1a-ng.myshopify.com/cart/${items}`;
}

function renderCart() {
  const itemsEl     = document.getElementById('cartItems');
  const totalEl     = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  if (cartState.length === 0) {
    itemsEl.innerHTML    = '<div class="cart-empty">Your cart is empty</div>';
    totalEl.textContent  = '$0.00';
    checkoutBtn.href     = '#';
    return;
  }

  let total = 0;
  itemsEl.innerHTML = cartState.map((item, idx) => {
    total += item.qty * PRICE;
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${cartThumbs[item.color]}" alt="undici ${item.color} tee">
        <div class="cart-item-info">
          <span class="cart-item-name">undici</span>
          <span class="cart-item-meta">${colorNames[item.color]} · ${item.size}</span>
          <div class="cart-item-qty">
            <button onclick="updateCartQty(${idx}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateCartQty(${idx}, 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${idx})">Remove</button>
        </div>
        <span class="cart-item-price">$${item.qty * PRICE}</span>
      </div>`;
  }).join('');

  totalEl.textContent = `$${total}.00`;
  checkoutBtn.href    = buildCheckoutUrl();
}

function updateCartQty(idx, delta) {
  cartState[idx].qty += delta;
  if (cartState[idx].qty <= 0) cartState.splice(idx, 1);
  renderCart();
}

function removeCartItem(idx) {
  cartState.splice(idx, 1);
  renderCart();
}

document.getElementById('addToCartBtn').addEventListener('click', () => {
  if (!selectedSize) { alert('Please select a size'); return; }
  const variantId = variantMap[selectedColor]?.[selectedSize];
  if (!variantId) return;

  const existing = cartState.find(i => i.color === selectedColor && i.size === selectedSize);
  if (existing) {
    existing.qty += qty;
  } else {
    cartState.push({ color: selectedColor, size: selectedSize, qty, variantId });
  }
  renderCart();
  openCart();
});

// Init cart
renderCart();

// ── SCROLL REVEAL ─────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
