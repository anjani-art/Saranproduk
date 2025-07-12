// script.js

// --- 1. Variabel Global Aplikasi & Elemen UI Utama ---
let currentProductCategory = ''; // Untuk menyimpan kategori produk yang sedang aktif

// Data Notes & Transactions (kini bersifat lokal dan sementara)
let notesData = [];
let transactionsData = [];

// Elemen UI Catatan
const addNoteButton = document.getElementById('add-note-button');
const noteTextInput = document.getElementById('note-text');
const pinnedNotesContainer = document.getElementById('pinned-notes-container');
const otherNotesContainer = document.getElementById('other-notes-container');
const emptyPinnedNotesMessage = document.getElementById('empty-pinned-notes-message');
const emptyOtherNotesMessage = document.getElementById('empty-other-notes-message');

// Elemen UI Keuangan Berkelanjutan
const transactionDescriptionInput = document.getElementById('transaction-description');
const transactionAmountInput = document.getElementById('transaction-amount');
const transactionTypeSelect = document.getElementById('transaction-type');
const addTransactionButton = document.getElementById('add-transaction-button');
const transactionListUl = document.getElementById('transaction-list');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const currentBalanceDisplay = document.getElementById('current-balance');

// Elemen UI Produk Go Green
const productCategoriesGrid = document.getElementById('product-categories-grid');
const productListContainer = document.getElementById('product-list-container');
const productListCategoryTitle = document.getElementById('product-list-category-title');
const productDetailContent = document.getElementById('product-detail-content');
const productSearchInput = document.getElementById('product-search-input'); // Input pencarian di halaman kategori produk
const productSearchButton = document.getElementById('product-search-button'); // Tombol pencarian di halaman kategori produk
const productListSearchInput = document.getElementById('product-list-search-input'); // Input pencarian di halaman daftar produk
const productListSearchButton = document.getElementById('product-list-search-button'); // Tombol pencarian di halaman daftar produk


// Elemen UI untuk Quotes
const quoteTextDisplay = document.querySelector('#quote-display .quote-text');
const quoteAuthorDisplay = document.querySelector('#quote-display .quote-author');


// --- Variabel untuk DOM Menu Samping (DEKLARASI GLOBAL) ---
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');


// --- 2. Fungsi Utility Aplikasi ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    const targetPageElement = document.getElementById(pageId + '-page');
    if (targetPageElement) {
        targetPageElement.classList.add('active');
        targetPageElement.style.display = 'block';
        const sideMenu = document.getElementById('side-menu');
        if (sideMenu) {
            sideMenu.classList.remove('active');
        }
    } else {
        console.error(`Page with ID ${pageId}-page not found.`);
    }
}

// --- Quotes untuk Beranda ---
const quotes = [
    { text: "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.", author: "Peter Drucker" },
    { text: "Bumi menyediakan cukup untuk memuaskan setiap kebutuhan manusia, tetapi tidak untuk setiap keserakahan manusia.", author: "Mahatma Gandhi" },
    { text: "Kita tidak mewarisi bumi dari nenek moyang kita, kita meminjamnya dari anak-anak kita.", author: "Pepatah Suku Indian" },
    { text: "Lingkungan adalah tempat kita semua bertemu; tempat kita semua memiliki kepentingan bersama; satu hal yang kita semua berbagi.", author: "Lady Bird Johnson" },
    { text: "Jangan pernah ragu bahwa sekelompok kecil warga negara yang bertekad dapat mengubah dunia. Memang, itu satu-satunya hal yang pernah terjadi.", author: "Margaret Mead" }
];

function displayRandomQuote() {
    if (quoteTextDisplay && quoteAuthorDisplay) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteTextDisplay.textContent = `"${randomQuote.text}"`;
        quoteAuthorDisplay.textContent = `- ${randomQuote.author}`;
    }
}


// --- 3. Fungsi untuk Catatan & Pengingat ---
function addNote() {
    const noteText = noteTextInput.value.trim();
    if (!noteText) {
        alert('Catatan tidak boleh kosong.');
        return;
    }

    const newNote = {
        id: Date.now().toString(), // ID unik berdasarkan timestamp
        text: noteText,
        pinned: false,
        createdAt: new Date().toISOString() // Timestamp ISO
    };

    notesData.push(newNote);
    noteTextInput.value = ''; // Bersihkan input
    renderNotes(); // Render ulang catatan
}

