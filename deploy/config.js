// Supabase konfigurasjon
const SUPABASE_URL = 'https://smeepfduuzxuhrptfczx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZWVwZmR1dXp4dWhycHRmY3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTI0NjIsImV4cCI6MjA4NDIyODQ2Mn0.n81fNwA84DjJrucmNJbTgASrhMm-vVJLx9nIpLAlN10';

// Grok AI konfigurasjon (xAI API)
const GROK_API_KEY = 'xai-YOUR_API_KEY_HERE'; // Må settes av bruker
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

// ============================================
// OpenAI konfigurasjon (for AI Generert Inspirasjon)
// ============================================
// VIKTIG: Denne nøkkelen må holdes hemmelig!
// I produksjon bør API-kall gå via backend for å skjule nøkkelen

// For å aktivere EKTE AI-generering:
// 1. Gå til https://platform.openai.com/api-keys
// 2. Opprett en ny API-nøkkel
// 3. Lim inn nøkkelen under (erstatt tom streng)
// 4. Deploy til Netlify

// Hvis tom, kjører systemet i demo-modus med statisk bilde
const OPENAI_API_KEY = ''; // Sett din OpenAI API-nøkkel her: 'sk-proj-...'
window.OPENAI_API_KEY = OPENAI_API_KEY;

// Logging
if (OPENAI_API_KEY && OPENAI_API_KEY !== '') {
    console.log('✅ OpenAI API-nøkkel funnet - EKTE AI-generering aktivert');
    console.log('   Modeller: GPT-4o (Vision) + DALL-E 3 (HD)');
    console.log('   Kostnad: ~0.90 kr per generering');
} else {
    console.log('⚠️ Ingen OpenAI API-nøkkel - Kjører i DEMO-modus');
    console.log('   For ekte AI: Sett OPENAI_API_KEY i config.js');
}

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

