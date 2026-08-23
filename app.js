let perfumes = [];
let cart = [];
let activeFilters = {
  gender: 'all',
  tag: 'all',
  scent_family: 'all',
  search: ''
};

// Sync perfumes with backend & local backup
async function fetchCatalog() {
  try {
    const res = await fetch('/api');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        perfumes = data;
        localStorage.setItem('aurum_catalog', JSON.stringify(perfumes));
        renderCatalog();
        return;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, reading cache...');
  }
  
  const cached = localStorage.getItem('aurum_catalog');
  if (cached) {
    perfumes = JSON.parse(cached);
    renderCatalog();
  }
}

function renderCatalog() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = perfumes.filter(p => {
    const matchGender = activeFilters.gender === 'all' || p.gender.toLowerCase() === activeFilters.gender.toLowerCase();
    const matchTag = activeFilters.tag === 'all' || p.tag.toLowerCase() === activeFilters.tag.toLowerCase();
    const matchFamily = activeFilters.scent_family === 'all' || p.scent_family.toLowerCase() === activeFilters.scent_family.toLowerCase();
    const query = activeFilters.search.toLowerCase();
    const matchSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.notes.toLowerCase().includes(query) ||
      p.scent_family.toLowerCase().includes(query);

    return matchGender && matchTag && matchFamily && matchSearch;
  });

  const matchCount = document.getElementById('matchCount');
  if (matchCount) matchCount.innerText = `Showing ${filtered.length} fragrances`;

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openProductModal(p.id);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <span class="badge">${p.gender}</span>
        <img src="${p.image}" alt="${p.name}" onerror="this.src='images/dior-sauvage.png'">
      </div>
      <div class="card-info">
        <span class="card-tag">${p.scent_family} • ${p.tag}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-price">₱${p.price.toFixed(2)}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openProductModal(id) {
  const item = perfumes.find(p => p.id === id);
  if (!item) return;

  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="modal-img-col">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/dior-sauvage.png'">
    </div>
    <div class="modal-detail-col">
      <h2>${item.name}</h2>
      <div class="detail-row"><strong>Category:</strong> ${item.gender} Eau De Parfum</div>
      <div class="detail-row"><strong>Scent Family:</strong> ${item.scent_family}</div>
      <div class="detail-row"><strong>Key Notes:</strong> ${item.notes}</div>
      <div class="detail-row"><strong>Best Time to Wear:</strong> ${item.best_time}</div>
      <p style="margin: 1rem 0; font-size: 0.85rem; color: #555;">${item.description}</p>
      <div class="modal-price">₱${item.price.toFixed(2)}</div>
      <button class="btn-add-cart" onclick="addToCart(${item.id})">Add to Bag</button>
    </div>
  `;
  document.getElementById('productModal').classList.add('active');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
}

function addToCart(id) {
  const item = perfumes.find(p => p.id === id);
  if (item) {
    cart.push(item);
    updateCartUI();
    closeModal();
    openCart();
  }
}

function updateCartUI() {
  document.getElementById('cartCount').innerText = cart.length;
  const list = document.getElementById('cartItems');
  list.innerHTML = '';
  
  let sum = 0;
  cart.forEach((item, index) => {
    sum += item.price;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>₱${item.price.toFixed(2)}</small>
      </div>
      <button onclick="removeItem(${index})" style="border:none;background:none;color:red;cursor:pointer;font-size:1.2rem;">&times;</button>
    `;
    list.appendChild(el);
  });

  document.getElementById('cartTotal').innerText = `₱${sum.toFixed(2)}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function openCart() { document.getElementById('cartDrawer').classList.add('active'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('active'); }

// Live Checkout submission
async function checkout() {
  if (cart.length === 0) return alert('Your bag is currently empty.');
  
  const customerName = prompt('Enter your full name:');
  if (!customerName) return;
  const customerPhone = prompt('Enter contact number:');
  if (!customerPhone) return;
  const address = prompt('Enter delivery address:');
  if (!address) return;

  const orderPayload = {
    customer_name: customerName,
    customer_phone: customerPhone,
    shipping_address: address,
    payment_method: 'Cash on Delivery',
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price })),
    total_amount: cart.reduce((a, c) => a + c.price, 0)
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (res.ok) {
      alert(`Thank you ${customerName}! Your order has been placed with Aurum Parfum.`);
    }
  } catch (err) {
    // Local storage fallback sync
    let localOrders = JSON.parse(localStorage.getItem('aurum_orders') || '[]');
    localOrders.unshift({
      order_id: `AUR-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
      ...orderPayload
    });
    localStorage.setItem('aurum_orders', JSON.stringify(localOrders));
    alert(`Thank you ${customerName}! Your order has been placed.`);
  }

  cart = [];
  updateCartUI();
  closeCart();
}

// Navigation & Category Filters
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    const filterType = e.target.getAttribute('data-filter');
    const val = e.target.getAttribute('data-val');
    
    if (filterType === 'gender') {
      activeFilters.gender = val;
      activeFilters.tag = 'all';
    } else {
      activeFilters.tag = val;
      activeFilters.gender = 'all';
    }
    renderCatalog();
  });
});

document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    activeFilters.scent_family = e.target.getAttribute('data-val');
    renderCatalog();
  });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  activeFilters.search = e.target.value;
  renderCatalog();
});

// Auto-sync polling every 4 seconds to catch new additions by owner
setInterval(fetchCatalog, 4000);
window.addEventListener('DOMContentLoaded', fetchCatalog);