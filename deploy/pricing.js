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

    const user = window.simpleAuth.getUser();

    if (!user) {
        // Ikke innlogget - send til login
        alert('Du må logge inn først!');
        window.location.href = `login.html?plan=${planType}`;
        return;
    }

    // Innlogget - oppgrader abonnement (demo-modus)
    if (planType === 'free') {
        alert('Du har allerede gratis plan!');
    } else {
        // Map plan type til subscription plan
        const planMap = {
            'premium': 'premium',
            'pro': 'pro',
            'basic_craftsman': 'basic',
            'pro_craftsman': 'pro',
            'pro_plus_craftsman': 'pro_plus'
        };

        const newPlan = planMap[planType] || 'free';
        window.simpleAuth.upgrade(newPlan);

        alert(`✅ Oppgradert til ${newPlan.toUpperCase()}!\n\n(Demo-modus - ingen betaling kreves)`);
        window.location.href = 'index.html';
    }
}

