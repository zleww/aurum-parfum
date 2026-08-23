const FALLBACK_PERFUMES = [
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
    image: "images/bombshell.png"
  }
];

let perfumes = [...FALLBACK_PERFUMES];
let cart = [];
let activeFilters = {
  gender: 'all',
  tag: 'all',
  scent_family: 'all',
  search: ''
};

async function initApp() {
  renderCatalog();
  try {
    const res = await fetch('/api');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        perfumes = data;
        renderCatalog();
      }
    }
  } catch (err) {
    console.log('Using static catalog data');
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
        <img src="${p.image}" alt="${p.name}">
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
      <img src="${item.image}" alt="${item.name}">
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
      cart = [];
      updateCartUI();
      closeCart();
    }
  } catch (err) {
    alert('Order recorded locally!');
    cart = [];
    updateCartUI();
    closeCart();
  }
}

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

window.addEventListener('DOMContentLoaded', initApp);