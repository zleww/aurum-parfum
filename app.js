// Replace this with your new Vercel deployment URL once deployed
const API_URL = "https://aurum-parfum.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  loadAllPerfumes();
});

// Fetch all perfumes
async function loadAllPerfumes() {
  setTitle("Curated Fragrance Collection");
  try {
    const res = await fetch(`${API_URL}/perfumes`);
    const data = await res.json();
    displayPerfumes(data);
  } catch (err) {
    console.error("API error:", err);
    document.getElementById("perfumeGrid").innerHTML = "<p style='grid-column:1/-1;text-align:center;'>Unable to load scents from API. Please verify backend deployment.</p>";
  }
}

// Search perfumes
async function searchPerfumes() {
  const query = document.getElementById("searchInput").value;
  if (!query) return loadAllPerfumes();
  
  setTitle(`Search Results for "${query}"`);
  try {
    const res = await fetch(`${API_URL}/perfumes/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayPerfumes(data);
  } catch (err) {
    console.error("Search error:", err);
  }
}

// Filter by Scent Family
async function filterByCategory(category, elem) {
  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  if (elem) elem.classList.add("active");

  setTitle(category === "all" ? "Curated Fragrance Collection" : `${category} Fragrance Family`);
  try {
    const res = await fetch(`${API_URL}/perfumes?category=${category}`);
    const data = await res.json();
    displayPerfumes(data);
  } catch (err) {
    console.error(err);
  }
}

// Filter by Tag
async function filterByTag(tag) {
  setTitle(`${tag} Fragrances`);
  try {
    const res = await fetch(`${API_URL}/perfumes?tag=${encodeURIComponent(tag)}`);
    const data = await res.json();
    displayPerfumes(data);
  } catch (err) {
    console.error(err);
  }
}

// Filter by Gender
async function filterByGender(gender) {
  setTitle(`Scents for ${gender}`);
  try {
    const res = await fetch(`${API_URL}/perfumes?gender=${gender}`);
    const data = await res.json();
    displayPerfumes(data);
  } catch (err) {
    console.error(err);
  }
}

// Render cards
function displayPerfumes(list) {
  const grid = document.getElementById("perfumeGrid");
  grid.innerHTML = "";

  if (!list || list.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-muted);'>No fragrance matches found.</p>";
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-media">
        <span class="card-badge">${p.tag}</span>
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600'" />
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span>${p.code}</span>
          <span>${p.gender} · ${p.category}</span>
        </div>
        <h4>${p.name}</h4>
        <div class="price-row">
          <span class="price">₱${p.price}</span>
          <span class="promo-tag">· 2 for ₱450</span>
        </div>
        <p class="card-desc">${p.short_desc}</p>
        <button class="btn-card-details" onclick="openDetail('${p.id}')">Fragrance Notes</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Open Detail Modal
async function openDetail(id) {
  try {
    const res = await fetch(`${API_URL}/perfumes/${id}`);
    const p = await res.json();

    const profileHtml = Object.entries(p.scent_profile).map(([key, val]) => `
      <div class="scent-bar-item">
        <div style="display:flex; justify-content:space-between;">
          <span>${key}</span>
          <span>${val}%</span>
        </div>
        <div class="track-bg"><div class="fill-gold" style="width: ${val}%"></div></div>
      </div>
    `).join("");

    document.getElementById("modalContent").innerHTML = `
      <div>
        <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius:3px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600'" />
      </div>
      <div>
        <span style="font-size:0.75rem; letter-spacing:2px; color:var(--gold-dark); text-transform:uppercase;">${p.code} · ${p.gender} · EAU DE PARFUM</span>
        <h3 style="font-family:'Cinzel',serif; font-size:2rem; margin:6px 0;">${p.name}</h3>
        <p style="font-size:1.1rem; font-weight:600; margin-bottom:12px;">₱${p.price} <span style="font-size:0.8rem; color:var(--gold-dark); font-weight:400;">(Buy 2 for ₱450)</span></p>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">${p.short_desc}</p>
        
        <div class="notes-container">
          <p><strong>🍋 Top Notes:</strong> ${p.top_notes.join(", ")}</p>
          <p><strong>🌹 Heart Notes:</strong> ${p.heart_notes.join(", ")}</p>
          <p><strong>🪵 Base Notes:</strong> ${p.base_notes.join(", ")}</p>
        </div>

        <div style="font-size: 0.8rem; line-height: 1.7; margin-bottom: 15px; color: var(--text-dark);">
          <p><strong>Occasion:</strong> ${p.best_occasion}</p>
          <p><strong>Season:</strong> ${p.best_season}</p>
          <p><strong>Performance:</strong> ${p.longevity} · ${p.projection} Projection</p>
        </div>

        <h5 style="font-size:0.78rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Scent Accords</h5>
        ${profileHtml}
      </div>
    `;

    document.getElementById("detailModal").classList.remove("hidden");
  } catch (err) {
    console.error(err);
  }
}

function closeModal() {
  document.getElementById("detailModal").classList.add("hidden");
}

// Fragrance Quiz
function openQuiz() {
  document.getElementById("quizModal").classList.remove("hidden");
}

function closeQuiz() {
  document.getElementById("quizModal").classList.add("hidden");
}

async function submitQuiz() {
  const category = document.getElementById("quizScent").value;
  closeQuiz();
  await filterByCategory(category);
}

function setTitle(text) {
  document.getElementById("currentCategoryTitle").innerText = text;
}