# BoligProsjekt Abonnementssystem

Komplett abonnementssystem for kunder og håndverkere.

---

## 📋 OVERSIKT

### KUNDEABONNEMENTER (For boligeiere)

| Plan | Pris | Prosjekter | AI Chat | Håndverkerhjelp |
|------|------|------------|---------|-----------------|
| **Gratis** | 0 kr/mnd | 1 | ❌ | ❌ |
| **Premium** | 249 kr/mnd | 5 | ✅ | ✅ |
| **Pro** | 799 kr/mnd | Ubegrenset | ✅ | ✅ + Veiledning |

### HÅNDVERKERABONNEMENTER

| Plan | Pris | Synlighet | Prioritering | Leads |
|------|------|-----------|--------------|-------|
| **Basic** | 299 kr/mnd | Standard | ❌ | 0 |
| **Pro** | 299 kr/mnd | Premium | ✅ Øverst | 0 |
| **Pro+** | 699 kr/mnd | Premium | ✅ Øverst | 2/mnd |

---

## 🗂️ FILER OPPRETTET

### Frontend (deploy/)
- `pricing.html` - Pricing page med toggle mellom kunde/håndverker
- `pricing.js` - Logikk for planvalg
- `handverker-profil.html` - Håndverkerprofil med statistikk
- `handverker-profil.js` - Profilhåndtering
- `handverker-prosjekter.html` - Prosjektoversikt for håndverkere
- `handverker-prosjekter.js` - Prosjektlisting og filtrering
- `sok-handverkere.html` - Håndverkersøk for kunder
- `sok-handverkere.js` - Søk og prioritering
- `subscription-check.js` - Abonnementskontroll og oppgraderingsmodaler

### Database
- `database/schema.sql` - Komplett database-skjema

---

## 🔧 IMPLEMENTERTE FUNKSJONER

### ✅ Abonnementskontroll
- Sjekk før prosjektopprettelse
- Sjekk før AI Chat tilgang
- Sjekk før håndverkersøk
- Oppgraderingsmodaler med call-to-action

### ✅ Håndverkerprioritering
Algoritme i `sok-handverkere.js`:
```javascript
craftsmen.sort((a, b) => {
    const tierOrder = { 'pro_plus': 3, 'pro': 2, 'basic': 1 };
    return tierOrder[b.subscription_tier] - tierOrder[a.subscription_tier];
});
```

### ✅ Prosjektbegrensning
- Gratis: 1 prosjekt
- Premium: 5 prosjekter
- Pro: Ubegrenset

### ✅ Lead-system (Pro+ håndverkere)
- 2 garanterte leads per måned
- Automatisk tildeling (TODO: Backend implementasjon)

---

## 🚀 NESTE STEG

### 1. Stripe Integrasjon
```bash
npm install stripe
```

Opprett `backend/services/stripe.js`:
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Opprett Stripe produkter og priser
// Håndter webhooks for betalingsbekreftelser
```

### 2. Database Setup
```bash
# Kjør schema.sql i PostgreSQL
psql -U postgres -d boligprosjekt -f database/schema.sql
```

### 3. Backend API Endpoints

Opprett i `backend/server.js`:

```javascript
// Hent brukerens abonnement
app.get('/api/user/subscription', async (req, res) => {
  // Hent fra database
});

// Opprett/oppdater abonnement
app.post('/api/subscriptions/create', async (req, res) => {
  // Opprett Stripe subscription
  // Lagre i database
});

// Søk håndverkere (med prioritering)
app.get('/api/craftsmen/search', async (req, res) => {
  // Hent fra database
  // Sorter basert på subscription_tier
});

// Hent tilgjengelige prosjekter for håndverker
app.get('/api/projects/available', async (req, res) => {
  // Filtrer basert på håndverkerens abonnement
});

// Stripe webhooks
app.post('/api/webhooks/stripe', async (req, res) => {
  // Håndter payment_intent.succeeded
  // Oppdater user_subscriptions
});
```

### 4. Firebase/Supabase Auth Integrasjon

Oppdater `subscription-check.js`:
```javascript
async function getUserSubscription() {
    const user = firebase.auth().currentUser;
    const response = await fetch(`/api/user/subscription?userId=${user.uid}`);
    return await response.json();
}
```

### 5. Testing

Test alle flows:
- [ ] Gratis bruker prøver å opprette prosjekt #2 → Oppgraderingsmodal
- [ ] Gratis bruker prøver AI Chat → Oppgraderingsmodal
- [ ] Premium bruker oppretter 5 prosjekter → OK
- [ ] Premium bruker bruker AI Chat → OK
- [ ] Pro+ håndverker vises øverst i søk
- [ ] Pro+ håndverker får 2 leads per måned

---

## 💳 STRIPE SETUP

### 1. Opprett Stripe-konto
https://dashboard.stripe.com/register

### 2. Opprett produkter i Stripe Dashboard

**Kundeabonnementer:**
- Gratis (0 kr) - Ingen Stripe produkt nødvendig
- Premium (249 kr/mnd) - Recurring price
- Pro (799 kr/mnd) - Recurring price

**Håndverkerabonnementer:**
- Basic (299 kr/mnd)
- Pro (299 kr/mnd)
- Pro+ (699 kr/mnd)

### 3. Legg til Stripe nøkler i `.env`
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Test med Stripe test cards
```
4242 4242 4242 4242 - Success
4000 0000 0000 0002 - Decline
```

---

## 📊 DATABASE QUERIES

### Hent brukerens abonnement
```sql
SELECT 
    us.*, 
    sp.name as plan_name,
    sp.features,
    sp.limits
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.user_id = $1 AND us.status = 'active';
```

### Hent håndverkere (prioritert)
```sql
SELECT 
    cp.*,
    sp.limits->>'priority_level' as priority
FROM craftsman_profiles cp
JOIN user_subscriptions us ON cp.user_id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE cp.profession = $1
ORDER BY (sp.limits->>'priority_level')::int DESC;
```

### Tildel lead til Pro+ håndverker
```sql
INSERT INTO project_leads (project_id, craftsman_user_id, lead_type)
VALUES ($1, $2, 'guaranteed');
```

---

## 🎯 BRUKERFLYT

### Kunde (Boligeier)
1. Registrer → Gratis plan automatisk
2. Opprett 1 prosjekt → OK
3. Prøv å opprette prosjekt #2 → Oppgraderingsmodal
4. Oppgrader til Premium → Stripe checkout
5. Nå kan opprette 5 prosjekter + bruke AI Chat

### Håndverker
1. Registrer → Velg abonnement
2. Fyll ut profil
3. Se tilgjengelige prosjekter
4. Kontakt kunder (basert på abonnement)
5. Pro+ får 2 garanterte leads/mnd

---

## 📝 TODO

- [ ] Implementer Stripe betalingsintegrasjon
- [ ] Koble til ekte database (PostgreSQL/Supabase)
- [ ] Implementer Firebase/Supabase auth
- [ ] Lag admin dashboard for abonnementshåndtering
- [ ] Implementer lead-tildeling for Pro+ håndverkere
- [ ] Legg til email-notifikasjoner ved abonnementsendringer
- [ ] Implementer nedgradering/kansellering
- [ ] Legg til fakturahåndtering

---

**Status:** Frontend komplett, backend API og Stripe integrasjon gjenstår.

