// ============================================
// ENKEL AUTH FOR TESTING (uten Supabase)
// ============================================

// Logg inn (demo-modus)
function simpleLogin(email, plan = 'free') {
    const user = {
        id: 'demo_' + Date.now(),
        email: email,
        subscription: {
            plan: plan, // free, premium, pro
            status: 'active',
            project_count: 0,
            max_projects: plan === 'free' ? 1 : (plan === 'premium' ? 5 : -1),
            ai_chat_enabled: plan !== 'free',
            craftsman_help_enabled: plan !== 'free'
        },
        created_at: new Date().toISOString()
    };

    // Lagre i localStorage
    localStorage.setItem('boligprosjekt_user', JSON.stringify(user));
    
    return user;
}

// Logg ut
function simpleLogout() {
    localStorage.removeItem('boligprosjekt_user');
    window.location.href = 'index.html';
}

// Hent innlogget bruker
function getLoggedInUser() {
    const userStr = localStorage.getItem('boligprosjekt_user');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

// Oppgrader abonnement
function upgradeSubscription(plan) {
    const user = getLoggedInUser();
    if (!user) return false;

    user.subscription.plan = plan;
    user.subscription.max_projects = plan === 'free' ? 1 : (plan === 'premium' ? 5 : -1);
    user.subscription.ai_chat_enabled = plan !== 'free';
    user.subscription.craftsman_help_enabled = plan !== 'free';

    localStorage.setItem('boligprosjekt_user', JSON.stringify(user));
    return true;
}

// Øk prosjektteller
function incrementProjectCount() {
    const user = getLoggedInUser();
    if (!user) return false;

    user.subscription.project_count++;
    localStorage.setItem('boligprosjekt_user', JSON.stringify(user));
    return true;
}

// Oppdater navigasjon basert på innlogging
function updateSimpleNavigation() {
    const user = getLoggedInUser();
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;

    if (user) {
        const displayName = user.email.split('@')[0];
        const planBadge = user.subscription.plan === 'free' ? '' : 
                         `<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">${user.subscription.plan.toUpperCase()}</span>`;
        
        navLinks.innerHTML = `
            <a href="pricing.html" class="nav-link">Priser</a>
            <a href="ai-chat.html" class="nav-link">AI Chat</a>
            <a href="handverker-prosjekter.html" class="nav-link">For Håndverkere</a>
            <a href="prosjekter.html" class="nav-link">Mine Prosjekter</a>
            <a href="#" class="nav-link" onclick="simpleLogout(); return false;">Logg ut</a>
            <span class="nav-link" style="color: #0f172a; font-weight: 600;">
                ${displayName}${planBadge}
            </span>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="om.html" class="nav-link">Om oss</a>
            <a href="pricing.html" class="nav-link">Priser</a>
            <a href="ai-chat.html" class="nav-link">AI Chat</a>
            <a href="handverker-prosjekter.html" class="nav-link">For Håndverkere</a>
            <a href="login.html" class="nav-link">Logg inn</a>
            <a href="planlegger.html" class="btn-primary">Start planlegging →</a>
        `;
    }
}

// Initialiser ved sideinnlasting
document.addEventListener('DOMContentLoaded', () => {
    updateSimpleNavigation();
});

// Eksporter funksjoner
window.simpleAuth = {
    login: simpleLogin,
    logout: simpleLogout,
    getUser: getLoggedInUser,
    upgrade: upgradeSubscription,
    incrementProjects: incrementProjectCount,
    updateNav: updateSimpleNavigation
};

