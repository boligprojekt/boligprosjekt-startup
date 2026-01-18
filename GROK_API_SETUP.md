# 🤖 Grok AI Setup Guide

Smart Planlegger bruker **Grok AI** (fra xAI) for å generere personlige, realistiske oppussingstips.

## 📋 Hva trenger du?

1. **Grok API Key** fra xAI (X.AI)
2. Tilgang til `deploy/config.js` filen

## 🔑 Slik får du Grok API Key:

### Steg 1: Gå til xAI Console
Besøk: **https://console.x.ai/**

### Steg 2: Logg inn / Registrer deg
- Logg inn med din X (Twitter) konto
- Eller opprett en ny konto

### Steg 3: Opprett API Key
1. Gå til **API Keys** seksjonen
2. Klikk på **"Create API Key"**
3. Gi den et navn (f.eks. "BoligProsjekt Planlegger")
4. Kopier API-nøkkelen (den vises kun én gang!)

### Steg 4: Legg til API Key i config.js

Åpne `deploy/config.js` og erstatt:

```javascript
const GROK_API_KEY = 'xai-YOUR_API_KEY_HERE';
```

Med din faktiske API key:

```javascript
const GROK_API_KEY = 'xai-abc123...'; // Din faktiske key
```

## 💰 Priser (per januar 2026)

Grok API bruker **pay-as-you-go** modell:

- **Input**: ~$5 per 1M tokens
- **Output**: ~$15 per 1M tokens

**Estimert kostnad per tips-generering**: ~$0.01-0.02 (1-2 øre)

For 1000 brukere per måned: ~$10-20

## ✅ Test at det fungerer

1. Gå til **https://boligprosjekt.io/planlegger.html**
2. Fyll ut steg 1-3
3. På steg 4, velg et erfaringsnivå
4. Du skal se "Genererer personlige tips med AI..."
5. Etter 2-3 sekunder skal AI-genererte tips vises

## 🔒 Sikkerhet

**VIKTIG**: API-nøkkelen er synlig i frontend-koden!

For produksjon, bør du:
1. Flytte API-kallet til en **backend/serverless function**
2. Bruke **environment variables** for API key
3. Implementere **rate limiting** for å unngå misbruk

### Anbefalt arkitektur (produksjon):

```
Frontend (planlegger.js)
    ↓
Netlify Function (/api/generate-tips)
    ↓
Grok API (med API key på server-side)
```

## 🛠️ Fallback

Hvis API key ikke er satt eller API-kallet feiler, vil planleggeren automatisk bruke **statiske tips** som fallback.

Dette sikrer at planleggeren alltid fungerer, selv uten Grok AI.

## 📚 Dokumentasjon

- **Grok API Docs**: https://docs.x.ai/
- **xAI Console**: https://console.x.ai/

## 🆘 Feilsøking

### "Genererer personlige tips med AI..." forsvinner ikke
- Sjekk at API key er riktig satt i `config.js`
- Åpne Developer Console (F12) og se etter feilmeldinger
- Sjekk at du har kreditt på xAI-kontoen din

### Tips vises, men er ikke AI-genererte
- Dette betyr at fallback til statiske tips er aktivert
- Sjekk API key og nettverksforbindelse

### CORS-feil
- Grok API støtter CORS fra frontend
- Hvis du får CORS-feil, vurder å flytte til serverless function

## 💡 Tips for bedre AI-tips

Du kan justere AI-oppførselen i `planlegger.js`:

```javascript
temperature: 0.7,  // Høyere = mer kreativ (0.0-1.0)
max_tokens: 300,   // Maks lengde på svar
```

- **Lavere temperature (0.3-0.5)**: Mer konsistent, faktabasert
- **Høyere temperature (0.7-0.9)**: Mer kreativ, variert

---

**Lykke til med Smart Planlegger! 🚀**

