# 🏠 BoligProsjekt - Moderne Oppussingsplanlegger

## 📋 Oversikt

BoligProsjekt er en moderne, brukervennlig nettapplikasjon som hjelper boligeiere med å planlegge oppussingsprosjekter basert på budsjett. Brukere kan legge inn et budsjett, velge prosjektkategori, og få smarte forslag til produkter fra ulike nettbutikker.

## ✨ Implementerte Funksjoner

### ✅ Ferdigstilt
- **Moderne, minimalistisk design** - Clean UI inspirert av Airbnb/Apple
- **Responsivt design** - Fungerer perfekt på mobil, tablet og desktop
- **Forside med budsjett-input** - Intuitiv brukerflyt
- **6 prosjektkategorier**:
  - 🍳 Kjøkken (8 produkter)
  - 🚿 Bad (9 produkter)
  - 📐 Gulv (7 produkter)
  - 🎨 Maling (8 produkter)
  - 💡 Belysning (7 produkter)
  - 🪟 Vinduer (6 produkter)
- **Smart budsjettfordeling** - Automatisk fordeling (70% materialer, 20% verktøy, 10% buffer)
- **Produktvisning** - 45+ realistiske produkter fra norske butikker:
  - Byggmax
  - OBS Bygg
  - IKEA
  - Montér
  - Elkjøp
- **Produktfiltrering** - Filtrer produkter etter butikk
- **Budsjettsammendrag** - Visuell oversikt over budsjettbruk med progress bar
- **Direkte lenker** - Alle produkter lenker til butikkenes nettsider
- **Innlogging/Registrering** - UI klar for Supabase-integrasjon
- **Profilside** - Oversikt over lagrede prosjekter

## 🛒 Produktdatabase

Applikasjonen inneholder 45+ realistiske produkter fra norske butikker:

### Kjøkken (8 produkter)
- IKEA: Skap, komplett kjøkken
- Byggmax: Benkeplate, vask, fliseklebemiddel
- OBS Bygg: Kjøkkenkran
- Montér: LED-list
- Elkjøp: Kjøkkenvifte

### Bad (9 produkter)
- Byggmax: Dusjkabinett, servant, fliser
- OBS Bygg: Dusjsett, membran tetting
- Montér: Toalett, baderomsvifte
- IKEA: Baderomskap
- Elkjøp: Gulvvarme

### Gulv (7 produkter)
- Byggmax: Laminat, vinyl, gulvlist, gulvlim
- OBS Bygg: Parkett, undergulv, overgangslist

### Maling (8 produkter)
- Byggmax: Jotun maling, Beckers takfarge, verktøy, tape, plastduk
- OBS Bygg: Jotun Butinox, malerkost, sparkel

### Belysning (7 produkter)
- IKEA: Taklampe, vegglampe
- Montér: LED-panel, dimmer, downlights
- Elkjøp: Spotlights, LED-stripe

### Vinduer (6 produkter)
- Byggmax: Trefritt vindu, beslag, montageskum, silikon
- OBS Bygg: Trefritt vindu, vinduslist

## 🛠 Tech Stack

### Frontend
- **Next.js 15.5.6** - React framework med App Router
- **TypeScript** - Type-sikkerhet
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React version

### Backend (Planlagt)
- **Supabase** - PostgreSQL database + autentisering
- **Next.js API Routes** - Serverless functions

### Deployment (Anbefalt)
- **Vercel** - Optimal for Next.js prosjekter

## 📁 Prosjektstruktur

```
/
├── app/
│   ├── layout.tsx          # Root layout med metadata
│   ├── page.tsx            # Forside med budsjett-input
│   ├── globals.css         # Global styling
│   ├── prosjekt/
│   │   └── page.tsx        # Prosjektresultat med produkter
│   ├── login/
│   │   └── page.tsx        # Innloggingsside
│   ├── registrer/
│   │   └── page.tsx        # Registreringsside
│   └── profil/
│       └── page.tsx        # Brukerprofilside
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🚀 Kom i gang

### Installasjon
```bash
npm install
```

### Kjør utviklingsserver
```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### Bygg for produksjon
```bash
npm run build
npm start
```

## 🔄 Neste Steg - Implementasjon

### 1. Database Setup (Supabase)
```sql
-- Brukere (håndteres av Supabase Auth)

-- Prosjekter
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  budget INTEGER NOT NULL,
  status TEXT DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Produkter
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  store TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  external_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lagrede produkter per prosjekt
CREATE TABLE project_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Supabase Autentisering

**Installer Supabase:**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Opprett `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Implementer autentisering i `app/login/page.tsx` og `app/registrer/page.tsx`**

### 3. API-integrasjoner for Produkter

**Alternativer:**
- **Web Scraping** - Bruk Puppeteer/Cheerio for å hente produktdata
- **Affiliate Networks** - Integrer med TradeTracker, Adtraction
- **Direkte API** - Kontakt butikker for API-tilgang
- **Manual Database** - Populer database med produkter manuelt

**Eksempel API route (`app/api/products/route.ts`):**
```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  // Hent produkter fra database eller eksterne APIer
  const products = await fetchProducts(category);
  
  return NextResponse.json(products);
}
```

### 4. Forbedringer

**Prioritert:**
- [ ] Implementer ekte autentisering med Supabase
- [ ] Koble til database for lagring av prosjekter
- [ ] Hent ekte produktdata fra butikker
- [ ] Implementer søkefunksjonalitet
- [ ] Legg til produktfiltrering (pris, butikk, rating)
- [ ] Implementer handlekurv-funksjonalitet
- [ ] Legg til produktsammenligning

**Nice-to-have:**
- [ ] AI-drevet budsjettoptimalisering
- [ ] Bildeopplasting for prosjekter
- [ ] Deling av prosjekter
- [ ] Prisvarslinger
- [ ] Anbefalinger basert på tidligere prosjekter
- [ ] Integrasjon med kalender for planlegging
- [ ] PDF-eksport av prosjektplan

### 5. SEO & Performance
- [ ] Legg til metadata for alle sider
- [ ] Implementer Open Graph tags
- [ ] Optimaliser bilder (Next.js Image component)
- [ ] Legg til sitemap.xml
- [ ] Implementer analytics (Google Analytics/Plausible)

### 6. Testing
- [ ] Sett opp Jest for unit testing
- [ ] Implementer Cypress for E2E testing
- [ ] Test responsivt design på ulike enheter

## 🎨 Design Prinsipper

- **Minimalistisk** - Fokus på innhold, ikke distraksjoner
- **Intuitivt** - Klar brukerflyt uten forvirring
- **Moderne** - Gradient bakgrunner, avrundede hjørner, shadows
- **Tilgjengelig** - God kontrast, lesbar tekst
- **Responsivt** - Fungerer på alle skjermstørrelser

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Sikkerhet

- Bruk environment variables for API-nøkler
- Implementer rate limiting
- Valider all brukerinput
- Bruk HTTPS i produksjon
- Implementer CSRF-beskyttelse

## 📊 Forretningsmodell (Fremtidig)

- **Affiliate-inntekter** - Provisjon fra butikker
- **Premium-abonnement** - Avanserte funksjoner
- **Annonsering** - Sponsede produkter
- **B2B** - Løsninger for håndverkere/arkitekter

## 🤝 Bidrag

Dette er et privat prosjekt, men åpent for forbedringer!

## 📄 Lisens

Privat prosjekt - Alle rettigheter forbeholdt

---

**Utviklet med ❤️ for norske boligeiere**

