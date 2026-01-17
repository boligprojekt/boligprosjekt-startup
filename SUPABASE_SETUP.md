# Supabase Oppsett for BoligProsjekt

## 📋 Steg-for-steg instruksjoner

### 1. Logg inn på Supabase
Gå til [https://supabase.com](https://supabase.com) og logg inn på din konto.

### 2. Åpne SQL Editor
1. Klikk på prosjektet ditt: `smeepfduuzxuhrptfczx`
2. Gå til **SQL Editor** i venstre meny
3. Klikk på **New Query**

### 3. Kjør Database Schema
1. Åpne filen `database-schema.sql` i dette prosjektet
2. Kopier **hele** innholdet
3. Lim inn i SQL Editor i Supabase
4. Klikk på **Run** (eller trykk Ctrl/Cmd + Enter)

Dette vil opprette:
- ✅ Tabeller for prosjekter, produkter, handlelister og brukerprofiler
- ✅ Row Level Security (RLS) policies for sikkerhet
- ✅ Indexes for bedre ytelse
- ✅ Sample produktdata (45+ produkter)

### 4. Aktiver Email Authentication
1. Gå til **Authentication** → **Providers** i Supabase
2. Sørg for at **Email** er aktivert
3. Under **Email Templates**, kan du tilpasse e-postmeldingene (valgfritt)

### 5. Konfigurer Email Settings (Valgfritt)
For produksjon, bør du sette opp din egen SMTP:
1. Gå til **Project Settings** → **Auth**
2. Scroll ned til **SMTP Settings**
3. Legg til dine SMTP-detaljer

For testing kan du bruke Supabase sin innebygde e-posttjeneste.

### 6. Verifiser Oppsettet
1. Gå til **Table Editor** i Supabase
2. Du skal nå se følgende tabeller:
   - `projects`
   - `products`
   - `shopping_list_items`
   - `user_profiles`

3. Klikk på `products` tabellen
4. Du skal se 45+ produkter fordelt på 6 kategorier

## 🔐 Sikkerhet

Prosjektet bruker Row Level Security (RLS) som betyr:
- ✅ Brukere kan kun se sine egne prosjekter
- ✅ Brukere kan kun endre sine egne data
- ✅ Produkter er offentlig tilgjengelige (read-only)
- ✅ All autentisering håndteres sikkert av Supabase

## 🧪 Test Oppsettet

1. Åpne `index.html` i nettleseren
2. Klikk på "Kom i gang" for å registrere en ny bruker
3. Fyll ut skjemaet og registrer deg
4. Sjekk e-posten din for bekreftelseslenke
5. Logg inn og opprett et prosjekt
6. Legg til produkter i handlelisten
7. Gå til "Mine prosjekter" for å se lagrede prosjekter

## 📊 Database Struktur

### Tabeller:

**projects**
- id (UUID)
- user_id (UUID) - referanse til auth.users
- name (VARCHAR)
- category (VARCHAR)
- budget (DECIMAL)
- created_at, updated_at (TIMESTAMP)

**products**
- id (SERIAL)
- name (VARCHAR)
- category (VARCHAR)
- store (VARCHAR)
- price (DECIMAL)
- icon (VARCHAR)
- description (TEXT)

**shopping_list_items**
- id (UUID)
- project_id (UUID) - referanse til projects
- product_id (INTEGER) - referanse til products
- quantity (INTEGER)
- added_at (TIMESTAMP)

**user_profiles**
- id (UUID) - referanse til auth.users
- full_name (VARCHAR)
- phone (VARCHAR)
- created_at, updated_at (TIMESTAMP)

## 🛠️ Feilsøking

### Problem: "relation does not exist"
**Løsning:** Kjør `database-schema.sql` på nytt i SQL Editor

### Problem: "permission denied"
**Løsning:** Sjekk at RLS policies er opprettet korrekt

### Problem: Kan ikke registrere bruker
**Løsning:** Sjekk at Email authentication er aktivert under Authentication → Providers

### Problem: Får ikke bekreftelses-e-post
**Løsning:** 
- Sjekk spam-mappen
- For testing, kan du deaktivere e-postbekreftelse under Authentication → Settings → "Enable email confirmations"

## 📝 Notater

- API-nøklene er allerede konfigurert i `config.js`
- Supabase URL: `https://smeepfduuzxuhrptfczx.supabase.co`
- Alle passord må være minst 6 tegn
- Produktdata kan oppdateres direkte i Supabase Table Editor

## 🚀 Neste Steg

Etter oppsettet er ferdig, kan du:
1. Legge til flere produkter i `products` tabellen
2. Tilpasse e-postmaler under Authentication → Email Templates
3. Sette opp custom domain for produksjon
4. Legge til flere kategorier og funksjoner

## 💡 Tips

- Bruk Supabase Table Editor for å enkelt legge til/redigere produkter
- Sjekk Logs under Project Settings for feilsøking
- Bruk SQL Editor for å kjøre custom queries
- Backup databasen regelmessig under Database → Backups

