// ============================================
// HÅNDVERKERPROSJEKTER - BOLIGPROSJEKT
// ============================================

// Mock data for testing
const mockProjects = [
    {
        id: 1,
        title: 'Komplett baderomsrenovering',
        description: 'Ønsker å renovere badet fullstendig. Inkluderer flislegging, rørleggerarbeid og elektrisk arbeid.',
        room_type: 'bathroom',
        budget_min: 150000,
        budget_max: 250000,
        location: 'Oslo',
        status: 'seeking_craftsman',
        preferred_start_date: '2026-03-01',
        created_at: '2026-01-20',
        is_new: true
    },
    {
        id: 2,
        title: 'Kjøkkenoppussing',
        description: 'Trenger hjelp med å installere nytt kjøkken. Rørlegger og elektriker nødvendig.',
        room_type: 'kitchen',
        budget_min: 200000,
        budget_max: 350000,
        location: 'Bærum',
        status: 'seeking_craftsman',
        preferred_start_date: '2026-02-15',
        created_at: '2026-01-18',
        is_urgent: true
    },
    {
        id: 3,
        title: 'Elektrisk oppgradering',
        description: 'Trenger å oppgradere elektrisk anlegg i hele leiligheten.',
        room_type: 'other',
        budget_min: 50000,
        budget_max: 100000,
        location: 'Oslo',
        status: 'seeking_craftsman',
        preferred_start_date: '2026-04-01',
        created_at: '2026-01-15',
        is_new: false
    }
];

// Last inn prosjekter
async function loadProjects() {
    // TODO: Erstatt med ekte API-kall
    // const response = await fetch('/api/projects/available');
    // const projects = await response.json();

    // For nå bruker vi mock data
    let projects = [...mockProjects];

    displayProjects(projects);
}

// Vis prosjekter
function displayProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');

    if (projects.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <div class="project-title">${project.title}</div>
                </div>
                ${project.is_new ? '<span class="project-badge new">NY</span>' : ''}
                ${project.is_urgent ? '<span class="project-badge urgent">HASTER</span>' : ''}
            </div>
            
            <div class="project-meta">
                <div class="meta-item">
                    📍 ${project.location}
                </div>
                <div class="meta-item">
                    🏠 ${getRoomTypeName(project.room_type)}
                </div>
                <div class="meta-item">
                    📅 Start: ${formatDate(project.preferred_start_date)}
                </div>
            </div>

            <div class="project-description">
                ${project.description}
            </div>

            <div class="project-budget">
                ${formatBudget(project.budget_min, project.budget_max)}
            </div>

            <div class="project-actions">
                <button class="btn-contact" onclick="contactCustomer(${project.id})">
                    Kontakt kunde
                </button>
                <button class="btn-details" onclick="viewProjectDetails(${project.id})">
                    Se detaljer
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrer prosjekter
function applyFilters() {
    const roomType = document.getElementById('roomTypeFilter').value;
    const location = document.getElementById('locationFilter').value;
    const budgetMin = document.getElementById('budgetMin').value;
    const budgetMax = document.getElementById('budgetMax').value;

    let projects = [...mockProjects];

    if (roomType) {
        projects = projects.filter(p => p.room_type === roomType);
    }

    if (location) {
        projects = projects.filter(p => 
            p.location.toLowerCase().includes(location.toLowerCase())
        );
    }

    if (budgetMin) {
        projects = projects.filter(p => p.budget_max >= parseInt(budgetMin));
    }

    if (budgetMax) {
        projects = projects.filter(p => p.budget_min <= parseInt(budgetMax));
    }

    displayProjects(projects);
}

// Hjelpefunksjoner
function getRoomTypeName(roomType) {
    const names = {
        'kitchen': 'Kjøkken',
        'bathroom': 'Bad',
        'bedroom': 'Soverom',
        'living_room': 'Stue',
        'other': 'Annet'
    };
    return names[roomType] || roomType;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatBudget(min, max) {
    return `${min.toLocaleString('no-NO')} - ${max.toLocaleString('no-NO')} kr`;
}

function contactCustomer(projectId) {
    // Sjekk om bruker er logget inn
    const user = localStorage.getItem('boligprosjekt_user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // TODO: Sjekk håndverkerens abonnement
    // Pro+ får direkte kontakt, Pro får notifikasjon, Basic får begrenset tilgang
    console.log('Kontakter kunde for prosjekt:', projectId);
    alert('Kontaktfunksjon kommer snart!');
}

function viewProjectDetails(projectId) {
    // Sjekk om bruker er logget inn
    const user = localStorage.getItem('boligprosjekt_user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    console.log('Viser detaljer for prosjekt:', projectId);
    alert('Detaljvisning kommer snart!');
}

function logout() {
    // TODO: Implementer logout
    window.location.href = 'index.html';
}

// Last inn prosjekter ved sideinnlasting
window.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

