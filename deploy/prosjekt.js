// Produktdatabase
const productDatabase = {
    kjokken: [
        // Budsjett
        { id: 1, name: 'Kjøkkenskap basis hvit', store: 'Jula', price: 8000, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        { id: 2, name: 'Benkeplate laminat 3m', store: 'Biltema', price: 1500, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 3, name: 'Kjøkkenvask rustfritt stål', store: 'Biltema', price: 800, product_url: 'https://www.biltema.no/bygg/vvs/kjokkenutstyr/', quality_level: 'budsjett' },
        { id: 4, name: 'Kjøkkenkran enkel', store: 'Biltema', price: 500, product_url: 'https://www.biltema.no/bygg/vvs/kjokkenutstyr/', quality_level: 'budsjett' },
        // Standard
        { id: 5, name: 'IKEA KNOXHULT Kjøkken', store: 'IKEA', price: 15000, product_url: 'https://www.ikea.com/no/no/p/knoxhult-kjoekken-hvit-s59186078/', quality_level: 'standard' },
        { id: 6, name: 'Benkeplate eik 3m', store: 'Byggmakker', price: 3500, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        { id: 7, name: 'Kjøkkenvask dobbel', store: 'IKEA', price: 2000, product_url: 'https://www.ikea.com/no/no/', quality_level: 'standard' },
        { id: 8, name: 'Kjøkkenkran uttrekkbar', store: 'Byggmakker', price: 1500, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        // Premium
        { id: 9, name: 'IKEA METOD Kjøkken komplett', store: 'IKEA', price: 35000, product_url: 'https://www.ikea.com/no/no/', quality_level: 'premium' },
        { id: 10, name: 'Benkeplate granitt 3m', store: 'Byggmakker', price: 8500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 11, name: 'Kjøkkenvask kompositt premium', store: 'Byggmakker', price: 4500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 12, name: 'Kjøkkenkran profesjonell', store: 'Byggmakker', price: 3500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
    ],
    bad: [
        // Budsjett
        { id: 13, name: 'Dusjkabinett enkel 80x80', store: 'Biltema', price: 2500, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 14, name: 'Toalett standard', store: 'Jula', price: 1500, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        { id: 15, name: 'Servant enkel hvit', store: 'Biltema', price: 800, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 16, name: 'Baderomsflis hvit 10m²', store: 'Jula', price: 2500, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        // Standard
        { id: 17, name: 'Dusjkabinett 90x90', store: 'Byggmakker', price: 4500, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        { id: 18, name: 'Toalett komplett', store: 'IKEA', price: 2500, product_url: 'https://www.ikea.com/no/no/cat/toaletter-20719/', quality_level: 'standard' },
        { id: 19, name: 'Servant med skap', store: 'IKEA', price: 3000, product_url: 'https://www.ikea.com/no/no/cat/servant-og-servantskap-20726/', quality_level: 'standard' },
        { id: 20, name: 'Baderomsflis mønster 10m²', store: 'Byggmakker', price: 5000, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        // Premium
        { id: 21, name: 'Dusjkabinett luksus 100x100', store: 'Byggmakker', price: 8500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 22, name: 'Toalett vegghengt smart', store: 'Byggmakker', price: 6500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 23, name: 'Servant dobbel med speil', store: 'IKEA', price: 7500, product_url: 'https://www.ikea.com/no/no/', quality_level: 'premium' },
        { id: 24, name: 'Baderomsflis marmor 10m²', store: 'Byggmakker', price: 12000, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
    ],
    gulv: [
        // Budsjett
        { id: 25, name: 'Laminat grå 20m²', store: 'Jula', price: 3500, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        { id: 26, name: 'Gulvlist plast 40m', store: 'Biltema', price: 600, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 27, name: 'Underlagsmatte enkel 20m²', store: 'Jula', price: 500, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        // Standard
        { id: 28, name: 'Laminat eik 20m²', store: 'Byggmakker', price: 6000, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        { id: 29, name: 'Gulvlist tre 40m', store: 'Byggmakker', price: 1200, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        { id: 30, name: 'Underlagsmatte lyd 20m²', store: 'Byggmakker', price: 1200, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        // Premium
        { id: 31, name: 'Parkett ask massiv 20m²', store: 'Byggmakker', price: 15000, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 32, name: 'Gulvlist eik massiv 40m', store: 'Byggmakker', price: 2500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 33, name: 'Underlagsmatte premium 20m²', store: 'Byggmakker', price: 2000, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
    ],
    maling: [
        // Budsjett
        { id: 34, name: 'Veggmaling hvit basis 10L', store: 'Biltema', price: 500, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 35, name: 'Takmaling enkel 10L', store: 'Biltema', price: 450, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 36, name: 'Malerruller basis', store: 'Biltema', price: 150, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        // Standard
        { id: 37, name: 'Veggmaling hvit 10L', store: 'Jula', price: 800, product_url: 'https://www.jula.no/', quality_level: 'standard' },
        { id: 38, name: 'Takmaling 10L', store: 'Jula', price: 700, product_url: 'https://www.jula.no/', quality_level: 'standard' },
        { id: 39, name: 'Malerruller profesjonell', store: 'Byggmakker', price: 400, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        // Premium
        { id: 40, name: 'Veggmaling premium 10L', store: 'Byggmakker', price: 1500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 41, name: 'Takmaling anti-kondens 10L', store: 'Byggmakker', price: 1200, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 42, name: 'Malerruller premium sett', store: 'Byggmakker', price: 800, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
    ],
    belysning: [
        // Budsjett
        { id: 43, name: 'LED-taklampe enkel', store: 'Biltema', price: 400, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 44, name: 'Spotlights 4-pack basis', store: 'Jula', price: 600, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        { id: 45, name: 'LED-pærer E27 5-pack', store: 'Biltema', price: 200, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        // Standard
        { id: 46, name: 'LED-taklampe moderne', store: 'IKEA', price: 800, product_url: 'https://www.ikea.com/no/no/cat/taklamper-10731/', quality_level: 'standard' },
        { id: 47, name: 'Spotlights 6-pack', store: 'Elektroimportøren', price: 1200, product_url: 'https://www.elektroimportoeren.no/', quality_level: 'standard' },
        { id: 48, name: 'Vegglampe 2-pack', store: 'IKEA', price: 600, product_url: 'https://www.ikea.com/no/no/cat/vegglamper-10732/', quality_level: 'standard' },
        // Premium
        { id: 49, name: 'LED-taklampe designer', store: 'IKEA', price: 2500, product_url: 'https://www.ikea.com/no/no/', quality_level: 'premium' },
        { id: 50, name: 'Spotlights smart 8-pack', store: 'Elektroimportøren', price: 3500, product_url: 'https://www.elektroimportoeren.no/', quality_level: 'premium' },
        { id: 51, name: 'Vegglampe premium 4-pack', store: 'Elektroimportøren', price: 2000, product_url: 'https://www.elektroimportoeren.no/', quality_level: 'premium' },
    ],
    vinduer: [
        // Budsjett
        { id: 52, name: 'Vindu 2-lags 100x100', store: 'Jula', price: 2500, product_url: 'https://www.jula.no/', quality_level: 'budsjett' },
        { id: 53, name: 'Vinduskarm enkel', store: 'Biltema', price: 400, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        { id: 54, name: 'Tetningsmasse 5-pack', store: 'Biltema', price: 300, product_url: 'https://www.biltema.no/', quality_level: 'budsjett' },
        // Standard
        { id: 55, name: 'Vindu 3-lags 120x120', store: 'Byggmakker', price: 4500, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        { id: 56, name: 'Vindu 3-lags 100x100', store: 'Byggmakker', price: 3800, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        { id: 57, name: 'Vinduskarm komplett', store: 'Byggmakker', price: 800, product_url: 'https://www.byggmakker.no/', quality_level: 'standard' },
        // Premium
        { id: 58, name: 'Vindu 3-lags energi 140x140', store: 'Byggmakker', price: 8500, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 59, name: 'Vinduskarm aluminium', store: 'Byggmakker', price: 2000, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
        { id: 60, name: 'Tetningsmasse premium 10-pack', store: 'Byggmakker', price: 1200, product_url: 'https://www.byggmakker.no/', quality_level: 'premium' },
    ],
};

// State
let currentCategory = '';
let currentBudget = 0;
let currentQuality = 'standard'; // Default kvalitet
let shoppingCart = [];
let currentProjectId = null;
let currentUser = null;

// Vent på at supabaseClient er klar
function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.supabaseClient) {
            resolve(window.supabaseClient);
        } else {
            const checkInterval = setInterval(() => {
                if (window.supabaseClient) {
                    clearInterval(checkInterval);
                    resolve(window.supabaseClient);
                }
            }, 50);
        }
    });
}

// Hent URL parametere
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('kategori'),
        budget: parseInt(params.get('budsjett')) || 0,
        quality: params.get('kvalitet') || 'standard'
    };
}

// Initialiser side
async function initPage() {
    // Sjekk autentisering
    currentUser = await checkAuth();

    const params = getUrlParams();
    currentCategory = params.category;
    currentBudget = params.budget;
    currentQuality = params.quality;

    // Oppdater header
    updateHeader();

    // Initialiser kvalitetsfilter
    initQualityFilter();

    // Last produkter fra database
    await loadProductsFromDatabase();

    // Oppdater budsjett
    updateBudget();

    // Hvis bruker er innlogget, opprett/last prosjekt
    if (currentUser) {
        await createOrLoadProject();
    }
}

// Initialiser kvalitetsfilter
function initQualityFilter() {
    const filterBtns = document.querySelectorAll('.quality-filter-btn');

    // Sett aktiv knapp basert på currentQuality
    filterBtns.forEach(btn => {
        if (btn.dataset.quality === currentQuality) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            currentQuality = btn.dataset.quality;

            // Oppdater aktiv knapp
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Last produkter på nytt med nytt filter
            loadProducts();
        });
    });
}

// Oppdater header
function updateHeader() {
    const categoryNames = {
        kjokken: 'Kjøkken',
        bad: 'Bad',
        gulv: 'Gulv',
        maling: 'Maling',
        belysning: 'Belysning',
        vinduer: 'Vinduer'
    };
    
    document.getElementById('categoryName').textContent = categoryNames[currentCategory] || 'Ukjent';
    document.getElementById('budgetAmount').textContent = formatPrice(currentBudget);
    document.getElementById('projectTitle').textContent = `Ditt ${categoryNames[currentCategory]}-prosjekt`;
}

// Last produkter fra database
async function loadProductsFromDatabase() {
    try {
        await waitForSupabase();
        const { data: allProducts, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('category', currentCategory);

        if (error) throw error;

        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        if (allProducts && allProducts.length > 0) {
            // Filtrer produkter basert på kvalitetsnivå
            const products = allProducts.filter(product =>
                product.quality_level === currentQuality
            );

            if (products.length === 0) {
                productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Ingen produkter funnet for dette kvalitetsnivået.</p>';
                return;
            }

            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        } else {
            // Fallback til lokal database hvis ingen produkter i Supabase
            loadProducts();
        }
    } catch (error) {
        console.error('Feil ved lasting av produkter:', error);
        // Fallback til lokal database
        loadProducts();
    }
}

// Last produkter (fallback)
function loadProducts() {
    const allProducts = productDatabase[currentCategory] || [];

    // Filtrer produkter basert på kvalitetsnivå
    const products = allProducts.filter(product =>
        product.quality_level === currentQuality
    );

    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Ingen produkter funnet for dette kvalitetsnivået.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Rens produktnavn for søk - fjern dimensjoner, volum, og spesifikke detaljer
function cleanProductNameForSearch(productName) {
    let cleanName = productName;

    // Fjern dimensjoner (f.eks. 80x80, 90x90, 120x60, osv.)
    cleanName = cleanName.replace(/\d+x\d+(\s*cm)?/gi, '');

    // Fjern volum/kapasitet (f.eks. 5L, 10 liter, 2,5L, osv.)
    cleanName = cleanName.replace(/\d+[,.]?\d*\s*(L|liter|ml|milliliter)/gi, '');

    // Fjern høyde/bredde/dybde mål (f.eks. 180cm, 2m, 50 cm, osv.)
    cleanName = cleanName.replace(/\d+[,.]?\d*\s*(cm|m|mm|meter|centimeter|millimeter)/gi, '');

    // Fjern beskrivende ord som ofte ikke finnes i butikk-søk
    const wordsToRemove = [
        'enkel', 'dobbel', 'trippel', 'basis', 'standard', 'premium',
        'budsjett', 'luksus', 'komplett', 'sett', 'pakke'
    ];

    wordsToRemove.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        cleanName = cleanName.replace(regex, '');
    });

    // Fjern ekstra mellomrom
    cleanName = cleanName.replace(/\s+/g, ' ').trim();

    return cleanName;
}

// Generer søke-URL for butikk
function generateStoreSearchUrl(productName, storeName) {
    // Rens produktnavnet før søk
    const cleanedName = cleanProductNameForSearch(productName);
    const searchTerm = encodeURIComponent(cleanedName);

    // Butikk-spesifikke søke-URLer
    const storeSearchUrls = {
        'IKEA': `https://www.ikea.com/no/no/search/?q=${searchTerm}`,
        'Byggmakker': `https://www.byggmakker.no/search?query=${searchTerm}`,
        'Biltema': `https://www.biltema.no/search/?query=${searchTerm}`,
        'Jula': `https://www.jula.no/catalog/bygg-og-verktoy/search/?text=${searchTerm}`,
        'Elektroimportøren': `https://www.elektroimportoeren.no/search?query=${searchTerm}`
    };

    return storeSearchUrls[storeName] || `https://www.google.com/search?q=${searchTerm}+${encodeURIComponent(storeName)}`;
}

// Opprett produktkort
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const isInCart = shoppingCart.some(item => item.id === product.id);

    // Bruk product_url hvis den finnes, ellers generer automatisk søke-URL
    let productUrl = product.product_url;
    if (!productUrl || productUrl === '#' || productUrl.endsWith('/')) {
        // Automatisk søk på butikkens nettside
        productUrl = generateStoreSearchUrl(product.name, product.store);
    }

    // Kvalitetsbadge
    const qualityBadges = {
        'budsjett': '<span class="quality-badge budget">Budsjett</span>',
        'standard': '<span class="quality-badge standard">Standard</span>',
        'premium': '<span class="quality-badge premium">Premium</span>'
    };
    const qualityBadge = qualityBadges[product.quality_level] || '';

    card.innerHTML = `
        <div class="product-header-badge">
            ${qualityBadge}
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-store">${product.store}</p>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-actions">
            <button class="btn-add ${isInCart ? 'added' : ''}" onclick="toggleProduct(${product.id})">
                ${isInCart ? '✓ I handleliste' : '+ Handleliste'}
            </button>
            <a href="${productUrl}" target="_blank" rel="noopener noreferrer" class="btn-view-product" title="Søk etter ${product.name} på ${product.store}">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        </div>
    `;

    return card;
}

// Toggle produkt i handlekurv
async function toggleProduct(productId) {
    // Finn produkt (sjekk først i shoppingCart, deretter i productDatabase)
    let product = shoppingCart.find(p => p.id === productId);

    if (!product) {
        const products = productDatabase[currentCategory] || [];
        product = products.find(p => p.id === productId);
    }

    if (!product) return;

    const index = shoppingCart.findIndex(item => item.id === productId);

    if (index > -1) {
        shoppingCart.splice(index, 1);
        // Fjern fra database hvis bruker er innlogget
        if (currentUser && currentProjectId) {
            await removeProductFromDatabase(productId);
        }
    } else {
        shoppingCart.push(product);
        // Lagre til database hvis bruker er innlogget
        if (currentUser && currentProjectId) {
            await saveProductToDatabase(productId);
        }
    }

    // Oppdater bare knappene i produktkortene, ikke reload hele produktlisten
    updateProductButtons();
    updateShoppingList();
    updateBudget();
}

// Oppdater produktknapper uten å reloade hele listen
function updateProductButtons() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const button = card.querySelector('.btn-add');
        if (!button) return;

        // Hent produkt-ID fra onclick-attributtet
        const onclickAttr = button.getAttribute('onclick');
        const productId = parseInt(onclickAttr.match(/\d+/)[0]);

        const isInCart = shoppingCart.some(item => item.id === productId);

        if (isInCart) {
            button.classList.add('added');
            button.textContent = '✓ I handleliste';
        } else {
            button.classList.remove('added');
            button.textContent = '+ Handleliste';
        }
    });
}

// Oppdater handleliste
function updateShoppingList() {
    const listContainer = document.getElementById('shoppingList');

    if (shoppingCart.length === 0) {
        listContainer.innerHTML = '<p class="empty-message">Legg til produkter for å se din handleliste</p>';
        return;
    }

    listContainer.innerHTML = '';

    shoppingCart.forEach(product => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';

        listItem.innerHTML = `
            <div class="list-item-info">
                <div class="list-item-name">${product.icon} ${product.name}</div>
                <div class="list-item-store">${product.store}</div>
            </div>
            <div class="list-item-price">${formatPrice(product.price)}</div>
            <button class="btn-remove" onclick="toggleProduct(${product.id})">Fjern</button>
        `;

        listContainer.appendChild(listItem);
    });
}

// Oppdater budsjett
function updateBudget() {
    const total = shoppingCart.reduce((sum, item) => sum + item.price, 0);
    const remaining = currentBudget - total;
    const percentage = Math.min((total / currentBudget) * 100, 100);

    document.getElementById('totalBudget').textContent = formatPrice(currentBudget);
    document.getElementById('usedBudget').textContent = formatPrice(total);
    document.getElementById('remainingBudget').textContent = formatPrice(remaining);
    document.getElementById('listTotal').textContent = formatPrice(total);

    const budgetBar = document.getElementById('budgetUsed');
    budgetBar.style.width = percentage + '%';

    // Endre farge basert på budsjett
    if (percentage > 100) {
        budgetBar.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
    } else if (percentage > 80) {
        budgetBar.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';
    } else {
        budgetBar.style.background = 'linear-gradient(to right, #10b981, #059669)';
    }
}

// Formater pris
function formatPrice(price) {
    return new Intl.NumberFormat('no-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Opprett eller last prosjekt
async function createOrLoadProject() {
    if (!currentUser) return;

    try {
        await waitForSupabase();
        // Sjekk om det finnes et eksisterende prosjekt
        const { data: existingProjects, error: fetchError } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('category', currentCategory)
            .order('created_at', { ascending: false })
            .limit(1);

        if (fetchError) throw fetchError;

        if (existingProjects && existingProjects.length > 0) {
            // Last eksisterende prosjekt
            currentProjectId = existingProjects[0].id;
            await loadShoppingList();
        } else {
            // Opprett nytt prosjekt
            const categoryNames = {
                kjokken: 'Kjøkken',
                bad: 'Bad',
                gulv: 'Gulv',
                maling: 'Maling',
                belysning: 'Belysning',
                vinduer: 'Vinduer'
            };

            const { data: newProject, error: createError } = await supabaseClient
                .from('projects')
                .insert([
                    {
                        user_id: currentUser.id,
                        name: `${categoryNames[currentCategory]}-prosjekt`,
                        category: currentCategory,
                        budget: currentBudget
                    }
                ])
                .select()
                .single();

            if (createError) throw createError;
            currentProjectId = newProject.id;
        }
    } catch (error) {
        console.error('Feil ved oppretting/lasting av prosjekt:', error);
    }
}

// Last handleliste fra database
async function loadShoppingList() {
    if (!currentProjectId) return;

    try {
        await waitForSupabase();
        const { data: items, error } = await supabaseClient
            .from('shopping_list_items')
            .select(`
                *,
                products (*)
            `)
            .eq('project_id', currentProjectId);

        if (error) throw error;

        if (items && items.length > 0) {
            shoppingCart = items.map(item => item.products);
            updateShoppingList();
            updateBudget();
            await loadProductsFromDatabase(); // Reload for å oppdatere knapper
        }
    } catch (error) {
        console.error('Feil ved lasting av handleliste:', error);
    }
}

// Lagre produkt til database
async function saveProductToDatabase(productId) {
    if (!currentUser || !currentProjectId) return;

    try {
        await waitForSupabase();
        const { error } = await supabaseClient
            .from('shopping_list_items')
            .insert([
                {
                    project_id: currentProjectId,
                    product_id: productId,
                    quantity: 1
                }
            ]);

        if (error) throw error;
    } catch (error) {
        console.error('Feil ved lagring av produkt:', error);
    }
}

// Fjern produkt fra database
async function removeProductFromDatabase(productId) {
    if (!currentUser || !currentProjectId) return;

    try {
        await waitForSupabase();
        const { error } = await supabaseClient
            .from('shopping_list_items')
            .delete()
            .eq('project_id', currentProjectId)
            .eq('product_id', productId);

        if (error) throw error;
    } catch (error) {
        console.error('Feil ved fjerning av produkt:', error);
    }
}

// Initialiser når siden lastes
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

