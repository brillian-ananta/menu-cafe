
"use strict";

/* =========================================
   1. DATA MENU SMARTMENU
   ========================================= */

/*
  Semua data menu disimpan dalam array JavaScript.
  Tidak membutuhkan database atau backend.

  Cara menambah menu:
  - Salin salah satu objek menu.
  - Ganti id, nama, kategori, harga, deskripsi, dan gambar.
  - Gunakan id yang berbeda untuk setiap menu.
  - Pastikan kategori sesuai dengan tombol filter di HTML.
  - Pastikan nama file gambar sesuai dengan folder images.
*/

const menu = [
    {
        id: 1,
        name: "Nasi Goreng Spesial",
        category: "Makanan",
        price: 25000,
        description: "Nasi goreng dengan telur, sayuran, dan bumbu khas cafe.",
        image: "images/nasi-goreng.jpg",
        available: true
    },
    {
        id: 2,
        name: "Chicken Katsu",
        category: "Makanan",
        price: 28000,
        description: "Ayam katsu renyah dengan saus spesial dan nasi hangat.",
        image: "images/chicken-katsu.jpg",
        available: true
    },
    {
        id: 3,
        name: "Mie Goreng",
        category: "Makanan",
        price: 20000,
        description: "Mie goreng dengan sayuran dan bumbu gurih.",
        image: "images/mie-goreng.jpg",
        available: true
    },
    {
        id: 4,
        name: "Kentang Goreng",
        category: "Camilan",
        price: 15000,
        description: "Kentang goreng renyah yang cocok untuk teman nongkrong.",
        image: "images/kentang-goreng.jpg",
        available: true
    },
    {
        id: 5,
        name: "Roti Bakar Cokelat",
        category: "Camilan",
        price: 16000,
        description: "Roti bakar dengan isian cokelat manis.",
        image: "images/roti-bakar.jpg",
        available: false
    },
    {
        id: 6,
        name: "Es Teh Manis",
        category: "Minuman",
        price: 8000,
        description: "Teh manis dingin yang menyegarkan.",
        image: "images/es-teh.jpg",
        available: true
    },
    {
        id: 7,
        name: "Matcha Latte",
        category: "Minuman",
        price: 22000,
        description: "Minuman matcha dengan susu yang lembut.",
        image: "images/matcha-latte.jpg",
        available: true
    },
    {
        id: 8,
        name: "Es Kopi Susu",
        category: "Kopi",
        price: 18000,
        description: "Perpaduan kopi, susu, dan gula aren.",
        image: "images/es-kopi-susu.jpg",
        available: true
    },
    {
        id: 9,
        name: "Americano",
        category: "Kopi",
        price: 15000,
        description: "Kopi dengan rasa khas yang disajikan dingin atau panas.",
        image: "images/americano.jpg",
        available: true
    },
    {
        id: 10,
        name: "Cappuccino",
        category: "Kopi",
        price: 20000,
        description: "Espresso dengan susu dan lapisan busa lembut.",
        image: "images/cappuccino.jpg",
        available: false
    }
];


/* =========================================
   2. MENGAMBIL ELEMEN DARI HTML
   ========================================= */

/*
  JavaScript menggunakan ID berikut untuk
  mengakses bagian-bagian yang ada di index.html.
*/

const menuContainer = document.getElementById("menuContainer");
const searchInput = document.getElementById("searchInput");
const clearSearchButton = document.getElementById("clearSearch");
const categoryList = document.getElementById("categoryList");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

// Elemen untuk jendela detail menu
const menuDialog = document.getElementById("menuDialog");
const closeDialogButton = document.getElementById("closeDialog");
const dialogImage = document.getElementById("dialogImage");
const dialogCategory = document.getElementById("dialogCategory");
const dialogTitle = document.getElementById("dialogTitle");
const dialogPrice = document.getElementById("dialogPrice");
const dialogDescription = document.getElementById("dialogDescription");
const dialogAvailability = document.getElementById("dialogAvailability");

// Elemen tahun pada footer
const currentYear = document.getElementById("currentYear");


/* =========================================
   3. VARIABEL FILTER
   ========================================= */

/*
  selectedCategory menyimpan kategori yang dipilih.
  searchKeyword menyimpan kata pencarian pengguna.

  Nilai awal:
  - Kategori: Semua
  - Pencarian: kosong
*/

