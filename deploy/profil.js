// Profil side JavaScript

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

// Initialiser profil side
async function initProfile() {
    // Sjekk autentisering
    currentUser = await checkAuth();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Last brukerinfo
    await loadUserInfo();

    // Last prosjekter
    await loadProjects();

    // Initialiser avatar upload
    initAvatarUpload();
}

// Initialiser avatar upload funksjonalitet
function initAvatarUpload() {
    const uploadBtn = document.getElementById('avatarUploadBtn');
    const fileInput = document.getElementById('avatarInput');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await uploadAvatar(file);
            }
        });
    }
}

// Last brukerinfo
async function loadUserInfo() {
    if (!currentUser) return;

    console.log('Current user:', currentUser);
    console.log('User metadata:', currentUser.user_metadata);

    // Hent brukerprofil
    const profile = await getUserProfile(currentUser.id);
    console.log('Profile data:', profile);

    if (profile.success && profile.data) {
        // Bruk display_name hvis det finnes, ellers full_name
        const displayName = profile.data.display_name || profile.data.full_name || 'Bruker';
        console.log('Display name from profile:', displayName);
        document.getElementById('profileName').textContent = displayName;

        // Vis e-post under navnet
        document.getElementById('profileEmail').textContent = currentUser.email;

        // Vis profilbilde hvis det finnes
        if (profile.data.avatar_url) {
            displayAvatar(profile.data.avatar_url);
        }
    } else {
        console.log('No profile data, using fallback');
        // Fallback til user metadata eller e-post
        const displayName = currentUser.user_metadata?.display_name || currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
        console.log('Display name from metadata:', displayName);
        document.getElementById('profileName').textContent = displayName;
        document.getElementById('profileEmail').textContent = currentUser.email;
    }
}

// Vis avatar bilde
function displayAvatar(avatarUrl) {
    const avatarImage = document.getElementById('avatarImage');
    const avatarIcon = document.getElementById('avatarIcon');

    if (avatarImage && avatarIcon && avatarUrl) {
        avatarImage.src = avatarUrl;
        avatarImage.style.display = 'block';
        avatarIcon.style.display = 'none';
    }
}

// Last opp avatar
async function uploadAvatar(file) {
    if (!currentUser) return;

    // Valider filtype
    if (!file.type.startsWith('image/')) {
        alert('Vennligst velg en bildefil');
        return;
    }

    // Valider filstørrelse (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Bildet er for stort. Maks størrelse er 2MB');
        return;
    }

    try {
        await waitForSupabase();

        // Konverter bilde til base64
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;

            // Opprett unikt filnavn for referanse
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;

            // Marker tidligere avatar-bilder som inaktive
            await supabaseClient
                .from('user_images')
                .update({ is_active: false })
                .eq('user_id', currentUser.id)
                .eq('image_type', 'avatar');

            // Lagre bildeinformasjon i user_images tabellen
            const { error: imageError } = await supabaseClient
                .from('user_images')
                .insert([{
                    user_id: currentUser.id,
                    file_name: fileName,
                    file_path: 'base64',
                    file_size: file.size,
                    mime_type: file.type,
                    public_url: base64Image,
                    image_type: 'avatar',
                    is_active: true
                }]);

            if (imageError) {
                console.error('Image record error:', imageError);
                alert('Kunne ikke lagre bildeinformasjon');
                return;
            }

            // Oppdater brukerprofil med ny avatar URL (base64)
            const { error: updateError } = await supabaseClient
                .from('user_profiles')
                .update({ avatar_url: base64Image })
                .eq('id', currentUser.id);

            if (updateError) {
                console.error('Update error:', updateError);
                alert('Kunne ikke oppdatere profil');
                return;
            }

            // Vis det nye bildet
            displayAvatar(base64Image);

            console.log('Avatar uploaded successfully');
        };

        reader.onerror = () => {
            console.error('Error reading file');
            alert('Kunne ikke lese bildefil');
        };

    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('En feil oppstod ved opplasting av bilde');
    }
}

