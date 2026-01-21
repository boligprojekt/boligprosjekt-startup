# 🚀 Quick Start: AI Backend

**Kom i gang med profesjonell AI-backend på 5 minutter!**

---

## ⚡ Rask start (Lokal utvikling)

### 1. Installer dependencies

```bash
cd backend
npm install
```

### 2. Sett opp API-nøkler

Opprett `.env` fil:

```bash
cp .env.example .env
```

Rediger `.env` og legg til dine API-nøkler:

```env
# Anthropic Claude (ANBEFALT)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# OpenAI (for DALL-E)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Server
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,https://boligprosjekt.io
```

**Hvor får jeg API-nøkler?**
- **Claude:** https://console.anthropic.com/
- **OpenAI:** https://platform.openai.com/api-keys

### 3. Start backend

```bash
npm run dev
```

Du skal se:

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
```

### 4. Test backend

Åpne ny terminal:

```bash
# Health check
curl http://localhost:3001/health

# Skal returnere:
# {"status":"ok","timestamp":"...","service":"BoligProsjekt AI Backend","version":"1.0.0"}
```

### 5. Oppdater frontend

I `deploy/config.js`, legg til:

```javascript
// Backend URL
window.AI_BACKEND_URL = 'http://localhost:3001';
```

### 6. Test full flow

1. Åpne `boligprosjekt.io/kjokken-inspirasjon.html`
2. Last opp bilde av et rom
3. Velg stil og budsjett
4. Klikk "Generer AI-inspirasjon →"
5. Se live streaming av analyse!

---

## 🌐 Deploy til produksjon

### Render.com (Anbefalt - Gratis tier)

1. **Opprett konto:** https://render.com/

2. **Ny Web Service:**
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Legg til miljøvariabler:**
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   OPENAI_API_KEY=sk-proj-...
   ALLOWED_ORIGINS=https://boligprosjekt.io
   NODE_ENV=production
   ```

4. **Deploy!**

5. **Oppdater frontend:**
   ```javascript
   // I deploy/config.js
   window.AI_BACKEND_URL = 'https://your-app.onrender.com';
   ```

### Railway.app (Alternativ)

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

Legg til miljøvariabler i Railway dashboard.

---

## 🐳 Docker (Valgfritt)

### Bygg og kjør backend i Docker

```bash
cd backend

# Bygg image
docker build -t boligprosjekt-backend .

# Kjør container
docker run -p 3001:3001 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e OPENAI_API_KEY=sk-proj-... \
  boligprosjekt-backend
```

### Bygg og kjør sandbox

```bash
cd backend/sandbox

# Bygg image
docker build -t boligprosjekt-sandbox .

# Test sandbox
echo '{"type":"health-check"}' | docker run -i boligprosjekt-sandbox
```

---

## 📊 Test API med curl

### Analyser bilde (standard)

```bash
curl -X POST http://localhost:3001/api/analyze \
  -F "image=@/path/to/image.jpg" \
  -F "style=moderne" \
  -F "budget=150000"
```

### Analyser bilde (streaming)

```bash
curl -X POST http://localhost:3001/api/analyze-stream \
  -F "image=@/path/to/image.jpg" \
  -F "style=moderne" \
  -F "budget=150000" \
  --no-buffer
```

### Generer bilde

```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A modern Scandinavian kitchen with white cabinets",
    "style": "moderne",
    "budget": 150000
  }'
```

---

## 🐛 Feilsøking

### Backend starter ikke

**Problem:** `Error: Missing ANTHROPIC_API_KEY`

**Løsning:** Sjekk at `.env` fil eksisterer og har riktig API-nøkkel

### CORS error

**Problem:** `Access to fetch blocked by CORS policy`

**Løsning:** Legg til frontend URL i `ALLOWED_ORIGINS` i `.env`

### Timeout ved streaming

**Problem:** Streaming stopper etter 30 sekunder

**Løsning:** Øk timeout i backend:
```javascript
// I server.js
app.use((req, res, next) => {
  req.setTimeout(120000); // 2 minutter
  next();
});
```

---

## 💰 Kostnader

| Operasjon | Kostnad |
|-----------|---------|
| Claude Opus analyse | ~0.10-0.20 kr |
| DALL-E 3 HD generering | ~0.85 kr |
| **Total per generering** | **~0.95-1.05 kr** |

**Estimat for 100 brukere/dag:**
- 100 genereringer × 1 kr = 100 kr/dag
- 3000 kr/måned

---

## 📚 Neste steg

- [ ] Les full dokumentasjon: `backend/README.md`
- [ ] Sett opp monitoring (Sentry, LogRocket)
- [ ] Legg til rate limiting
- [ ] Implementer caching
- [ ] Legg til brukerautentisering
- [ ] Sett opp CI/CD pipeline

---

## 📞 Hjelp

Trenger du hjelp?
- GitHub Issues: https://github.com/boligprojekt/boligprosjekt-startup/issues
- Email: dev@boligprosjekt.io