function togglePinNote(noteId) {
    notesData = notesData.map(note =>
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
    );
    renderNotes();
}

function deleteNote(noteId) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

    notesData = notesData.filter(note => note.id !== noteId);
    renderNotes();
}

function renderNotes() {
    if (!pinnedNotesContainer || !otherNotesContainer) return;

    pinnedNotesContainer.innerHTML = '';
    otherNotesContainer.innerHTML = '';

    const pinned = notesData.filter(note => note.pinned);
    const other = notesData.filter(note => !note.pinned);

    if (pinned.length === 0) {
        emptyPinnedNotesMessage.style.display = 'block';
    } else {
        emptyPinnedNotesMessage.style.display = 'none';
        pinned.forEach(note => {
            const noteElement = createNoteElement(note);
            pinnedNotesContainer.appendChild(noteElement);
        });
    }

    if (other.length === 0) {
        emptyOtherNotesMessage.style.display = 'block';
    } else {
        emptyOtherNotesMessage.style.display = 'none';
        other.forEach(note => {
            const noteElement = createNoteElement(note);
            otherNotesContainer.appendChild(noteElement);
        });
    }
}

function createNoteElement(note) {
    const div = document.createElement('div');
    div.classList.add('note-item');
    if (note.pinned) {
        div.classList.add('pinned');
    }
    div.innerHTML = `
        <p class="note-content">${note.text}</p>
        <div class="note-actions">
            <button class="pin-button" data-id="${note.id}" aria-label="Pin/Unpin Note">
                <i class="${note.pinned ? 'fas fa-thumbtack pinned' : 'far fa-thumbtack'}"></i>
            </button>
            <button class="delete-button" data-id="${note.id}" aria-label="Delete Note">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    div.querySelector('.pin-button').addEventListener('click', () => togglePinNote(note.id));
    div.querySelector('.delete-button').addEventListener('click', () => deleteNote(note.id));
    return div;
}


// --- 4. Fungsi untuk Keuangan Berkelanjutan ---
function addTransaction() {
    const description = transactionDescriptionInput.value.trim();
    const amount = parseFloat(transactionAmountInput.value);
    const type = transactionTypeSelect.value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert('Deskripsi dan jumlah harus valid.');
        return;
    }

    const newTransaction = {
        id: Date.now().toString(),
        description,
        amount,
        type,
        createdAt: new Date().toISOString()
    };

    transactionsData.push(newTransaction);
    
    transactionDescriptionInput.value = '';
    transactionAmountInput.value = '';
    transactionTypeSelect.value = 'income';
    
    renderTransactions();
    calculateSummary();
}

function deleteTransaction(transactionId) {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return;

    transactionsData = transactionsData.filter(t => t.id !== transactionId);
    renderTransactions();
    calculateSummary();
}

function renderTransactions() {
    if (!transactionListUl) return;
    transactionListUl.innerHTML = '';
    
    if (transactionsData.length === 0) {
        const li = document.createElement('li');
        li.classList.add('empty-message');
        li.textContent = 'Belum ada transaksi.';
        transactionListUl.appendChild(li);
        return;
    }

    // Urutkan transaksi dari yang terbaru
    const sortedTransactions = [...transactionsData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    sortedTransactions.forEach(t => {
        const li = document.createElement('li');
        li.classList.add('transaction-item', t.type);
        const amountDisplay = t.type === 'expense' ? `- Rp ${t.amount.toLocaleString('id-ID')}` : `+ Rp ${t.amount.toLocaleString('id-ID')}`;
        
        const date = new Date(t.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        li.innerHTML = `
            <div class="transaction-details">
                <h4>${t.description}</h4>
                <p>${formattedDate}</p>
            </div>
            <span class="transaction-amount-display">${amountDisplay}</span>
            <button class="delete-button" data-id="${t.id}" aria-label="Hapus Transaksi">
                <i class="fas fa-trash"></i>
            </button>
        `;
        li.querySelector('.delete-button').addEventListener('click', () => deleteTransaction(t.id));
        transactionListUl.appendChild(li);
    });
}


function calculateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactionsData.forEach(t => {
        if (t.type === 'income') {
            totalIncome += t.amount;
        } else if (t.type === 'expense') {
            totalExpense += t.amount;
        }
    });

    const currentBalance = totalIncome - totalExpense;

    if (totalIncomeDisplay) totalIncomeDisplay.textContent = `Rp ${totalIncome.toLocaleString('id-ID')}`;
    if (totalExpenseDisplay) totalExpenseDisplay.textContent = `Rp ${totalExpense.toLocaleString('id-ID')}`;
    if (currentBalanceDisplay) currentBalanceDisplay.textContent = `Rp ${currentBalance.toLocaleString('id-ID')}`;
}


// --- 5. Fungsi untuk Saran Produk Go Green (Diambil dari script Anda) ---
const greenProductsData = [
    {
        id: 'dpr001',
        category: 'Dapur',
        name: 'Pencuci Piring dan Pembersih Pakaian',
        description: 'Dapat digunakan sebagai cairan deterjen atau sabun lantai biasa untuk: Mengepel lantai dan membersihkan kamar mandi, Mencuci pakaian, Mencuci peralatan masak dan makan',
        bahan_baku: ['Lerak cair'],
        proses_produksi: 'Untu pembuatan pribadi: Cuci bersih lerak. Rebus lerak di atas api kecil selama 2 jam hingga mendidih. Biarkan dingin. Remas-remas lerak hingga berbusa. Angkat lerak dan simpan dalam botol.',
        dampak_lingkungan: 'Serba guna, ramah lingkungan, dan yang pasti zerowaste.',
        diy_tips: 'Cukup cairkan dengan air sebelum digunakan.',
        link_pembelian: 'https://shopee.co.id/Sustaination-Sabun-Pembersih-Alami-Lerak-Cair-Untuk-Cuci-Piring-Pakaian-500-1000-ml-i.82581115.6733269343?sp_atk=0a692b5f-0306-425d-adfe-01bf5d16555c&xptdk=0a692b5f-0306-425d-adfe-01bf5d16555c'
    },
    {
        id: 'dpr002',
        category: 'Dapur',
        name: 'Spons Cuci Piring Loofah',
        description: 'Spons alami dari serat loofah, dapat terurai secara hayati.',
        bahan_baku: ['Serat Loofah alami'],
        proses_produksi: 'Untuk pembuatan pribadi: Siapkan loofah yang sudah kering, lalu rendam dan bersihkan untuk menghilangkan kotoran dan getah. Setelah itu, potong loofah sesuai ukuran yang diinginkan, dan spons alami siap digunakan untuk mencuci piring.',
        dampak_lingkungan: 'Alternatif ramah lingkungan untuk spons plastik, mengurangi mikroplastik.',
        diy_tips: 'Bilas bersih setelah digunakan, keringkan untuk memperpanjang usia, dan ganti secara berkala setiap 2-3 bulan atau jika sudah mulai rusak. ',
        link_pembelian: 'https://shopee.co.id/search?keyword=spons%20cuci%20piring%20loofah'
    },
    {
        id: 'prd001',
        category: 'Perawatan Diri',
        name: 'Pembalut Kain',
        description: 'Pembalut cuci Ulang anti bocor bagi wanita',
        bahan_baku: ['Kain'],
        proses_produksi: 'Cold process, minim energi, buatan tangan.',
        dampak_lingkungan: 'Bebas mikroplastik, kemasan minimalis, biodegradable.',
        diy_tips: 'Untuk mencuci pembalut kain, rendam terlebih dahulu dalam air dingin untuk menghilangkan sebagian besar darah. Kemudian, cuci dengan sabun (disarankan sabun lerak atau sabun bayi) dan sikat noda dengan lembut. Bilas hingga bersih, peras, dan jemur di bawah sinar matahari langsung untuk membunuh bakteri.',
        link_pembelian: 'https://shopee.co.id/search?keyword=pembalut%20kain'
    },
    {
        id: 'prd002',
        category: 'Perawatan Diri',
        name: 'Sikat Gigi Bambu',
        description: 'Sikat gigi dengan gagang bambu yang dapat terurai, bulu sikat dari nylon bebas BPA.',
        bahan_baku: ['Bambu Moso'],
        proses_produksi: 'Gagang bambu dari sumber berkelanjutan.',
        dampak_lingkungan: 'Mengurangi limbah plastik dari sikat gigi konvensional.',
        diy_tips: 'Setelah bulu sikat habis, lepas bulu sikat dan gunakan gagang bambu untuk label tanaman atau kerajinan.',
        link_pembelian: 'https://shopee.co.id/search?keyword=%27sikat%20gigi%20bambu'
    },
    {
        id: 'pkn001',
        category: 'Pakaian',
        name: 'Kaos Polos Katun Bamboo',
        description: 'Kaos yang terbuat dari 2 jenis serat alami yang mampu menahan keringat dan nyaman dipakai.',
        bahan_baku: ['Katun organik', 'Serat Bambu'],
        proses_produksi: 'Jahitan tangan, pewarna alami.',
        dampak_lingkungan: 'Bahan ini ramah lingkungan karena bambu merupakan tanaman yang cepat tumbuh dan tidak memerlukan banyak pestisida atau pupuk kimia dalam proses pertumbuhannya. Selain itu, kain katun bambu juga biodegradable, yang berarti mudah terurai secara alami di lingkungan.',
        diy_tips: 'Gunakan air dingin atau suhu rendah, deterjen yang lembut, dan hindari pengeringan atau penyetrikaan dengan suhu tinggi.',
        link_pembelian: 'https://shopee.co.id/(Lengan-Panjang)-Kaos-Polos-Katun-Bambu-V-Neck-WHYCOTTON-UNISEX-(Cotton-Bamboo-Organic)-i.10678125.366513929?sp_atk=88a4bd51-e3ba-4c1f-a604-f623969fbdf2&xptdk=0a692b51-e3ba-4c1f-a604-f623969fbdf2'
    },
    {
        id: 'kms001',
        category: 'Kemasan',
        name: 'Beeswax Wrap (Pembungkus Makanan)',
        description: 'Alternatif pembungkus plastik yang dapat digunakan kembali, terbuat dari kain katun berlapis beeswax.',
        bahan_baku: ['Kain katun', 'Beeswax'],
        proses_produksi: 'Handmade, tanpa bahan kimia berbahaya.',
        dampak_lingkungan: 'Mengurangi limbah plastik, dapat terurai secara hayati.',
        diy_tips: 'Cuci dengan air dingin dan sabun ringan, keringkan, dan gunakan kembali.',
        link_pembelian: 'https://shopee.co.id/Kantong-Kresek-Singkong-Ramah-Lingkungan-Cassava-T-Shirt-Bag-i.572274212.27106254251?sp_atk=b6255112-eb15-49fe-b004-85ef12d37369&xptdk=b6255112-eb15-49fe-b004-85ef12d37369'
    },
    {
        id: 'kms002',
        category: 'Kemasan',
        name: 'Kantong Singkong',
        description: 'Alternatif pembungkus plastik yang dapat digunakan, terbuat dari bahan organik',
        bahan_baku: ['Pati Singkong'],
        proses_produksi: 'Tanpa bahan kimia berbahaya.',
        dampak_lingkungan: 'Mengurangi limbah plastik, dapat terurai secara hayati.',
        diy_tips: 'Setelah di gunakan baiknya tidak dibuang sembarangan tapi dibuang pada tempatnya dan di urai menggunakan metode kompos rumahan sederhana bersama dengan sampah organik lainnya.',
        link_pembelian: 'https://shopee.co.id/search?keyword=beeswax%20wrap%20food%20grade&trackingId=searchhint-1752293211-a3a94f6f-5ed5-11f0-8c4e-6a23fa4eb7782'
    },
    {
        id: 'mnm001',
        category: 'Kemasan',
        name: 'Botol Minum Stainless Steel',
        description: 'Alternatif pengganti botol minum plastik yang dapat digunakan kembali.',
        bahan_baku: ['Stainless Steel'],
        proses_produksi: 'Tanpa bahan kimia berbahaya.',
        dampak_lingkungan: 'Mengurangi limbah plastik, tahan lama, dan dapat didaur ulang. ',
        diy_tips: 'Cuci dengan sabun yang ramah lingkungan dan berikan baking soda untuk menghilangkan bau atau noda membandel pada botol stainless steel. Hindari penggunaan sabut gosok atau pembersih abrasif yang dapat merusak permukaan botol, keringkan, dan gunakan kembali.',
        link_pembelian: 'https://shopee.co.id/search?keyword=botol%20minum%20stainless%20steel&trackingId=searchhint-1752297527-b037abfd-5edf-11f0-b1e6-1a2646f07927'
    },
    {
        id: 'kebun001',
        category: 'Pertanian & Kebun',
        name: 'Pupuk Organik dari Sekam',
        description: 'Pupuk alami dari sisa-sisa organik sekam padi, menyuburkan tanah tanpa bahan kimia.',
        bahan_baku: ['Sekam padi', 'Sampah Dapur', 'Pupuk Kandang'],
        proses_produksi: 'Untuk pembuatan pribadi: melibatkan pencampuran sekam padi dengan bahan organik seperti sampah dapur, atau pupuk kandang, kemudian difermentasi hingga menjadi kompos yang siap digunakan.',
        dampak_lingkungan: 'Mengurangi limbah organik ke TPA, meningkatkan kesuburan tanah alami.',
        diy_tips: 'Aduk tumpukan kompos setiap beberapa hari untuk memastikan sirkulasi udara dan mencegah bau tidak sedap.',
        link_pembelian: 'https://shopee.co.id/search?keyword=pupuk%20dari%20sekam'
    },
    {
        id: 'kebun002',
        category: 'Pertanian & Kebun',
        name: 'Pupuk Cair dari Eco enzyme',
        description: 'Cairan serbaguna yang dibuat dari fermentasi sampah organik seperti sisa buah dan sayuran, gula, dan air. Cairan ini kaya akan enzim dan memiliki berbagai manfaat, termasuk sebagai pupuk organik, pembersih alami, dan pengendali hama. ',
        bahan_baku: ['Sisa buah dan sayuran', 'gula', 'air'],
        proses_produksi: 'Untuk pembuatan pribadi: campurkan bahan-bahan tersebut dengan perbandingan 1:3:10 (1 bagian gula, 3 bagian sisa buah/sayur, dan 10 bagian air) dalam wadah kedap udara. Fermentasi selama 3 bulan di tempat gelap dan sejuk, buka wadah sesekali untuk mengeluarkan gas. Setelah 3 bulan, eco enzyme siap dipanen dan digunakan.',
        dampak_lingkungan: 'Mengurangi limbah organik ke TPA, meningkatkan kesuburan tanah alami.',
        diy_tips: 'Gunakan gula merah atau molase untuk hasil terbaik. Pastikan sampah organik tidak busuk atau berjamur sebelum digunakan. Jika warna cairan berubah menjadi hitam, tambahkan lebih banyak gula untuk melanjutkan fermentasi.',
        link_pembelian: 'https://shopee.co.id/search?keyword=eco%20enzyme&trackingId=searchhint-1752296853-1ea036af-5ede-11f0-9a91-22986320c11a'
    }
];

const productCategories = [
    { name: 'Dapur', icon: 'fas fa-utensils' },
    { name: 'Perawatan Diri', icon: 'fas fa-spa' },
    { name: 'Pakaian', icon: 'fas fa-tshirt' },
    { name: 'Kemasan', icon: 'fas fa-box' },
    { name: 'Pertanian & Kebun', icon: 'fas fa-seedling' }
];

function renderProductCategories() {
    if (!productCategoriesGrid) return;
    productCategoriesGrid.innerHTML = '';
    productCategories.forEach(category => {
        const card = document.createElement('div');
        card.classList.add('category-card');
        card.dataset.category = category.name;
        card.innerHTML = `
            <i class="${category.icon}"></i>
            <h3>${category.name}</h3>
        `;
        productCategoriesGrid.appendChild(card);

        card.addEventListener('click', () => {
            currentProductCategory = category.name; // Simpan kategori yang dipilih
            // Kosongkan input pencarian kategori saat memilih kategori
            if (productListSearchInput) productListSearchInput.value = '';
            renderProductsByCategory(category.name);
            showPage('product-list');
        });
    });
}

function renderProductsByCategory(categoryName, searchTerm = '') {
    if (!productListContainer || !productListCategoryTitle) return;

    productListContainer.innerHTML = '';
    productListCategoryTitle.textContent = `Produk Kategori: ${categoryName}`;

    let filteredProducts = greenProductsData.filter(p => p.category === categoryName);

    // Terapkan pencarian jika ada searchTerm
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.description.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    if (filteredProducts.length === 0) {
        productListContainer.innerHTML = '<p style="text-align: center; color: var(--text-color-light);">Belum ada produk di kategori ini atau tidak ditemukan.</p>';
    } else {
        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.dataset.id = product.id;
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 80)}...</p>
            `;
            productListContainer.appendChild(productItem);

            productItem.addEventListener('click', () => {
                showProductDetail(product.id);
                showPage('product-detail');
            });
        });
    }
}

