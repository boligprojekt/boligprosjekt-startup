// Projects Overview Page JavaScript

let currentUser = null;
let allProjects = [];
let filteredProjects = [];

// Vent på at Supabase er klar
async function waitForSupabase() {
    while (typeof supabaseClient === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Initialiser siden
async function initProjectsPage() {
    // Sjekk autentisering
    currentUser = await checkAuth();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Last alle prosjekter
    await loadAllProjects();
}

// Last alle prosjekter (både egne og offentlige)
async function loadAllProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const emptyState = document.getElementById('emptyState');

    try {
        await waitForSupabase();

        // Hent alle prosjekter som enten er offentlige ELLER tilhører brukeren
        const { data: projects, error } = await supabaseClient
            .from('projects')
            .select(`
                *,
                profiles:user_id (
                    display_name,
                    full_name
                )
            `)
            .or(`is_public.eq.true,user_id.eq.${currentUser.id}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        allProjects = projects || [];
        
        // Beregn totalpris for hvert prosjekt
        for (let project of allProjects) {
            project.total_price = await calculateProjectTotalPrice(project.id);
        }

        // Anvend filtre
        applyFilters();

    } catch (error) {
        console.error('Feil ved lasting av prosjekter:', error);
        projectsGrid.innerHTML = `
            <div class="error-message">
                <p>Kunne ikke laste prosjekter. Prøv igjen senere.</p>
            </div>
        `;
    }
}

// Beregn total pris for et prosjekt
async function calculateProjectTotalPrice(projectId) {
    try {
        await waitForSupabase();
        
        const { data: items, error } = await supabaseClient
            .from('shopping_list')
            .select('price, quantity')
            .eq('project_id', projectId);

        if (error) throw error;

        if (!items || items.length === 0) return 0;

        return items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

    } catch (error) {
        console.error('Feil ved beregning av prosjektpris:', error);
        return 0;
    }
}

// Anvend filtre
function applyFilters() {
    const privacyFilter = document.getElementById('privacyFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const budgetFilter = document.getElementById('budgetFilter').value;
    const qualityFilter = document.getElementById('qualityFilter').value;

    filteredProjects = allProjects.filter(project => {
        // Privacy filter
        if (privacyFilter === 'public' && !project.is_public) return false;
        if (privacyFilter === 'mine' && project.user_id !== currentUser.id) return false;

        // Category filter
        if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;

        // Budget filter
        if (budgetFilter !== 'all') {
            const [min, max] = budgetFilter.split('-').map(Number);
            if (project.total_price < min || project.total_price > max) return false;
        }

        // Quality filter
        if (qualityFilter !== 'all' && project.quality_level !== qualityFilter) return false;

        return true;
    });

    displayProjects();
}

// Vis prosjekter
function displayProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const emptyState = document.getElementById('emptyState');

    if (filteredProjects.length === 0) {
        projectsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        resultsCount.textContent = 'Ingen prosjekter funnet';
        return;
    }

    projectsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    resultsCount.textContent = `Viser ${filteredProjects.length} prosjekt${filteredProjects.length !== 1 ? 'er' : ''}`;

    projectsGrid.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');
}

// Lag prosjektkort
function createProjectCard(project) {
    const isOwner = project.user_id === currentUser.id;
    const ownerName = project.profiles?.display_name || project.profiles?.full_name || 'Ukjent bruker';
    const categoryNames = {
        'kjokken': 'Kjøkken',
        'bad': 'Bad',
        'gulv': 'Gulv',
        'maling': 'Maling',
        'belysning': 'Belysning',
        'vinduer': 'Vinduer'
    };
    const categoryName = categoryNames[project.category] || project.category;
    const qualityNames = {
        'budsjett': 'Budsjett',
        'standard': 'Standard',
        'premium': 'Premium'
    };
    const qualityName = qualityNames[project.quality_level] || project.quality_level;

    const createdDate = new Date(project.created_at).toLocaleDateString('no-NO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return `
        <div class="project-card" onclick="viewProject('${project.id}')">
            <div class="project-card-header">
                <div class="project-card-title">
                    ${project.name || 'Uten navn'}
                    <span class="project-privacy-badge ${project.is_public ? 'public' : 'private'}">
                        ${project.is_public ? '🌐 Offentlig' : '🔒 Privat'}
                    </span>
                </div>
                <div class="project-card-meta">
                    <span>📁 ${categoryName}</span>
                </div>
            </div>
            <div class="project-card-body">
                <div class="project-stats">
                    <div class="project-stat">
                        <span class="project-stat-label">Budsjett</span>
                        <span class="project-stat-value">${formatPrice(project.budget || 0)}</span>
                    </div>
                    <div class="project-stat">
                        <span class="project-stat-label">Totalpris</span>
                        <span class="project-stat-value">${formatPrice(project.total_price || 0)}</span>
                    </div>
                </div>
                <span class="project-quality-badge ${project.quality_level}">
                    ${qualityName}
                </span>
            </div>
            <div class="project-card-footer">
                <span class="project-owner">
                    ${isOwner ? '👤 Ditt prosjekt' : `👤 ${ownerName}`}
                </span>
                <span class="project-date">${createdDate}</span>
            </div>
        </div>
    `;
}

// Vis prosjekt (gå til prosjekt-siden)
function viewProject(projectId) {
    window.location.href = `prosjekt.html?id=${projectId}`;
}

// Nullstill filtre
function resetFilters() {
    document.getElementById('privacyFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('budgetFilter').value = 'all';
    document.getElementById('qualityFilter').value = 'all';
    applyFilters();
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

// Initialiser når siden lastes
document.addEventListener('DOMContentLoaded', () => {
    initProjectsPage();
});