// Last prosjekter
async function loadProjects() {
    if (!currentUser) return;

    const projectsGrid = document.getElementById('projectsGrid');

    try {
        await waitForSupabase();
        const { data: projects, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        projectsGrid.innerHTML = '';
        
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-message">
                    <p>Du har ingen prosjekter ennå</p>
                    <a href="index.html" class="btn-primary">Opprett ditt første prosjekt</a>
                </div>
            `;
            return;
        }
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Feil ved lasting av prosjekter:', error);
        projectsGrid.innerHTML = `
            <div class="empty-message">
                <p>Kunne ikke laste prosjekter</p>
            </div>
        `;
    }
}

// Opprett prosjektkort
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const categoryIcons = {
        kjokken: '🏠',
        bad: '🚿',
        gulv: '🪵',
        maling: '🎨',
        belysning: '💡',
        vinduer: '🪟'
    };
    
    const categoryNames = {
        kjokken: 'Kjøkken',
        bad: 'Bad',
        gulv: 'Gulv',
        maling: 'Maling',
        belysning: 'Belysning',
        vinduer: 'Vinduer'
    };
    
    const icon = categoryIcons[project.category] || '📦';
    const categoryName = categoryNames[project.category] || project.category;
    
    const createdDate = new Date(project.created_at).toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="project-card-header">
            <div class="project-icon">${icon}</div>
            <div class="project-card-actions">
                <button class="project-privacy-toggle ${project.is_public ? 'public' : 'private'}"
                        onclick="event.stopPropagation(); toggleProjectPrivacy('${project.id}', ${!project.is_public})"
                        title="${project.is_public ? 'Gjør privat' : 'Gjør offentlig'}">
                    ${project.is_public ? '🌐' : '🔒'}
                </button>
                <button class="project-delete-btn" onclick="event.stopPropagation(); deleteProject('${project.id}')" title="Slett prosjekt">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
        <h3 class="project-card-title">${project.name}</h3>
        <p class="project-card-category">${categoryName}</p>
        <div class="project-card-budget">
            <span class="budget-label">Budsjett:</span>
            <span class="budget-value">${formatPrice(project.budget)}</span>
        </div>
        <div class="project-card-footer">
            <p class="project-card-date">Opprettet ${createdDate}</p>
            <span class="project-privacy-badge ${project.is_public ? 'public' : 'private'}">
                ${project.is_public ? 'Offentlig' : 'Privat'}
            </span>
        </div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `prosjekt.html?kategori=${project.category}&budsjett=${project.budget}`;
    });
    
    return card;
}

// Toggle prosjekt privacy
async function toggleProjectPrivacy(projectId, makePublic) {
    try {
        await waitForSupabase();

        const { error } = await supabaseClient
            .from('projects')
            .update({ is_public: makePublic })
            .eq('id', projectId)
            .eq('user_id', currentUser.id); // Sikre at brukeren eier prosjektet

        if (error) throw error;

        // Last prosjekter på nytt
        await loadProjects();

        // Vis bekreftelse
        const message = makePublic
            ? 'Prosjektet er nå offentlig og synlig for alle brukere'
            : 'Prosjektet er nå privat og kun synlig for deg';

        // Vis en liten notifikasjon (kan forbedres med en toast-melding)
        console.log(message);

    } catch (error) {
        console.error('Feil ved endring av prosjekt-privacy:', error);
        alert('Kunne ikke endre synlighet. Prøv igjen.');
    }
}

// Slett prosjekt
async function deleteProject(projectId) {
    if (!confirm('Er du sikker på at du vil slette dette prosjektet? Dette kan ikke angres.')) {
        return;
    }

    try {
        await waitForSupabase();

        // Slett handleliste-elementer først (pga foreign key constraint)
        const { error: itemsError } = await supabaseClient
            .from('shopping_list_items')
            .delete()
            .eq('project_id', projectId);

        if (itemsError) throw itemsError;

        // Slett prosjektet
        const { error: projectError } = await supabaseClient
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (projectError) throw projectError;

        // Last prosjekter på nytt
        await loadProjects();

    } catch (error) {
        console.error('Feil ved sletting av prosjekt:', error);
        alert('Kunne ikke slette prosjektet. Prøv igjen.');
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
    initProfile();
});

