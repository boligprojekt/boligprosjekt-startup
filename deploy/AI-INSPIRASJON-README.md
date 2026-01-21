# AI Kjøkken-inspirasjon - Setup Guide

## Oversikt

AI Kjøkken-inspirasjon er en funksjon som lar brukere laste opp bilder av sitt eksisterende kjøkken og få AI-genererte visualiseringer av hvordan kjøkkenet kan se ut i ulike stiler og budsjetter.

## Hvordan det fungerer

1. **Bruker laster opp bilde** av sitt nåværende kjøkken (1-3 bilder)
2. **Velger ønsket stil**: Moderne, Klassisk, Skandinavisk, Industriell, Landlig, Minimalistisk
3. **Velger budsjett**: Lavt (50-100k), Middels (100-200k), Høyt (200k+)
4. **AI genererer inspirasjon** basert på input
5. **Bruker får**:
   - AI-generert bilde av kjøkkenet i ny stil
   - Forklaring av materialvalg
   - Budsjettmatch-vurdering
   - Anbefalte leverandører

## Demo-modus vs Produksjon

### Demo-modus (Standard)
Hvis ingen OpenAI API-nøkkel er satt, kjører systemet i demo-modus:
- Viser et placeholder-bilde fra Unsplash
- Genererer realistisk forklaringstekst
- Fungerer uten kostnader
- Perfekt for testing og demo

### Produksjon (Med OpenAI API)
For å aktivere ekte AI-generering:

1. **Få OpenAI API-nøkkel**:
   - Gå til https://platform.openai.com/
   - Opprett konto
   - Gå til API Keys
   - Opprett ny nøkkel

2. **Sett API-nøkkel**:
   - Åpne `deploy/config.js`
   - Finn linjen: `const OPENAI_API_KEY = '';`
   - Sett inn din nøkkel: `const OPENAI_API_KEY = 'sk-...';`

3. **Kostnader**:
   - DALL-E 3 Standard: ~$0.04 per bilde
   - DALL-E 3 HD: ~$0.08 per bilde
   - Estimert kostnad: 0.40-0.80 kr per generering

## Sikkerhet - VIKTIG! ⚠️

**ALDRI commit API-nøkkelen til Git!**

### Anbefalt produksjonsoppsett:

1. **Bruk miljøvariabler**:
   ```javascript
   const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
   ```

2. **Bruk backend-proxy**:
   - Lag en serverless function (Netlify Functions, Vercel, etc.)
   - API-kall går via backend
   - Nøkkelen lagres som miljøvariabel på serveren
   - Frontend kaller din backend, ikke OpenAI direkte

3. **Eksempel Netlify Function** (`netlify/functions/generate-kitchen.js`):
   ```javascript
   exports.handler = async (event) => {
     const { image, prompt } = JSON.parse(event.body);
     
     const response = await fetch('https://api.openai.com/v1/images/edits', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ image, prompt })
     });
     
     const data = await response.json();
     return {
       statusCode: 200,
       body: JSON.stringify(data)
     };
   };
   ```

4. **Oppdater frontend** til å kalle din function:
   ```javascript
   const response = await fetch('/.netlify/functions/generate-kitchen', {
     method: 'POST',
     body: JSON.stringify({ image, prompt })
   });
   ```

## Prompt-engineering

Prompten er designet for å:
- Bevare rommets proporsjoner og arkitektur
- Tilpasse materialvalg til budsjett
- Gi realistiske norske løsninger
- Unngå luksusløsninger på lavt budsjett
- Fokusere på fronter, farger og overflater

Se `kjokken-inspirasjon.js` → `generatePrompt()` for full prompt.

## Norske leverandører

Systemet anbefaler leverandører basert på budsjett:

| Budsjett | Leverandører |
|----------|--------------|
| Lavt (1-2) | IKEA, Byggmakker, Maxbo |
| Middels (3) | IKEA METOD, Epoq, Kvik |
| Middels-Høyt (4) | Epoq, Kvik, Sigdal |
| Høyt (5) | HTH, Sigdal Premium, Kvik Premium |

## Fremtidige forbedringer

- [ ] Støtte for flere rom (bad, stue, soverom)
- [ ] Lagre genererte bilder i Supabase
- [ ] Sammenligning av flere stiler side-om-side
- [ ] Eksport til PDF med produktliste
- [ ] Integrasjon med prosjektplanleggeren
- [ ] Prisestimat basert på AI-analyse
- [ ] Før/etter-galleri fra andre brukere

## Support

For spørsmål eller problemer, kontakt utvikler.

## Lisens

Proprietær - BoligProsjekt.io

