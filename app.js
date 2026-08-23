let perfumes = [];
let cart = [];
let activeFilters = {
  gender: 'all',
  tag: 'all',
  scent_family: 'all',
  search: ''
};

// Fetch Perfume Data from Backend API (Fallback to local if loading offline)
async function initApp() {
  try {
    const res = await fetch('/api');
    perfumes = await res.json();
  } catch (err) {
    console.warn('Backend endpoint unavailable, loading local fallback dataset...');
  }
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  const filtered = perfumes.filter(p => {
    const matchGender = activeFilters.gender === 'all' || p.gender === activeFilters.gender;
    const matchTag = activeFilters.tag === 'all' || p.tag === activeFilters.tag;
    const matchFamily = activeFilters.scent_family === 'all' || p.scent_family === activeFilters.scent_family;
    const query = activeFilters.search.toLowerCase();
    const matchSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.notes.toLowerCase().includes(query) ||
      p.scent_family.toLowerCase().includes(query);

    return matchGender && matchTag && matchFamily && matchSearch;
  });

  document.getElementById('matchCount').innerText = `Showing ${filtered.length} fragrances`;

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openProductModal(p.id);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <span class="badge">${p.gender}</span>
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/200x300/F4EEE5/3E3229?text=Aurum'">
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

// Tom Ford-style Modal View
function openProductModal(id) {
  const item = perfumes.find(p => p.id === id);
  if (!item) return;

  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="modal-img-col">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/300x400/F4EEE5/3E3229?text=Bottle'">
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

// Cart Drawer Operations
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
        <small>₱${item.price}</small>
      </div>
      <button onclick="removeItem(${index})" style="border:none;background:none;color:red;cursor:pointer;">&times;</button>
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

function checkout() {
  if (cart.length === 0) return alert('Your bag is currently empty.');
  alert(`Thank you for choosing Aurum Parfum! Your total is ₱${cart.reduce((a,c) => a + c.price, 0)}.`);
  cart = [];
  updateCartUI();
  closeCart();
}

// Filter Listeners
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

// Run Init
window.onload = initApp;