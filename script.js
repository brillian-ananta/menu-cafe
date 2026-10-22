
/* ==========================================
   SMARTMENU - DIGITAL CAFE MENU
   HTML + CSS + JavaScript
   Tanpa database / backend
========================================== */

/* 1. DATA MENU
   Ganti nama, harga, deskripsi, dan gambar
   sesuai menu kafe yang sebenarnya.

   Gambar lokal disimpan di folder images/.
*/

const menu = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    category: "Makanan",
    price: 25000,
    description: "Nasi goreng gurih dengan telur, sayuran, dan pelengkap pilihan.",
    image: "nasi-goreng-spesial.jpg",
    available: true,
    bestSeller: true
  },
  {
    id: 2,
    name: "Chicken Katsu",
    category: "Makanan",
    price: 28000,
    description: "Ayam renyah dengan nasi hangat dan saus spesial.",
    image: "images/chicken-katsu.jpg",
    available: true,
    bestSeller: true
  },
  {
    id: 3,
    name: "Mie Goreng",
    category: "Makanan",
    price: 22000,
    description: "Mie goreng dengan bumbu pilihan dan sayuran segar.",
    image: "images/mie-goreng.jpg",
    available: true,
    bestSeller: false
  },
  {
    id: 4,
    name: "Kentang Goreng",
    category: "Camilan",
    price: 15000,
    description: "Kentang goreng renyah yang cocok untuk teman santai.",
    image: "images/kentang-goreng.jpg",
    available: true,
    bestSeller: true
  },
  {
    id: 5,
    name: "Roti Bakar Cokelat",
    category: "Camilan",
    price: 18000,
    description: "Roti panggang hangat dengan isian cokelat manis.",
    image: "images/roti-bakar.jpg",
    available: true,
    bestSeller: false
  },
  {
    id: 6,
    name: "Es Teh Manis",
    category: "Minuman",
    price: 8000,
    description: "Teh manis dingin yang menyegarkan.",
    image: "images/es-teh.jpg",
    available: true,
    bestSeller: false
  },
  {
    id: 7,
    name: "Matcha Latte",
    category: "Minuman",
    price: 22000,
    description: "Perpaduan matcha dan susu dengan rasa lembut.",
    image: "images/matcha-latte.jpg",
    available: true,
    bestSeller: true
  },
  {
    id: 8,
    name: "Es Kopi Susu",
    category: "Kopi",
    price: 18000,
    description: "Kopi, susu, dan es dengan rasa seimbang.",
    image: "images/es-kopi-susu.jpg",
    available: true,
    bestSeller: true
  },
  {
    id: 9,
    name: "Americano",
    category: "Kopi",
    price: 16000,
    description: "Espresso dengan air, cocok untuk pecinta kopi klasik.",
    image: "images/americano.jpg",
    available: true,
    bestSeller: false
  },
  {
    id: 10,
    name: "Cappuccino",
    category: "Kopi",
    price: 20000,
    description: "Espresso dengan susu dan busa susu lembut.",
    image: "images/cappuccino.jpg",
    available: true,
    bestSeller: false
  }
];


/* 2. AMBIL ELEMEN HTML */

const menuContainer = document.getElementById("menuContainer");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryList = document.getElementById("categoryList");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

const menuDialog = document.getElementById("menuDialog");
const dialogImage = document.getElementById("dialogImage");
const dialogCategory = document.getElementById("dialogCategory");
const dialogTitle = document.getElementById("dialogTitle");
const dialogPrice = document.getElementById("dialogPrice");
const dialogDescription = document.getElementById("dialogDescription");
const dialogAvailability = document.getElementById("dialogAvailability");
const closeDialog = document.getElementById("closeDialog");

const currentYear = document.getElementById("currentYear");


/* 3. STATE */

let selectedCategory = "Semua";
let searchKeyword = "";
let activeMenuId = null;

const FAVORITES_KEY = "smartmenu-favorites-v1";

let favoriteIds = loadFavorites();


/* 4. FORMAT HARGA */

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

function formatPrice(price) {
  return rupiah.format(price);
}


/* 5. HELPER DOM YANG AMAN */