function showProductDetail(productId) {
    if (!productDetailContent) return;

    const product = greenProductsData.find(p => p.id === productId);
    if (!product) {
        productDetailContent.innerHTML = '<p style="text-align: center; color: var(--error-color);">Produk tidak ditemukan.</p>';
        return;
    }

    productDetailContent.innerHTML = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>

        <h3>Bahan Baku Utama</h3>
        <ul>
            ${product.bahan_baku.map(b => `<li>${b}</li>`).join('')}
        </ul>

        <h3>Proses Produksi</h3>
        <p>${product.proses_produksi}</p>

        <h3>Dampak Lingkungan</h3>
        <p>${product.dampak_lingkungan}</p>

        <h3>Tips DIY & Penggunaan Berkelanjutan</h3>
        <p>${product.diy_tips}</p>

        <h3>Link Pembelian</h3>
        <p><a href="${product.link_pembelian}" target="_blank" class="product-detail-link">Beli di Shopee</a></p>
    `;
}


// --- 6. Inisialisasi Aplikasi Saat DOM Siap ---
document.addEventListener('DOMContentLoaded', () => {
    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }

    // Pastikan halaman beranda aktif di awal
    showPage('home');
    displayRandomQuote(); // Tampilkan quote saat aplikasi dimulai

    // Event listener untuk tombol tambah catatan
    if (addNoteButton) {
        addNoteButton.addEventListener('click', addNote);
    }
    renderNotes(); // Render catatan awal (kosong)

    // Event listener untuk tombol tambah transaksi
    if (addTransactionButton) {
        addTransactionButton.addEventListener('click', addTransaction);
    }
    renderTransactions(); // Render transaksi awal (kosong)
    calculateSummary(); // Hitung ringkasan awal (kosong)

    // --- Event listener untuk tombol toggle menu samping ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (sideMenu) {
                sideMenu.classList.add('active');
            }
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            if (sideMenu) {
                sideMenu.classList.remove('active');
            }
        });
    }

    // --- Event listener untuk navigasi di menu samping dan kartu ---
    const homeCategoryCards = document.querySelectorAll('#home-page .card');
    document.querySelectorAll('#side-menu ul li a').forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault(); // Mencegah perilaku default link
            const pageId = element.dataset.page;
            if (pageId) {
                showPage(pageId);
                // Tambahan khusus untuk halaman produk jika navigasi langsung
                if (pageId === 'products') {
                    renderProductCategories();
                    if (productSearchInput) productSearchInput.value = ''; // Bersihkan input pencarian utama
                    if (productListSearchInput) productListSearchInput.value = ''; // Bersihkan input pencarian daftar
                }
                // Jika kembali ke halaman home, tampilkan quote baru
                if (pageId === 'home') {
                    displayRandomQuote();
                }
            }
        });
    });

    if (homeCategoryCards) {
        homeCategoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const targetPage = e.currentTarget.dataset.page;
                // Jika card adalah untuk produk, render kategori produk
                if (targetPage === 'products') {
                    renderProductCategories(); // Pastikan kategori produk dirender saat masuk halaman produk
                    if (productSearchInput) productSearchInput.value = ''; // Bersihkan input pencarian utama
                    if (productListSearchInput) productListSearchInput.value = ''; // Bersihkan input pencarian daftar
                }
                showPage(targetPage);
            });
        });
    }

    // --- Event listener untuk tombol kembali (back buttons) ---
    const backButtons = document.querySelectorAll('.back-button');
    if (backButtons) {
        backButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const targetPage = button.dataset.target;
                if (targetPage) {
                    showPage(targetPage);
                    // Logika tambahan jika kembali ke halaman tertentu perlu memuat ulang konten
                    if (targetPage === 'product-list') {
                        renderProductsByCategory(currentProductCategory, productListSearchInput ? productListSearchInput.value.trim() : '');
                    } else if (targetPage === 'products') {
                        renderProductCategories();
                        if (productSearchInput) productSearchInput.value = ''; // Bersihkan input pencarian utama
                        if (productListSearchInput) productListSearchInput.value = ''; // Bersihkan input pencarian daftar
                    } else if (targetPage === 'home') {
                        displayRandomQuote(); // Tampilkan quote baru saat kembali ke home
                    }
                }
            });
        });
    }

    // --- Event listener untuk fitur pencarian produk di halaman kategori produk (products-page) ---
    if (productSearchButton) {
        productSearchButton.addEventListener('click', () => {
            const searchTerm = productSearchInput.value.trim();
            if (searchTerm) {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                const allMatchingProducts = greenProductsData.filter(product =>
                    product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    product.description.toLowerCase().includes(lowerCaseSearchTerm)
                );

                if (productListContainer && productListCategoryTitle) {
                    productListContainer.innerHTML = '';
                    productListCategoryTitle.textContent = `Hasil Pencarian: "${searchTerm}"`;

                    if (allMatchingProducts.length === 0) {
                        productListContainer.innerHTML = '<p style="text-align: center; color: var(--text-color-light);">Tidak ada produk yang ditemukan untuk pencarian ini.</p>';
                    } else {
                        allMatchingProducts.forEach(product => {
                            const productItem = document.createElement('div');
                            productItem.classList.add('product-item');
                            productItem.dataset.id = product.id;
                            productItem.innerHTML = `
                                <h3>${product.name} (${product.category})</h3>
                                <p>${product.description.substring(0, 80)}...</p>
                            `;
                            productListContainer.appendChild(productItem);

                            productItem.addEventListener('click', () => {
                                showProductDetail(product.id);
                                showPage('product-detail');
                            });
                        });
                    }
                }
                showPage('product-list'); // Pindah ke halaman daftar produk untuk menampilkan hasil
            } else {
                renderProductCategories(); // Jika kolom pencarian kosong, render kategori produk seperti biasa
                alert('Silakan masukkan kata kunci pencarian.');
            }
        });
    }

    if (productSearchInput) {
        productSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                productSearchButton.click(); // Picu klik tombol pencarian saat Enter
            }
        });
    }

    // --- Event listener untuk fitur pencarian produk di halaman daftar produk (product-list-page) ---
    if (productListSearchButton) {
        productListSearchButton.addEventListener('click', () => {
            const searchTerm = productListSearchInput.value.trim();
            if (currentProductCategory) { // Pastikan ada kategori yang sedang aktif
                renderProductsByCategory(currentProductCategory, searchTerm);
            } else {
                // Ini akan terjadi jika user langsung ke product-list-page tanpa memilih kategori
                // atau jika ada bug. Seharusnya currentProductCategory selalu terisi.
                alert('Silakan pilih kategori terlebih dahulu.');
            }
        });
    }

    if (productListSearchInput) {
        productListSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                productListSearchButton.click(); // Picu klik tombol pencarian saat Enter
            }
        });
    }


    // Inisialisasi tampilan kategori produk saat halaman dimuat pertama kali
    renderProductCategories();
});
