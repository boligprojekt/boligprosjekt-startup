# Deployment Guide - boligprosjekt.io

## Oversikt
Du har domenet **boligprosjekt.io** hos One.com og vil gjøre nettsiden live.

## Anbefalt Løsning: Netlify + One.com DNS

### Del 1: Deploy til Netlify (Gratis Hosting)

#### Steg 1: Opprett Netlify-konto
1. Gå til https://www.netlify.com
2. Klikk "Sign up" og registrer deg (bruk GitHub, GitLab eller e-post)

#### Steg 2: Deploy nettsiden
**Metode A: Drag & Drop (Enklest)**
1. Logg inn på Netlify
2. Klikk på "Add new site" → "Deploy manually"
3. Dra og slipp disse filene/mappene:
   - `index.html`
   - `login.html`
   - `registrer.html`
   - `profil.html`
   - `prosjekt.html`
   - `om.html`
   - `styles.css`
   - `auth.css`
   - `om.css`
   - `profil.css`
   - `prosjekt.css`
   - `script.js`
   - `auth.js`
   - `profil.js`
   - `prosjekt.js`
   - `config.js`

**Metode B: Via GitHub (Anbefalt for fremtidige oppdateringer)**
1. Opprett et GitHub repository
2. Push koden til GitHub
3. I Netlify: "Add new site" → "Import an existing project"
4. Velg GitHub og ditt repository
5. Deploy settings:
   - Build command: (la stå tom)
   - Publish directory: `/`
6. Klikk "Deploy site"

#### Steg 3: Få Netlify URL
Etter deployment får du en URL som: `https://random-name-123.netlify.app`

### Del 2: Koble One.com domene til Netlify

#### Steg 1: I Netlify Dashboard
1. Gå til "Site settings" → "Domain management"
2. Klikk "Add custom domain"
3. Skriv inn: `boligprosjekt.io`
4. Klikk "Verify"
5. Netlify vil gi deg DNS-innstillinger

#### Steg 2: I One.com Dashboard
1. Logg inn på https://www.one.com
2. Gå til "Kontrollpanel" → "DNS-innstillinger" for boligprosjekt.io
3. Legg til disse DNS-postene:

**A Record:**
- Type: `A`
- Host: `@`
- Value: `75.2.60.5` (Netlify's Load Balancer IP)
- TTL: 3600

**CNAME Record for www:**
- Type: `CNAME`
- Host: `www`
- Value: `random-name-123.netlify.app` (din Netlify URL)
- TTL: 3600

**Alternativt (hvis Netlify gir deg andre instruksjoner):**
Følg de eksakte DNS-innstillingene som Netlify viser deg.

#### Steg 3: Vent på DNS-propagering
- DNS-endringer kan ta 1-48 timer (vanligvis 1-4 timer)
- Sjekk status på https://www.whatsmydns.net

#### Steg 4: Aktiver HTTPS i Netlify
1. Gå til "Site settings" → "Domain management" → "HTTPS"
2. Klikk "Verify DNS configuration"
3. Klikk "Provision certificate" (gratis SSL fra Let's Encrypt)
4. Huk av "Force HTTPS"

### Del 3: Verifiser at alt fungerer

Sjekk disse URLene:
- ✅ http://boligprosjekt.io → skal redirecte til https://boligprosjekt.io
- ✅ https://boligprosjekt.io → skal vise nettsiden
- ✅ https://www.boligprosjekt.io → skal vise nettsiden
- ✅ Supabase-tilkobling fungerer
- ✅ Innlogging fungerer
- ✅ Profilbilde-opplasting fungerer

---

## Alternativ 2: One.com Webhotell (Hvis du har webhotell)

Hvis du har kjøpt webhotell hos One.com:

### Steg 1: Last opp filer via FTP
1. Få FTP-tilgang fra One.com
2. Bruk FileZilla eller Cyberduck
3. Last opp alle HTML, CSS, JS-filer til `public_html` mappen

### Steg 2: Konfigurer domene
1. I One.com: Koble domenet til webhotellet
2. Nettsiden vil være tilgjengelig på boligprosjekt.io

**Ulempe:** One.com webhotell koster penger, Netlify er gratis.

---

## Anbefaling

**Bruk Netlify!** Det er:
- ✅ Gratis
- ✅ Raskere enn One.com webhotell
- ✅ Automatisk HTTPS
- ✅ Global CDN (rask over hele verden)
- ✅ Automatisk deployment fra GitHub
- ✅ Enkel å oppdatere

---

## Trenger du hjelp?

Si fra hvis du trenger hjelp med:
- Å sette opp GitHub repository
- Å konfigurere DNS hos One.com
- Å deploye til Netlify

