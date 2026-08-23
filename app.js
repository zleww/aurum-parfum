const CORE_INITIAL_CATALOG = [
  {
    id: 1,
    name: "Dior Sauvage",
    gender: "Men",
    scent_family: "Fresh",
    tag: "Best Seller",
    notes: "Calabrian Bergamot, Sichuan Pepper, Ambroxan",
    best_time: "Night Out / Versatile Daily",
    description: "Radically fresh, raw, and magnetic with crisp citrus and intense ambery woods.",
    price: 250,
    stock: 30,
    image: "images/dior-sauvage.png"
  },
  {
    id: 2,
    name: "Versace Eros",
    gender: "Men",
    scent_family: "Sweet",
    tag: "Best Seller",
    notes: "Mint Leaves, Green Apple, Tonka Bean, Vanilla",
    best_time: "Party / Evening / Fall",
    description: "A luminous aura with an intense, vibrant, and glowing combination of fresh mint and sweet vanilla.",
    price: 250,
    stock: 25,
    image: "images/versace-eros.png"
  },
  {
    id: 3,
    name: "Lacoste Black",
    gender: "Men",
    scent_family: "Woody",
    tag: "New Arrivals",
    notes: "Watermelon, Basil, Lavender, Dark Chocolate",
    best_time: "Casual Days / Warm Evenings",
    description: "An intense, refreshing contrast that blends aqueous watermelon with an unexpected dark chocolate finish.",
    price: 250,
    stock: 20,
    image: "images/lacoste-black.png"
  },
  {
    id: 4,
    name: "Bvlgari Extreme",
    gender: "Men",
    scent_family: "Fresh",
    tag: "Sale",
    notes: "Darjeeling Tea, Bergamot, Cardamom, Guaiac Wood",
    best_time: "Office / Formal / Summer",
    description: "Understated refinement expressing classic masculine elegance with woody tea nuances.",
    price: 250,
    stock: 15,
    image: "images/bvlgari-extreme.png"
  },
  {
    id: 5,
    name: "CK One",
    gender: "Unisex",
    scent_family: "Fresh",
    tag: "Best Seller",
    notes: "Green Tea, Papaya, Bergamot, Jasmine, Musk",
    best_time: "Everyday Casual / Morning",
    description: "The universally clean, iconic citrus harmony designed for effortless daily wear.",
    price: 250,
    stock: 40,
    image: "images/ck-one.png"
  },
  {
    id: 6,
    name: "Valaya",
    gender: "Unisex",
    scent_family: "Floral",
    tag: "New Arrivals",
    notes: "White Peach, Aldehydes, Orange Blossom, Ambroxan",
    best_time: "Signature Daily / Spring",
    description: "An ethereal sensation of soft white cotton, radiant clean florals, and subtle musks.",
    price: 250,
    stock: 18,
    image: "images/valaya.png"
  },
  {
    id: 7,
    name: "Ariana Grande Cloud",
    gender: "Women",
    scent_family: "Sweet",
    tag: "Best Seller",
    notes: "Lavender Blossom, Coconut Cream, Praline, Vanilla",
    best_time: "Cool Weather / Date Night",
    description: "An uplifting, dreamy scent imbued with decadent praline and airy whipped cream.",
    price: 250,
    stock: 35,
    image: "images/cloud.png"
  },
  {
    id: 8,
    name: "Chanel Chance",
    gender: "Women",
    scent_family: "Floral",
    tag: "Best Seller",
    notes: "Pink Pepper, Jasmine, Patchouli, Amber Musk",
    best_time: "Daytime Professional / High Tea",
    description: "An unpredictable, sparkling floral constellation wrapped in soft spiced elegance.",
    price: 250,
    stock: 22,
    image: "images/chanel-chance.png"
  },
  {
    id: 9,
    name: "Incanto Shine",
    gender: "Women",
    scent_family: "Fruity",
    tag: "Sale",
    notes: "Pineapple, Passionfruit, Freesia, White Cedar",
    best_time: "Summer / Outings / Casual",
    description: "A dazzling tropical fantasy rich with ripe passionfruit and cheerful sunny blooms.",
    price: 250,
    stock: 12,
    image: "images/incanto-shine.png"
  },
  {
    id: 10,
    name: "Bombshell",
    gender: "Women",
    scent_family: "Fruity",
    tag: "New Arrivals",
    notes: "Purple Passion Fruit, Shangri-la Peony, Vanilla Orchid",
    best_time: "Afternoon / Casual Glam",
    description: "A vibrant blend of fresh-cut peonies and exotic sun-drenched fruits.",
    price: 250,
    stock: 28,
    image: "images/bombshell.png"
  }
];

let perfumes = [];
let cart = [];
let activeFilters = {
  gender: 'all',
  tag: 'all',
  scent_family: 'all',
  search: ''
};
let selectedQty = 1;

function getSharedCatalog() {
  const stored = localStorage.getItem('aurum_master_catalog');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('aurum_master_catalog', JSON.stringify(CORE_INITIAL_CATALOG));
  return CORE_INITIAL_CATALOG;
}

function saveSharedCatalog(catalog) {
  localStorage.setItem('aurum_master_catalog', JSON.stringify(catalog));
}

