// Kategorier data
const categories = [
    { id: 'kjokken', name: 'Kjøkken', description: 'Oppgradering av kjøkken' },
    { id: 'bad', name: 'Bad', description: 'Baderom og våtrom' },
    { id: 'gulv', name: 'Gulv', description: 'Nye gulv i hele boligen' },
    { id: 'maling', name: 'Maling', description: 'Male vegger og tak' },
    { id: 'belysning', name: 'Belysning', description: 'Ny belysning' },
    { id: 'vinduer', name: 'Vinduer', description: 'Skifte vinduer' },
];

// State
let selectedCategory = '';
let selectedQuality = 'standard'; // Default til standard
let budget = '';

// DOM elementer
const qualityGrid = document.getElementById('qualityGrid');
const categoryGrid = document.getElementById('categoryGrid');
const budgetInput = document.getElementById('budget');
const submitBtn = document.getElementById('submitBtn');
const projectForm = document.getElementById('projectForm');

// Initialiser kvalitetsknapper
function initQualityButtons() {
    const qualityBtns = document.querySelectorAll('.quality-btn');
    qualityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectQuality(btn.dataset.quality, btn);
        });
    });
}

// Velg kvalitet
function selectQuality(quality, btnElement) {
    selectedQuality = quality;

    // Fjern active class fra alle knapper
    const allBtns = document.querySelectorAll('.quality-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));

    // Legg til active class på valgt knapp
    btnElement.classList.add('active');
}

// Initialiser kategorier
function initCategories() {
    categories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.type = 'button';
        categoryBtn.className = 'category-btn';
        categoryBtn.innerHTML = `
            <div class="category-name">${category.name}</div>
            <div class="category-description">${category.description}</div>
        `;

        categoryBtn.addEventListener('click', () => {
            selectCategory(category.id, categoryBtn);
        });

        categoryGrid.appendChild(categoryBtn);
    });
}

// Velg kategori
function selectCategory(categoryId, btnElement) {
    selectedCategory = categoryId;
    
    // Fjern active class fra alle knapper
    const allBtns = document.querySelectorAll('.category-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
    
    // Legg til active class på valgt knapp
    btnElement.classList.add('active');
    
    // Oppdater submit knapp
    updateSubmitButton();
}

// Oppdater submit knapp
function updateSubmitButton() {
    if (selectedCategory && budget) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Håndter budsjett input
budgetInput.addEventListener('input', (e) => {
    budget = e.target.value;
    updateSubmitButton();
});

// Håndter form submit
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedCategory && budget) {
        // Lagre data i localStorage
        localStorage.setItem('projectData', JSON.stringify({
            category: selectedCategory,
            budget: budget,
            quality: selectedQuality
        }));

        // Naviger til prosjekt side
        window.location.href = `prosjekt.html?kategori=${selectedCategory}&budsjett=${budget}&kvalitet=${selectedQuality}`;
    }
});

// Hent populære prosjekter fra databasen
async function loadPopularProjects() {
    const popularGrid = document.getElementById('popularProjectsGrid');

    try {
        // Vent på at Supabase er klar
        if (!window.supabaseClient) {
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (window.supabaseClient) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
            });
        }

        // Hent alle prosjekter og tell kategorier
        const { data: projects, error } = await supabaseClient
            .from('projects')
            .select('category, budget');

        if (error) throw error;

        if (!projects || projects.length === 0) {
            // Hvis ingen prosjekter, vis default melding
            popularGrid.innerHTML = `
                <div class="empty-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
                    <p>Ingen prosjekter ennå. Bli den første til å opprette et prosjekt!</p>
                </div>
            `;
            return;
        }

        // Tell antall prosjekter per kategori og beregn gjennomsnittlig budsjett
        const categoryStats = {};

        projects.forEach(project => {
            if (!categoryStats[project.category]) {
                categoryStats[project.category] = {
                    count: 0,
                    totalBudget: 0
                };
            }
            categoryStats[project.category].count++;
            categoryStats[project.category].totalBudget += parseFloat(project.budget);
        });

        // Sorter kategorier etter antall (mest populære først)
        const sortedCategories = Object.entries(categoryStats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 3); // Ta top 3

        // Kategori-metadata
        const categoryMeta = {
            kjokken: {
                name: 'Kjøkkenoppussing',
                description: 'Komplett kjøkken med skap, benkeplate og hvitevarer'
            },
            bad: {
                name: 'Baderomsrenovering',
                description: 'Nytt bad med dusj, toalett, servant og fliser'
            },
            gulv: {
                name: 'Nye gulv',
                description: 'Laminat eller parkett i hele leiligheten'
            },
            maling: {
                name: 'Malerprosjekt',
                description: 'Male vegger og tak i hele boligen'
            },
            belysning: {
                name: 'Belysningsoppdatering',
                description: 'Ny belysning i hele hjemmet'
            },
            vinduer: {
                name: 'Vindusutskifting',
                description: 'Nye energivinduer'
            }
        };

        // Generer kort for populære prosjekter
        popularGrid.innerHTML = '';

        sortedCategories.forEach(([category, stats]) => {
            const meta = categoryMeta[category] || {
                name: category,
                description: 'Oppussingsprosjekt'
            };
            const avgBudget = Math.round(stats.totalBudget / stats.count);

            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3 class="project-title">${meta.name}</h3>
                <p class="project-description">${meta.description}</p>
                <div class="project-price">Fra ${formatPrice(avgBudget)}</div>
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">
                    ${stats.count} ${stats.count === 1 ? 'prosjekt' : 'prosjekter'} opprettet
                </div>
            `;

            popularGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Feil ved lasting av populære prosjekter:', error);
        // Vis feilmelding
        popularGrid.innerHTML = `
            <div class="empty-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
                <p>Kunne ikke laste populære prosjekter</p>
            </div>
        `;
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

// Initialiser når siden lastes
document.addEventListener('DOMContentLoaded', () => {
    initQualityButtons();
    initCategories();
    loadPopularProjects();
});