function createElement(tag, className, text = "") {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== "") {
    element.textContent = text;
  }

  return element;
}


/* 6. FAVORIT DISIMPAN DI BROWSER */

function loadFavorites() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "[]"
    );

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved.filter(
      id => Number.isInteger(id) &&
      menu.some(item => item.id === id)
    );
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favoriteIds)
    );
  } catch (error) {
    console.warn("Favorit tidak dapat disimpan di browser.");
  }
}

function isFavorite(menuId) {
  return favoriteIds.includes(menuId);
}

function toggleFavorite(menuId) {
  if (isFavorite(menuId)) {
    favoriteIds = favoriteIds.filter(id => id !== menuId);
  } else {
    favoriteIds.push(menuId);
  }

  saveFavorites();
  renderMenu();
}


/* 7. MEMUAT FOTO MENU */

function setMenuImage(imageElement, menuItem) {
  imageElement.alt = menuItem.name;
  imageElement.loading = "lazy";

  imageElement.addEventListener("error", function handleImageError() {
    const placeholder = createElement(
      "div",
      "image-placeholder",
      "Foto belum tersedia"
    );

    placeholder.setAttribute("role", "img");
    placeholder.setAttribute(
      "aria-label",
      "Foto " + menuItem.name + " belum tersedia"
    );

    imageElement.replaceWith(placeholder);
  }, { once: true });

  imageElement.src = menuItem.image;
}


/* 8. MEMBUAT KARTU MENU */

function createMenuCard(menuItem) {
  const card = createElement("article", "menu-card");

  if (!menuItem.available) {
    card.classList.add("is-unavailable");
  }

  // Bagian gambar
  const imageWrapper = createElement("div", "menu-image-wrapper");

  const image = createElement("img", "menu-image");
  setMenuImage(image, menuItem);

  imageWrapper.appendChild(image);

  const categoryBadge = createElement(
    "span",
    "menu-category",
    menuItem.category
  );

  imageWrapper.appendChild(categoryBadge);

  // Label best seller
  if (menuItem.bestSeller) {
    const bestSellerBadge = createElement(
      "span",
      "best-seller-badge",
      "★ Best Seller"
    );

    imageWrapper.appendChild(bestSellerBadge);
  }

  // Tombol favorit
  const favoriteButton = createElement(
    "button",
    "favorite-button",
    isFavorite(menuItem.id) ? "♥" : "♡"
  );

  favoriteButton.type = "button";
  favoriteButton.setAttribute(
    "aria-label",
    isFavorite(menuItem.id)
      ? "Hapus " + menuItem.name + " dari favorit"
      : "Tambahkan " + menuItem.name + " ke favorit"
  );

  favoriteButton.setAttribute(
    "aria-pressed",
    String(isFavorite(menuItem.id))
  );

  favoriteButton.addEventListener("click", function () {
    toggleFavorite(menuItem.id);
  });

  imageWrapper.appendChild(favoriteButton);
  card.appendChild(imageWrapper);

  // Bagian isi kartu
  const content = createElement("div", "menu-card-content");

  const name = createElement("h3", "menu-name", menuItem.name);
  content.appendChild(name);

  const description = createElement(
    "p",
    "menu-description",
    menuItem.description
  );

  content.appendChild(description);

  if (!menuItem.available) {
    const unavailableBadge = createElement(
      "span",
      "menu-badge-unavailable",
      "Stok habis"
    );

    content.appendChild(unavailableBadge);
  }

  const price = createElement(
    "p",
    "menu-price",
    formatPrice(menuItem.price)
  );

  content.appendChild(price);

  const detailButton = createElement(
    "button",
    "menu-detail-button",
    "Lihat Detail →"
  );

  detailButton.type = "button";
  detailButton.addEventListener("click", function () {
    openMenuDetail(menuItem);
  });

  content.appendChild(detailButton);
  card.appendChild(content);

  return card;
}


/* 9. FILTER DAN PENCARIAN */

