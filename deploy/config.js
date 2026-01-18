// Supabase konfigurasjon
const SUPABASE_URL = 'https://smeepfduuzxuhrptfczx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZWVwZmR1dXp4dWhycHRmY3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTI0NjIsImV4cCI6MjA4NDIyODQ2Mn0.n81fNwA84DjJrucmNJbTgASrhMm-vVJLx9nIpLAlN10';

// Grok AI konfigurasjon (xAI API)
const GROK_API_KEY = 'xai-YOUR_API_KEY_HERE'; // Må settes av bruker
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

// Vent på at Supabase er lastet, deretter initialiser client
(function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        // Initialiser Supabase client
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Eksporter for bruk i andre filer
        window.supabaseClient = supabase;

        console.log('Supabase client initialisert');
    } else {
        // Prøv igjen om 50ms
        setTimeout(initSupabase, 50);
    }
})();