let selectedCategory = "Semua";
let searchKeyword = "";


/* =========================================
   4. FORMAT HARGA RUPIAH
   ========================================= */

/*
  Mengubah angka, misalnya 18000,
  menjadi format Rp18.000.
*/

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
});

function formatRupiah(harga) {
    return rupiahFormatter.format(harga);
}


/* =========================================
   5. MEMBUAT ELEMEN HTML DENGAN AMAN
   ========================================= */

/*
  Fungsi ini membuat elemen HTML dan mengisi
  teksnya melalui textContent.

  Cara ini menghindari memasukkan teks data menu
  langsung sebagai kode HTML.
*/

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


/* =========================================
   6. MENAMPILKAN GAMBAR MENU
   ========================================= */

/*
  Foto disimpan secara lokal di folder images.
  Jika file foto tidak ditemukan, tampilkan pesan
  alternatif agar gambar rusak tidak terus muncul.
*/

function setMenuImage(imageElement, menuItem) {
    imageElement.alt = "Foto " + menuItem.name;
    imageElement.src = menuItem.image;

    imageElement.addEventListener("error", function () {
        // Hapus sumber gambar yang gagal dimuat.
        imageElement.removeAttribute("src");

        // Beri informasi bahwa foto belum tersedia.
        imageElement.alt = "Foto " + menuItem.name + " belum tersedia";
        imageElement.classList.add("image-placeholder");
    }, { once: true });
}


/* =========================================
   7. MEMBUAT KARTU MENU
   ========================================= */

/*
  Fungsi ini membuat satu kartu untuk setiap produk.

  Isi kartu:
  - Foto menu
  - Nama produk
  - Kategori
  - Deskripsi
  - Harga
  - Status ketersediaan
  - Tombol detail
*/

function createMenuCard(menuItem) {
    // Pembungkus kartu.
    const card = createElement("article", "menu-card");

    // Area gambar.
    const imageWrapper = createElement(
        "div",
        "menu-image-wrapper"
    );

    const image = createElement("img", "menu-image");

    // Memuat foto produk.
    setMenuImage(image, menuItem);

    imageWrapper.appendChild(image);

    // Tambahkan label jika menu habis.
    if (!menuItem.available) {
        card.classList.add("is-unavailable");

        const badge = createElement(
            "span",
            "menu-badge-unavailable",
            "Habis"
        );

        imageWrapper.appendChild(badge);
    }

    // Area isi kartu.
    const content = createElement(
        "div",
        "menu-card-content"
    );

    const category = createElement(
        "span",
        "menu-category",
        menuItem.category
    );

    const name = createElement(
        "h3",
        "menu-name",
        menuItem.name
    );

    const description = createElement(
        "p",
        "menu-description",
        menuItem.description
    );

    const price = createElement(
        "p",
        "menu-price",
        formatRupiah(menuItem.price)
    );

    // Tombol membuka detail menu.
    const detailButton = createElement(
        "button",
        "menu-detail-button",
        "Lihat Detail"
    );

    detailButton.type = "button";

    detailButton.addEventListener("click", function () {
        openMenuDetail(menuItem);
    });

    // Susun seluruh isi kartu.
    content.append(
        category,
        name,
        description,
        price,
        detailButton
    );

    card.append(imageWrapper, content);

    return card;
}


/* =========================================
   8. MENYARING DATA MENU
   ========================================= */

/*
  Menu ditampilkan sesuai dua kondisi:
  1. Kategori yang dipilih.
  2. Kata pencarian yang dimasukkan.

  Pencarian memeriksa nama, kategori,
  dan deskripsi menu.
*/

function getFilteredMenus() {
    return menu.filter(function (menuItem) {
        const matchesCategory =
            selectedCategory === "Semua" ||
            menuItem.category === selectedCategory;

        const searchableText = [
            menuItem.name,
            menuItem.category,
            menuItem.description
        ].join(" ").toLocaleLowerCase("id-ID");

        const matchesSearch =
            searchableText.includes(searchKeyword);

        return matchesCategory && matchesSearch;
    });
}


/* =========================================
   9. MENAMPILKAN SEMUA KARTU MENU
   ========================================= */

/*
  Fungsi utama untuk memperbarui daftar menu.

  Fungsi ini dipanggil saat:
  - Website pertama kali dibuka.
  - Pengguna mengetik pencarian.
  - Pengguna memilih kategori.
*/

