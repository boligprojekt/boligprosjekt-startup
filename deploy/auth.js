// Autentisering med Supabase

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

// Sjekk om bruker er innlogget
async function checkAuth() {
    await waitForSupabase();
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// Registrer ny bruker
async function signUp(email, password, fullName) {
    try {
        await waitForSupabase();
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    display_name: fullName
                }
            }
        });

        if (error) throw error;

        // Opprett brukerprofil
        if (data.user) {
            const { error: profileError } = await supabaseClient
                .from('user_profiles')
                .insert([
                    {
                        id: data.user.id,
                        display_name: fullName,
                        full_name: fullName
                    }
                ]);

            if (profileError) console.error('Feil ved oppretting av profil:', profileError);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Registreringsfeil:', error);
        return { success: false, error: error.message };
    }
}

// Logg inn bruker
async function signIn(email, password) {
    try {
        await waitForSupabase();
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Innloggingsfeil:', error);
        return { success: false, error: error.message };
    }
}

// Logg ut bruker
async function signOut() {
    try {
        await waitForSupabase();
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        // Redirect til hovedside
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        console.error('Utloggingsfeil:', error);
        return { success: false, error: error.message };
    }
}

// Hent bruker profil
async function getUserProfile(userId) {
    try {
        await waitForSupabase();
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Feil ved henting av profil:', error);
        return { success: false, error: error.message };
    }
}

// Oppdater bruker profil
async function updateUserProfile(userId, updates) {
    try {
        await waitForSupabase();
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Feil ved oppdatering av profil:', error);
        return { success: false, error: error.message };
    }
}

// Oppdater navigasjon basert på auth status
async function updateNavigation() {
    const user = await checkAuth();
    const navLinks = document.querySelector('.nav-links');
    console.log('Updating navigation - user:', user ? 'logged in' : 'not logged in');

    if (!navLinks) return;

    if (user) {
        console.log('User in navigation:', user);
        console.log('User metadata in navigation:', user.user_metadata);

        // Hent brukerprofil for å få display_name
        const profileResult = await getUserProfile(user.id);
        console.log('Profile result in navigation:', profileResult);

        const displayName = profileResult.success && profileResult.data?.display_name
            ? profileResult.data.display_name
            : profileResult.success && profileResult.data?.full_name
            ? profileResult.data.full_name
            : user.user_metadata?.display_name
            || user.user_metadata?.full_name
            || user.email.split('@')[0];

        console.log('Final display name in navigation:', displayName);

        // Bruker er innlogget
        navLinks.innerHTML = `
            <a href="index.html" class="nav-link">Kalkulator</a>
            <a href="prosjekter.html" class="nav-link">Prosjekter</a>
            <a href="profil.html" class="nav-link">Min profil</a>
            <a href="#" class="nav-link" onclick="signOut()">Logg ut</a>
            <span class="nav-link" style="color: #0f172a; font-weight: 600;">
                ${displayName}
            </span>
        `;
    } else {
        // Bruker er ikke innlogget
        navLinks.innerHTML = `
            <a href="index.html" class="nav-link">Kalkulator</a>
            <a href="om.html" class="nav-link">Om oss</a>
            <a href="login.html" class="nav-link">Logg inn</a>
            <a href="registrer.html" class="btn-primary">Kom i gang</a>
        `;
    }
}

// Beskytt side (krever innlogging)
async function requireAuth() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialiser auth når siden lastes
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});

