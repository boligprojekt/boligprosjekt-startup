// ============================================
// PRICING PAGE - BOLIGPROSJEKT
// ============================================

// Toggle mellom kunde og håndverker priser
const customerToggle = document.getElementById('customerToggle');
const craftsmanToggle = document.getElementById('craftsmanToggle');
const customerPricing = document.getElementById('customerPricing');
const craftsmanPricing = document.getElementById('craftsmanPricing');

customerToggle.addEventListener('click', () => {
    customerToggle.classList.add('active');
    craftsmanToggle.classList.remove('active');
    customerPricing.style.display = 'grid';
    craftsmanPricing.style.display = 'none';
});

craftsmanToggle.addEventListener('click', () => {
    craftsmanToggle.classList.add('active');
    customerToggle.classList.remove('active');
    craftsmanPricing.style.display = 'grid';
    customerPricing.style.display = 'none';
});

// Velg plan
function selectPlan(planType) {
    console.log('Valgt plan:', planType);
    
    // Sjekk om bruker er innlogget
    const user = getCurrentUser();
    
    if (!user) {
        // Ikke innlogget - send til registrering med plan i URL
        window.location.href = `login.html?plan=${planType}&action=signup`;
        return;
    }
    
    // Innlogget - send til checkout
    if (planType === 'free') {
        // Gratis plan - bare oppdater brukerens abonnement
        updateUserSubscription(planType);
    } else {
        // Betalt plan - send til Stripe checkout
        window.location.href = `checkout.html?plan=${planType}`;
    }
}

// Hent innlogget bruker (placeholder - skal integreres med Firebase/Supabase)
function getCurrentUser() {
    // TODO: Integrer med Firebase/Supabase auth
    // For nå returnerer vi null (ikke innlogget)
    return null;
}

// Oppdater brukerabonnement
async function updateUserSubscription(planType) {
    try {
        const response = await fetch('/api/subscriptions/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: planType
            })
        });
        
        if (response.ok) {
            alert('Abonnement oppdatert!');
            window.location.href = 'planlegger.html';
        } else {
            alert('Noe gikk galt. Prøv igjen.');
        }
    } catch (error) {
        console.error('Feil ved oppdatering av abonnement:', error);
        alert('Noe gikk galt. Prøv igjen.');
    }
}

