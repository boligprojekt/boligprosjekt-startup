# BoligProsjekt AI Backend 🚀

**Profesjonell backend for AI Generert Inspirasjon**

Samme arkitektur som vibecode.dev:
- ✅ Multimodal Claude Opus / GPT-4o
- ✅ Bilde faktisk sendt til modellen
- ✅ Server-side sandbox (Docker)
- ✅ Streaming respons (SSE)
- ✅ Ingen statiske bilder

---

## 🏗️ Arkitektur

```
[Frontend – HTML/JS]
  ├─ Image upload
  ├─ Style & budget input
  ├─ Live stream (SSE)
  ↓
[Backend – Node.js/Express]
  ├─ Holder API-nøkler (sikre)
  ├─ Snakker med Claude Opus
  ├─ Snakker med DALL-E 3
  ├─ Starter sandbox (Docker)
  ↓
[Sandbox – Docker]
  ├─ Midlertidig filsystem
  ├─ Bildebehandling (sharp)
  ├─ Prompt-generering
  ↓
[AI APIs]
  ├─ Claude Opus (vision + analyse)
  └─ DALL-E 3 (bildegenerering)
```

---

## 🚀 Kom i gang

### 1. Installer dependencies

```bash
cd backend
npm install
```

### 2. Sett opp miljøvariabler

```bash
cp .env.example .env
```

Rediger `.env`:

```env
# Anthropic Claude (ANBEFALT)
ANTHROPIC_API_KEY=sk-ant-api03-...

# OpenAI (for DALL-E)
OPENAI_API_KEY=sk-proj-...

# Server
PORT=3001
NODE_ENV=development
```

### 3. Start server

```bash
# Development (med auto-reload)
npm run dev

# Production
npm start
```

Server kjører på `http://localhost:3001`

---

## 📡 API Endpoints

### `GET /health`
Health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-21T12:00:00.000Z",
  "service": "BoligProsjekt AI Backend",
  "version": "1.0.0"
}
```

### `POST /api/analyze`
Analyser bilde (standard respons)

**Request:**
```
Content-Type: multipart/form-data

image: [File]
style: "moderne"
budget: 150000
description: "Ønsker mer lys og luftig"
```

**Response:**
```json
{
  "success": true,
  "analysis": "Dette er et kjøkken med...",
  "metadata": {
    "model": "claude-3-opus-20240229",
    "tokens": { "input_tokens": 1234, "output_tokens": 567 },
    "timestamp": "2025-01-21T12:00:00.000Z"
  }
}
```

### `POST /api/analyze-stream`
Analyser bilde (streaming respons med SSE)

**Request:** Samme som `/api/analyze`

**Response:** Server-Sent Events

```
data: {"type":"status","message":"Analyserer bilde...","progress":0}

data: {"type":"text","content":"Dette er et ","fullText":"Dette er et ","progress":5}

data: {"type":"text","content":"kjøkken","fullText":"Dette er et kjøkken","progress":10}

...

data: {"type":"complete","fullText":"...","metadata":{...},"progress":100}

data: [DONE]
```

### `POST /api/generate-image`
Generer bilde med DALL-E 3

**Request:**
```json
{
  "prompt": "A modern Scandinavian kitchen...",
  "style": "moderne",
  "budget": 150000
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://oaidalleapi..."
}
```

---

## 🐳 Docker Sandbox

### Bygg sandbox image

```bash
cd sandbox
docker build -t boligprosjekt-sandbox .
```

### Kjør sandbox

```bash
docker run --rm \
  --memory="512m" \
  --cpus="1.0" \
  boligprosjekt-sandbox
```

### Test sandbox

```bash
echo '{"type":"health-check"}' | docker run -i boligprosjekt-sandbox
```

---

## 🌐 Deploy til produksjon

### Render.com (Anbefalt)

1. Opprett ny Web Service på render.com
2. Koble til GitHub repo
3. Sett root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Legg til miljøvariabler:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `ALLOWED_ORIGINS=https://boligprosjekt.io`

### Railway.app

```bash
railway login
railway init
railway up
```

Legg til miljøvariabler i Railway dashboard.

---

## 💰 Kostnader

| Operasjon | Modell | Kostnad |
|-----------|--------|---------|
| Bildeanalyse | Claude Opus | ~$0.01-0.02 (~0.10-0.20 kr) |
| Bildegenerering | DALL-E 3 HD | ~$0.080 (~0.85 kr) |
| **Total per generering** | | **~$0.09-0.10 (~0.95-1.05 kr)** |

---

## 🔒 Sikkerhet

- ✅ API-nøkler lagres kun på server (ikke i frontend)
- ✅ CORS konfigurert for kun tillatte domener
- ✅ Sandbox kjører med begrenset minne og CPU
- ✅ Sandbox kjører som non-root bruker
- ✅ File upload begrenset til 10MB
- ✅ Kun bildefiler tillatt

---

## 📊 Logging

Backend logger detaljert informasjon:

```
🚀 BoligProsjekt AI Backend startet!
   Port: 3001
   Environment: development
   Claude API: ✅ Konfigurert
   OpenAI API: ✅ Konfigurert

📡 Endpoints:
   GET  /health
   POST /api/analyze
   POST /api/analyze-stream
   POST /api/generate-image

📸 Mottok bildeopplasting
🔍 Starter bildeanalyse...
   Stil: moderne
   Budsjett: 150000 kr
   Beskrivelse: Ingen
🔍 Analyserer bilde med Claude Opus...
   Bildestørrelse: 245.67 KB
✅ Claude Opus analyse fullført
   Tokens brukt: 1234 input, 567 output
✅ Analyse fullført
```

---

## 🐛 Feilsøking

### Backend starter ikke

**Problem:** `Error: Missing ANTHROPIC_API_KEY`

**Løsning:** Sett API-nøkkel i `.env` fil

### CORS error i frontend

**Problem:** `Access to fetch blocked by CORS policy`

**Løsning:** Legg til frontend URL i `ALLOWED_ORIGINS` i `.env`

### Sandbox fungerer ikke

**Problem:** Docker ikke installert

**Løsning:** Installer Docker Desktop eller sett `ENABLE_SANDBOX=false`

---

## 🎯 Forskjell fra gammel løsning

### ❌ GAMMEL LØSNING (Frontend-only)

```javascript
// Frontend kalte OpenAI direkte
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${window.OPENAI_API_KEY}` } // ⚠️ USIKKERT!
});
```

**Problemer:**
- ❌ API-nøkkel eksponert i frontend (kan stjeles)
- ❌ Bilde ble ikke faktisk sendt til AI (kun tekst-prompt)
- ❌ Samme statiske bilde hver gang
- ❌ Ingen streaming (lang ventetid)
- ❌ Ingen bildeoptimalisering

### ✅ NY LØSNING (Backend + Sandbox)

```javascript
// Frontend kaller sikker backend
const response = await fetch('http://localhost:3001/api/analyze-stream', {
  method: 'POST',
  body: formData // Inkluderer faktisk bilde
});
```

**Fordeler:**
- ✅ API-nøkler sikre på server
- ✅ Bilde sendes faktisk til Claude Opus (multimodal)
- ✅ Unikt AI-generert bilde hver gang
- ✅ Live streaming (se analyse i sanntid)
- ✅ Bildeoptimalisering i sandbox
- ✅ Profesjonell arkitektur (som vibecode.dev)

---

## 📞 Support

For spørsmål eller problemer:
- GitHub Issues: https://github.com/boligprojekt/boligprosjekt-startup/issues
- Email: dev@boligprosjekt.io