function getFilteredMenus() {
  const keyword = searchKeyword.trim().toLocaleLowerCase("id-ID");

  return menu.filter(function (item) {
    const matchesCategory =
      selectedCategory === "Semua" ||
      item.category === selectedCategory;

    const searchableText = [
      item.name,
      item.category,
      item.description
    ].join(" ").toLocaleLowerCase("id-ID");

    const matchesSearch = searchableText.includes(keyword);

    return matchesCategory && matchesSearch;
  });
}


/* 10. RENDER DAFTAR MENU */

function renderMenu() {
  if (!menuContainer) return;

  const filteredMenus = getFilteredMenus();

  menuContainer.replaceChildren();

  filteredMenus.forEach(function (item) {
    menuContainer.appendChild(createMenuCard(item));
  });

  if (resultCount) {
    resultCount.textContent =
      "Menampilkan " + filteredMenus.length +
      " dari " + menu.length + " menu";
  }

  if (emptyState) {
    emptyState.hidden = filteredMenus.length > 0;
  }
}


/* 11. EVENT PENCARIAN */

if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchKeyword = searchInput.value;
    renderMenu();
  });
}

if (clearSearch) {
  clearSearch.addEventListener("click", function () {
    if (searchInput) {
      searchInput.value = "";
      searchKeyword = "";
      searchInput.focus();
    }

    renderMenu();
  });
}


/* 12. EVENT FILTER KATEGORI */

if (categoryList) {
  categoryList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");

    if (!button || !categoryList.contains(button)) {
      return;
    }

    selectedCategory = button.dataset.category || "Semua";

    categoryList.querySelectorAll("[data-category]").forEach(
      function (categoryButton) {
        const isActive =
          categoryButton.dataset.category === selectedCategory;

        categoryButton.classList.toggle("active", isActive);
        categoryButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      }
    );

    renderMenu();
  });
}


/* 13. DETAIL MENU */

function openMenuDetail(menuItem) {
  if (!menuDialog) return;

  activeMenuId = menuItem.id;

  dialogCategory.textContent = menuItem.category;
  dialogTitle.textContent = menuItem.name;
  dialogPrice.textContent = formatPrice(menuItem.price);
  dialogDescription.textContent = menuItem.description;

  dialogAvailability.textContent = menuItem.available
    ? "✓ Tersedia"
    : "✕ Stok sedang habis";

  dialogAvailability.style.color = menuItem.available
    ? "#247b4b"
    : "#b13e30";

  // Bersihkan foto lama dan listener error sebelumnya.
  // Gunakan elemen gambar baru agar detail menu tidak
  // mengumpulkan listener berulang.
  const newImage = document.createElement("img");

  newImage.id = "dialogImage";
  newImage.className = "dialog-image";
  newImage.alt = menuItem.name;
  newImage.loading = "lazy";

  newImage.addEventListener("error", function () {
    newImage.alt = "Foto " + menuItem.name + " tidak tersedia";
    newImage.removeAttribute("src");
    newImage.classList.add("image-placeholder");
  }, { once: true });

  if (dialogImage && dialogImage.parentNode) {
    dialogImage.replaceWith(newImage);
  }

  // Perbarui referensi gambar yang digunakan selanjutnya.
  // Referensi variabel const dialogImage di atas tidak bisa
  // ditimpa, jadi gunakan ID untuk mencari gambar terbaru.
  newImage.src = menuItem.image;

  if (typeof menuDialog.showModal === "function") {
    menuDialog.showModal();
  } else {
    menuDialog.setAttribute("open", "");
  }
}

function closeMenuDetail() {
  if (!menuDialog) return;

  if (typeof menuDialog.close === "function" && menuDialog.open) {
    menuDialog.close();
  } else {
    menuDialog.removeAttribute("open");
  }

  activeMenuId = null;
}

if (closeDialog) {
  closeDialog.addEventListener("click", closeMenuDetail);
}

if (menuDialog) {
  menuDialog.addEventListener("click", function (event) {
    if (event.target === menuDialog) {
      closeMenuDetail();
    }
  });

  menuDialog.addEventListener("close", function () {
    activeMenuId = null;
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && menuDialog && menuDialog.open) {
    closeMenuDetail();
  }
});


/* 14. TAHUN OTOMATIS DI FOOTER */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* 15. MULAI WEBSITE */

renderMenu();
