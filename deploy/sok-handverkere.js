// ============================================
// SØK HÅNDVERKERE - BOLIGPROSJEKT
// ============================================

// Mock data for testing (skal erstattes med API-kall)
const mockCraftsmen = [
    {
        id: 1,
        company_name: 'Oslo Rørlegger AS',
        profession: 'plumber',
        description: 'Erfaren rørlegger med 15 års erfaring. Spesialiserer meg på bad og kjøkken.',
        location: 'Oslo',
        rating: 4.8,
        total_reviews: 24,
        subscription_tier: 'pro_plus', // pro_plus, pro, basic
        service_areas: ['Oslo', 'Bærum', 'Asker'],
        certifications: ['Autorisert rørlegger', 'Fagbrev']
    },
    {
        id: 2,
        company_name: 'Elektro Ekspert',
        profession: 'electrician',
        description: 'Autorisert elektriker. Utfører alle typer elektriske installasjoner.',
        location: 'Oslo',
        rating: 4.6,
        total_reviews: 18,
        subscription_tier: 'pro',
        service_areas: ['Oslo', 'Lillestrøm'],
        certifications: ['Autorisert elektriker']
    },
    {
        id: 3,
        company_name: 'Snekker Service',
        profession: 'carpenter',
        description: 'Kvalitetssnekker med fokus på detaljer. Spesialist på innredning.',
        location: 'Oslo',
        rating: 4.9,
        total_reviews: 31,
        subscription_tier: 'basic',
        service_areas: ['Oslo'],
        certifications: ['Fagbrev snekker']
    }
];

// Søk håndverkere
async function searchCraftsmen() {
    const profession = document.getElementById('professionFilter').value;
    const location = document.getElementById('locationSearch').value;

    console.log('Søker håndverkere:', { profession, location });

    // TODO: Erstatt med ekte API-kall
    // const response = await fetch(`/api/craftsmen/search?profession=${profession}&location=${location}`);
    // const craftsmen = await response.json();

    // For nå bruker vi mock data
    let craftsmen = [...mockCraftsmen];

    // Filtrer basert på søk
    if (profession) {
        craftsmen = craftsmen.filter(c => c.profession === profession);
    }
    if (location) {
        craftsmen = craftsmen.filter(c => 
            c.location.toLowerCase().includes(location.toLowerCase()) ||
            c.service_areas.some(area => area.toLowerCase().includes(location.toLowerCase()))
        );
    }

    // Sorter basert på abonnementsnivå (Pro+ først, deretter Pro, deretter Basic)
    craftsmen.sort((a, b) => {
        const tierOrder = { 'pro_plus': 3, 'pro': 2, 'basic': 1 };
        return tierOrder[b.subscription_tier] - tierOrder[a.subscription_tier];
    });

    displayCraftsmen(craftsmen);
}

// Vis håndverkere
function displayCraftsmen(craftsmen) {
    const grid = document.getElementById('craftsmenGrid');
    
    if (craftsmen.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 64px; color: #64748b;">
                <h2>Ingen håndverkere funnet</h2>
                <p>Prøv å justere søket ditt</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = craftsmen.map(craftsman => `
        <div class="craftsman-card ${craftsman.subscription_tier === 'pro_plus' || craftsman.subscription_tier === 'pro' ? 'premium' : ''}">
            <div class="craftsman-header">
                <div class="craftsman-avatar">
                    ${craftsman.company_name.charAt(0)}
                </div>
                <div class="craftsman-info">
                    <h3>${craftsman.company_name}</h3>
                    <div class="craftsman-profession">${getProfessionName(craftsman.profession)}</div>
                    <div class="craftsman-rating">
                        ⭐ ${craftsman.rating} (${craftsman.total_reviews} anmeldelser)
                    </div>
                </div>
            </div>
            <div class="craftsman-description">
                ${craftsman.description}
            </div>
            <div class="craftsman-meta">
                <span class="meta-tag">📍 ${craftsman.location}</span>
                ${craftsman.certifications.map(cert => `<span class="meta-tag">✓ ${cert}</span>`).join('')}
            </div>
            <div class="craftsman-actions">
                <button class="btn-contact-craftsman" onclick="contactCraftsman(${craftsman.id})">
                    Kontakt
                </button>
            </div>
        </div>
    `).join('');
}

// Hent profesjonsnavn på norsk
function getProfessionName(profession) {
    const names = {
        'plumber': 'Rørlegger',
        'electrician': 'Elektriker',
        'carpenter': 'Snekker',
        'painter': 'Maler',
        'tiler': 'Flislegger',
        'general': 'Generell håndverker'
    };
    return names[profession] || profession;
}

// Kontakt håndverker
function contactCraftsman(craftsmanId) {
    // TODO: Sjekk brukerens abonnement først
    // Kun Premium og Pro kunder kan kontakte håndverkere
    
    console.log('Kontakter håndverker:', craftsmanId);
    alert('Kontaktfunksjon kommer snart! Dette vil åpne en chat eller sende en forespørsel.');
}

// Last inn håndverkere ved sideinnlasting
window.addEventListener('DOMContentLoaded', () => {
    searchCraftsmen();
});

