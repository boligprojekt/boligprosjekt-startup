// ============================================
// HÅNDVERKERPROFIL - BOLIGPROSJEKT
// ============================================

// Mock data for testing
const mockProfile = {
    company_name: 'Oslo Rørlegger AS',
    profession: 'plumber',
    description: 'Erfaren rørlegger med 15 års erfaring.',
    phone: '+47 123 45 678',
    email: 'post@osloror.no',
    location: 'Oslo',
    service_areas: 'Oslo, Bærum, Asker',
    certifications: 'Autorisert rørlegger, Fagbrev',
    website: 'https://www.osloror.no',
    subscription_tier: 'pro', // basic, pro, pro_plus
    stats: {
        total_leads: 12,
        active_projects: 3,
        profile_views: 145,
        rating: 4.8
    }
};

// Last inn profil
function loadProfile() {
    // TODO: Hent fra API
    // const response = await fetch('/api/craftsman/profile');
    // const profile = await response.json();

    const profile = mockProfile;

    // Fyll inn skjema
    document.getElementById('companyName').value = profile.company_name || '';
    document.getElementById('profession').value = profile.profession || '';
    document.getElementById('description').value = profile.description || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('location').value = profile.location || '';
    document.getElementById('serviceAreas').value = profile.service_areas || '';
    document.getElementById('certifications').value = profile.certifications || '';
    document.getElementById('website').value = profile.website || '';

    // Oppdater abonnementsbadge
    updateSubscriptionBadge(profile.subscription_tier);

    // Oppdater statistikk
    document.getElementById('totalLeads').textContent = profile.stats.total_leads;
    document.getElementById('activeProjects').textContent = profile.stats.active_projects;
    document.getElementById('profileViews').textContent = profile.stats.profile_views;
    document.getElementById('rating').textContent = profile.stats.rating.toFixed(1);
}

// Oppdater abonnementsbadge
function updateSubscriptionBadge(tier) {
    const badge = document.getElementById('subscriptionBadge');
    
    const tierNames = {
        'basic': 'Basic Visibility',
        'pro': 'Pro Håndverker',
        'pro_plus': 'Pro+ Håndverker'
    };

    const tierClasses = {
        'basic': 'basic',
        'pro': 'pro',
        'pro_plus': 'pro-plus'
    };

    badge.textContent = tierNames[tier] || 'Ingen abonnement';
    badge.className = `subscription-badge ${tierClasses[tier] || 'basic'}`;
}

// Lagre profil
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const profileData = {
        company_name: document.getElementById('companyName').value,
        profession: document.getElementById('profession').value,
        description: document.getElementById('description').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        service_areas: document.getElementById('serviceAreas').value.split(',').map(s => s.trim()),
        certifications: document.getElementById('certifications').value.split(',').map(s => s.trim()),
        website: document.getElementById('website').value
    };

    console.log('Lagrer profil:', profileData);

    try {
        // TODO: Send til API
        // const response = await fetch('/api/craftsman/profile', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(profileData)
        // });

        // if (response.ok) {
        //     alert('Profil lagret!');
        // }

        // For nå bare vis melding
        alert('Profil lagret! (Demo-modus)');
    } catch (error) {
        console.error('Feil ved lagring:', error);
        alert('Noe gikk galt. Prøv igjen.');
    }
});

// Logout
function logout() {
    // TODO: Implementer logout
    window.location.href = 'index.html';
}

// Last inn profil ved sideinnlasting
window.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

