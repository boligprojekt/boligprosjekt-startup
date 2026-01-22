// ============================================
// ABONNEMENTSKONTROLL - BOLIGPROSJEKT
// ============================================

// Sjekk om bruker er logget inn
function isUserLoggedIn() {
    // Sjekk localStorage for bruker
    const user = localStorage.getItem('boligprosjekt_user');
    return user !== null;
}

// Hent bruker fra localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('boligprosjekt_user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

// Mock brukerdata for testing (hvis logget inn)
const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    subscription: {
        plan: 'free', // free, premium, pro
        status: 'active',
        project_count: 0, // Antall prosjekter brukeren har
        max_projects: 1, // Maks antall prosjekter basert på plan
        ai_chat_enabled: false,
        craftsman_help_enabled: false
    }
};

// Hent brukerens abonnement
async function getUserSubscription() {
    // Sjekk om bruker er logget inn
    if (!isUserLoggedIn()) {
        return null;
    }

    // TODO: Hent fra API
    // const response = await fetch('/api/user/subscription');
    // return await response.json();

    // For nå returnerer vi mock data
    return mockUser.subscription;
}

// Sjekk om bruker kan opprette nytt prosjekt
async function canCreateProject() {
    // Først sjekk om bruker er logget inn
    if (!isUserLoggedIn()) {
        return {
            allowed: false,
            reason: 'not_logged_in',
            current_plan: null
        };
    }

    const subscription = await getUserSubscription();

    // Hvis Pro plan (ubegrenset)
    if (subscription.plan === 'pro') {
        return { allowed: true };
    }

    // Sjekk om bruker har nådd grensen
    if (subscription.project_count >= subscription.max_projects) {
        return {
            allowed: false,
            reason: 'limit_reached',
            current_plan: subscription.plan,
            project_count: subscription.project_count,
            max_projects: subscription.max_projects
        };
    }

    return { allowed: true };
}

// Sjekk om bruker har tilgang til AI Chat
async function canAccessAIChat() {
    const subscription = await getUserSubscription();

    if (!subscription.ai_chat_enabled) {
        return {
            allowed: false,
            reason: 'upgrade_required',
            current_plan: subscription.plan,
            required_plan: 'premium'
        };
    }

    return { allowed: true };
}

// Sjekk om bruker har tilgang til håndverkersøk
async function canAccessCraftsmanSearch() {
    const subscription = await getUserSubscription();

    if (!subscription.craftsman_help_enabled) {
        return {
            allowed: false,
            reason: 'upgrade_required',
            current_plan: subscription.plan,
            required_plan: 'premium'
        };
    }

    return { allowed: true };
}

// Vis oppgraderingsmelding
function showUpgradeModal(reason, data) {
    const modal = document.createElement('div');
    modal.id = 'upgradeModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    let message = '';
    let title = '';
    let primaryButtonText = 'Se priser';
    let primaryButtonAction = "window.location.href='pricing.html'";

    if (reason === 'not_logged_in') {
        title = '🔐 Logg inn for å fortsette';
        message = `
            <p style="font-size: 18px; color: #64748b; margin-bottom: 24px;">
                Du må <strong>logge inn</strong> eller <strong>registrere deg</strong> for å opprette prosjekter.
            </p>
            <p style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
                Registrer deg gratis og få tilgang til 1 prosjekt!
            </p>
        `;
        primaryButtonText = 'Logg inn / Registrer';
        primaryButtonAction = "window.location.href='login.html'";
    } else if (reason === 'limit_reached') {
        title = '🚀 Oppgrader for flere prosjekter';
        message = `
            <p style="font-size: 18px; color: #64748b; margin-bottom: 24px;">
                Du har nådd grensen på <strong>${data.max_projects} prosjekt</strong> for ${getPlanName(data.current_plan)}-planen.
            </p>
            <p style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
                Oppgrader til <strong>Premium</strong> (5 prosjekter) eller <strong>Pro</strong> (ubegrenset) for å fortsette!
            </p>
        `;
    } else if (reason === 'upgrade_required') {
        title = '🎨 Oppgrader for AI Chat Designer';
        message = `
            <p style="font-size: 18px; color: #64748b; margin-bottom: 24px;">
                AI Chat Designer krever minimum <strong>${getPlanName(data.required_plan)}</strong>-abonnement.
            </p>
            <p style="font-size: 16px; color: #64748b; margin-bottom: 32px;">
                Oppgrader nå og få tilgang til AI-drevet designhjelp!
            </p>
        `;
    }

    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 48px; max-width: 500px; width: 90%;">
            <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #0f172a;">
                ${title}
            </h2>
            ${message}
            <div style="display: flex; gap: 16px;">
                <button onclick="${primaryButtonAction}" style="flex: 1; padding: 16px 32px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    ${primaryButtonText}
                </button>
                <button onclick="closeUpgradeModal()" style="flex: 1; padding: 16px 32px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    Avbryt
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Lukk oppgraderingsmodal
function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.remove();
    }
}

// Hent plannavn
function getPlanName(plan) {
    const names = {
        'free': 'Gratis',
        'premium': 'Premium',
        'pro': 'Pro'
    };
    return names[plan] || plan;
}

// Eksporter funksjoner
window.subscriptionCheck = {
    canCreateProject,
    canAccessAIChat,
    canAccessCraftsmanSearch,
    showUpgradeModal,
    closeUpgradeModal
};