function syncStore() {
  perfumes = getSharedCatalog();
  renderCatalog();
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
    const isOutOfStock = (p.stock || 0) <= 0;
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openProductModal(p.id);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <span class="badge">${p.gender}</span>
        ${isOutOfStock ? '<span class="out-stock-badge">Sold Out</span>' : ''}
        <img src="${p.image}" alt="${p.name}" onerror="this.src='images/dior-sauvage.png'">
      </div>
      <div class="card-info">
        <span class="card-tag">${p.scent_family} • ${p.tag}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-stock" style="font-size:0.75rem; color:#888;">${isOutOfStock ? 'Out of Stock' : `${p.stock} bottles left`}</p>
        <p class="card-price">₱${p.price.toFixed(2)}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openProductModal(id) {
  const item = perfumes.find(p => p.id === id);
  if (!item) return;

  selectedQty = 1;
  const isOutOfStock = (item.stock || 0) <= 0;

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
      <div class="detail-row"><strong>Availability:</strong> ${isOutOfStock ? '<span style="color:red;font-weight:600;">Out of Stock</span>' : `<span style="color:green;font-weight:600;">${item.stock} in stock</span>`}</div>
      <p style="margin: 1rem 0; font-size: 0.85rem; color: #555;">${item.description}</p>
      <div class="modal-price">₱${item.price.toFixed(2)}</div>
      
      ${!isOutOfStock ? `
        <div class="qty-selector">
          <span style="font-size:0.8rem; text-transform:uppercase; font-weight:600;">Quantity:</span>
          <div class="qty-controls">
            <button type="button" class="btn-qty" onclick="changeModalQty(-1, ${item.stock})">-</button>
            <span id="modalQtyDisplay" class="qty-display">1</span>
            <button type="button" class="btn-qty" onclick="changeModalQty(1, ${item.stock})">+</button>
          </div>
        </div>
        <button class="btn-add-cart" onclick="addToCart(${item.id})">Add to Bag</button>
      ` : `
        <button class="btn-add-cart" style="background:#999; cursor:not-allowed;" disabled>Currently Sold Out</button>
      `}
    </div>
  `;
  document.getElementById('productModal').classList.add('active');
}

function changeModalQty(delta, maxStock) {
  selectedQty += delta;
  if (selectedQty < 1) selectedQty = 1;
  if (selectedQty > maxStock) {
    selectedQty = maxStock;
    alert(`Only ${maxStock} bottles currently in stock.`);
  }
  document.getElementById('modalQtyDisplay').innerText = selectedQty;
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
}

function addToCart(id) {
  const item = perfumes.find(p => p.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  const currentInCart = existing ? existing.quantity : 0;

  if (currentInCart + selectedQty > item.stock) {
    return alert(`Sorry, we only have ${item.stock} units available.`);
  }

  if (existing) {
    existing.quantity += selectedQty;
  } else {
    cart.push({ ...item, quantity: selectedQty });
  }

  updateCartUI();
  closeModal();
  openCart();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').innerText = totalCount;
  
  const list = document.getElementById('cartItems');
  list.innerHTML = '';
  
  let sum = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    sum += itemTotal;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div style="flex:1;">
        <strong>${item.name}</strong><br>
        <small>₱${item.price.toFixed(2)} × ${item.quantity} = ₱${itemTotal.toFixed(2)}</small>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <button onclick="modifyCartQty(${index}, -1)" class="btn-cart-qty">-</button>
        <span style="font-size:0.85rem; font-weight:600;">${item.quantity}</span>
        <button onclick="modifyCartQty(${index}, 1)" class="btn-cart-qty">+</button>
        <button onclick="removeCartItem(${index})" style="border:none;background:none;color:red;cursor:pointer;font-size:1.1rem;margin-left:6px;">&times;</button>
      </div>
    `;
    list.appendChild(el);
  });

  document.getElementById('cartTotal').innerText = `₱${sum.toFixed(2)}`;
}

function modifyCartQty(index, delta) {
  const item = cart[index];
  const catalogItem = perfumes.find(p => p.id === item.id);
  const maxStock = catalogItem ? catalogItem.stock : 999;

  item.quantity += delta;
  if (item.quantity > maxStock) {
    item.quantity = maxStock;
    alert(`Only ${maxStock} units left in stock.`);
  }
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function openCart() { document.getElementById('cartDrawer').classList.add('active'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('active'); }

async function checkout() {
  if (cart.length === 0) return alert('Your bag is currently empty.');
  
  const customerName = prompt('Enter your full name:');
  if (!customerName) return;
  const customerPhone = prompt('Enter contact number:');
  if (!customerPhone) return;
  const address = prompt('Enter delivery address:');
  if (!address) return;

  const totalAmount = cart.reduce((a, c) => a + (c.price * c.quantity), 0);
  const orderPayload = {
    order_id: `AUR-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Pending',
    customer_name: customerName,
    customer_phone: customerPhone,
    shipping_address: address,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    total_amount: totalAmount
  };

  // Deduct inventory stock
  let catalog = getSharedCatalog();
  cart.forEach(cartItem => {
    const found = catalog.find(p => p.id === cartItem.id);
    if (found) {
      found.stock = Math.max(0, (found.stock || 0) - cartItem.quantity);
    }
  });
  saveSharedCatalog(catalog);

  // Store new order
  let orders = JSON.parse(localStorage.getItem('aurum_orders') || '[]');
  orders.unshift(orderPayload);
  localStorage.setItem('aurum_orders', JSON.stringify(orders));

  alert(`Thank you ${customerName}! Your order for ${cart.reduce((s, i) => s + i.quantity, 0)} bottles totaling ₱${totalAmount.toFixed(2)} has been placed.`);
  cart = [];
  updateCartUI();
  closeCart();
  syncStore();
}

// Filters
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

// Real-time synchronization
setInterval(syncStore, 2000);
window.addEventListener('DOMContentLoaded', syncStore);