function renderMenu() {
    // Ambil data yang sesuai dengan filter.
    const filteredMenus = getFilteredMenus();

    // Kosongkan daftar kartu sebelumnya.
    menuContainer.replaceChildren();

    // Buat kartu untuk setiap menu yang cocok.
    filteredMenus.forEach(function (menuItem) {
        const card = createMenuCard(menuItem);

        menuContainer.appendChild(card);
    });

    // Perbarui informasi jumlah hasil.
    resultCount.textContent =
        "Menampilkan " + filteredMenus.length +
        " dari " + menu.length + " menu";

    // Tampilkan pesan jika tidak ada hasil.
    emptyState.hidden = filteredMenus.length !== 0;
}


/* =========================================
   10. FITUR PENCARIAN MENU
   ========================================= */

/*
  Setiap kali pengguna mengetik,
  kata pencarian diperbarui dan menu dirender ulang.
*/

searchInput.addEventListener("input", function () {
    searchKeyword = searchInput.value
        .trim()
        .toLocaleLowerCase("id-ID");

    renderMenu();
});


/* =========================================
   11. TOMBOL HAPUS PENCARIAN
   ========================================= */

/*
  Menghapus teks pencarian dan menampilkan
  kembali menu berdasarkan kategori terpilih.
*/

clearSearchButton.addEventListener("click", function () {
    searchInput.value = "";
    searchKeyword = "";

    renderMenu();

    searchInput.focus();
});


/* =========================================
   12. FILTER KATEGORI
   ========================================= */

/*
  Ketika tombol kategori diklik:
  - Simpan kategori yang dipilih.
  - Perbarui tampilan aktif tombol.
  - Perbarui atribut aksesibilitas.
  - Tampilkan menu yang sesuai.
*/

categoryList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");

    // Abaikan klik yang bukan tombol kategori.
    if (!button || !categoryList.contains(button)) {
        return;
    }

    selectedCategory = button.dataset.category;

    // Perbarui status tombol kategori.
    const categoryButtons =
        categoryList.querySelectorAll("[data-category]");

    categoryButtons.forEach(function (categoryButton) {
        const isActive =
            categoryButton.dataset.category === selectedCategory;

        categoryButton.classList.toggle("active", isActive);

        categoryButton.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });

    // Perbarui kartu menu.
    renderMenu();
});


/* =========================================
   13. MEMBUKA DETAIL MENU
   ========================================= */

/*
  Ketika tombol "Lihat Detail" ditekan,
  informasi produk dimasukkan ke dialog HTML.
*/

function openMenuDetail(menuItem) {
    // Isi gambar.
    setMenuImage(dialogImage, menuItem);

    // Isi kategori, nama, harga, dan deskripsi.
    dialogCategory.textContent = menuItem.category;
    dialogTitle.textContent = menuItem.name;
    dialogPrice.textContent = formatRupiah(menuItem.price);
    dialogDescription.textContent = menuItem.description;

    // Tampilkan status ketersediaan.
    if (menuItem.available) {
        dialogAvailability.textContent = "Tersedia";
        dialogAvailability.style.color = "var(--success)";
    } else {
        dialogAvailability.textContent = "Maaf, menu sedang habis.";
        dialogAvailability.style.color = "var(--danger)";
    }

    // Buka dialog jika belum terbuka.
    if (!menuDialog.open) {
        menuDialog.showModal();
    }
}


/* =========================================
   14. MENUTUP DETAIL MENU
   ========================================= */

/*
  Tutup dialog ketika tombol silang ditekan.
*/

closeDialogButton.addEventListener("click", function () {
    menuDialog.close();
});


/*
  Tutup dialog ketika pengguna mengeklik
  area gelap di luar kotak dialog.
*/

menuDialog.addEventListener("click", function (event) {
    if (event.target === menuDialog) {
        menuDialog.close();
    }
});


/* =========================================
   15. TAHUN OTOMATIS PADA FOOTER
   ========================================= */

/*
  Tahun akan mengikuti tahun pada perangkat
  sehingga tidak perlu diubah setiap tahun.
*/

currentYear.textContent = new Date().getFullYear();


/* =========================================
   16. MENJALANKAN WEBSITE
   ========================================= */

/*
  Tampilkan menu ketika halaman selesai dibaca.
  Tidak ada permintaan database atau API.
*/

renderMenu();
