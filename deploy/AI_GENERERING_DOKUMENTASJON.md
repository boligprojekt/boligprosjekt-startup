# AI Generert Inspirasjon - Teknisk Dokumentasjon

## 🎯 Oversikt

AI Generert Inspirasjon er en **ekte AI-drevet** funksjon som analyserer brukerens opplastede bilde og genererer et nytt, realistisk bilde med ønsket stil og budsjett.

## 🔧 Hvordan det fungerer

### 2-stegs AI-prosess:

```
1. BRUKER LASTER OPP BILDE
   ↓
2. GPT-4o (Vision) ANALYSERER BILDET
   - Romtype (kjøkken, bad, soverom, stue)
   - Nåværende stil og farger
   - Lysforhold og romstørrelse
   - Arkitektoniske detaljer
   - Materialer og layout
   ↓
3. DALL-E 3 GENERERER NYTT BILDE
   - Basert på detaljert analyse
   - Tilpasset ønsket stil
   - Tilpasset budsjett
   - Fotorealistisk kvalitet
   ↓
4. RESULTAT VISES TIL BRUKER
```

## 📊 Modeller som brukes

| Modell | Formål | Kostnad per kall |
|--------|--------|------------------|
| **GPT-4o** (Multimodal) | Bildeanalyse | ~$0.005 (~0.05 kr) |
| **DALL-E 3** (HD) | Bildegenerering | ~$0.080 (~0.85 kr) |
| **Total** | Per generering | **~$0.085 (~0.90 kr)** |

## 🚀 Oppsett

### Demo-modus (Standard - Gratis)
Systemet kjører automatisk i demo-modus hvis ingen API-nøkkel er satt.
- Viser statisk bilde fra Unsplash
- Ingen kostnader
- Ingen ekte AI-generering

### Produksjon (Ekte AI)

1. **Få OpenAI API-nøkkel:**
   ```
   https://platform.openai.com/api-keys
   ```

2. **Sett API-nøkkel i `config.js`:**
   ```javascript
   const OPENAI_API_KEY = 'sk-proj-...'; // Din nøkkel her
   ```

3. **Deploy til Netlify**

4. **Test funksjonen:**
   - Last opp bilde av et rom
   - Velg stil og budsjett
   - Klikk "Generer AI-inspirasjon →"
   - Vent 10-20 sekunder
   - Se ekte AI-generert resultat!

## 🔍 API-kall detaljer

### Steg 1: GPT-4o Vision Analyse

**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Payload:**
```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyser dette bildet nøye..."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,/9j/4AAQ...",
            "detail": "high"
          }
        }
      ]
    }
  ],
  "max_tokens": 1000,
  "temperature": 0.3
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "Dette er et soverom med klassisk stil..."
      }
    }
  ]
}
```

### Steg 2: DALL-E 3 Generering

**Endpoint:** `https://api.openai.com/v1/images/generations`

**Payload:**
```json
{
  "model": "dall-e-3",
  "prompt": "Basert på denne romanalysen: [analyse]...",
  "n": 1,
  "size": "1024x1024",
  "quality": "hd",
  "style": "natural"
}
```

**Response:**
```json
{
  "data": [
    {
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/..."
    }
  ]
}
```

## 📝 Logging

Systemet logger detaljert informasjon i browser console:

```
🚀 Starter ekte AI-generering med 2-stegs prosess:
   Steg 1: GPT-4 Vision analyserer bildet
   Steg 2: DALL-E 3 genererer nytt bilde
📸 Konverterer bilde til base64...
✅ Bilde konvertert til base64 (245.67 KB)
🔍 Sender bilde til GPT-4 Vision for analyse...
✅ Bildeanalyse mottatt: Dette er et soverom med...
🎨 Genererer nytt bilde med DALL-E 3...
✅ Bilde generert! https://oaidalleapi...
✅ Resultat vist til bruker
```

## ⚠️ Viktige notater

### Sikkerhet
- **ALDRI** commit API-nøkkel til Git
- Legg til `config.js` i `.gitignore`
- I produksjon: Bruk backend proxy for API-kall

### Begrensninger
- DALL-E 3 støtter **ikke** image edits (kan ikke redigere eksisterende bilder)
- DALL-E 3 støtter **kun** image generations (genererer nye bilder fra scratch)
- Derfor bruker vi GPT-4o Vision for å analysere bildet først

### Alternativer
- **DALL-E 2**: Støtter image edits, men lavere kvalitet
- **Stable Diffusion**: Støtter img2img, men krever egen server
- **Midjourney**: Høy kvalitet, men ingen API ennå

## 🐛 Feilsøking

### Problem: Viser alltid samme bilde
**Løsning:** Sjekk at API-nøkkel er satt i `config.js`

### Problem: "API request failed"
**Løsning:** Sjekk at API-nøkkel er gyldig og har kreditt

### Problem: "Rate limit exceeded"
**Løsning:** Vent noen minutter og prøv igjen

### Problem: Bildet ser ikke ut som opplastet bilde
**Forklaring:** DALL-E 3 genererer nye bilder basert på beskrivelse, ikke redigerer eksisterende bilde

## 📞 Support

For spørsmål eller problemer, kontakt utvikler eller se OpenAI dokumentasjon:
- https://platform.openai.com/docs/guides/vision
- https://platform.openai.com/docs/guides/images

