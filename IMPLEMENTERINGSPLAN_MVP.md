# 🚀 IMPLEMENTERINGSPLAN - MVP (4-6 uker)

**Mål:** Lansere Norges smarteste oppussingsplanlegger med kjernefunksjonalitet

---

## UKE 1: Database og Grunnlag

### Dag 1-2: Forbedre produktdatabase

**Oppgaver:**
- [ ] Utvid `products` tabell med nye felter:
  - `risk_level` (low/medium/high/critical)
  - `diy_friendly` (boolean)
  - `recommended_quality` (budget/standard/premium)
  - `long_term_value` (1-5 stjerner)
  - `common_mistakes` (text)
  - `expert_tip` (text)

- [ ] Legg til 100+ produkter med kvalitetsnivåer:
  - Budsjett: 30 produkter per kategori
  - Standard: 30 produkter per kategori
  - Premium: 30 produkter per kategori

- [ ] Implementer "Trygt valg"-logikk:
  - Produkter brukt i 100+ prosjekter
  - 4+ stjerner rating
  - God garanti

**SQL-script:**
```sql
ALTER TABLE products ADD COLUMN risk_level VARCHAR(20) DEFAULT 'low';
ALTER TABLE products ADD COLUMN diy_friendly BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN recommended_quality VARCHAR(20);
ALTER TABLE products ADD COLUMN long_term_value INTEGER DEFAULT 3;
ALTER TABLE products ADD COLUMN common_mistakes TEXT;
ALTER TABLE products ADD COLUMN expert_tip TEXT;
ALTER TABLE products ADD COLUMN times_used INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN avg_rating DECIMAL(2,1) DEFAULT 0;
```

### Dag 3-4: Ny database-struktur for planlegger

**Oppgaver:**
- [ ] Opprett `project_plans` tabell:
  - `id`, `project_id`, `user_id`
  - `housing_type` (leilighet/enebolig/rekkehus)
  - `build_year` (<1950/1950-1980/1980-2000/>2000)
  - `room_type` (kjokken/bad/stue/etc)
  - `room_size` (kvm)
  - `current_condition` (poor/ok/good)
  - `project_scope` (refresh/partial/total)
  - `diy_level` (none/beginner/experienced)
  - `timeline` (weeks)

- [ ] Opprett `project_steps` tabell:
  - `id`, `project_plan_id`
  - `step_number`, `title`, `description`
  - `estimated_cost`, `estimated_time`
  - `risk_level`, `requires_professional`
  - `can_diy`, `order_priority`

- [ ] Opprett `budget_allocation` tabell:
  - `id`, `project_plan_id`
  - `category` (labor/materials/buffer)
  - `percentage`, `amount`
  - `explanation`, `can_save_here`

**SQL-script:**
```sql
CREATE TABLE project_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    housing_type VARCHAR(50),
    build_year VARCHAR(50),
    room_type VARCHAR(50),
    room_size DECIMAL(10,2),
    current_condition VARCHAR(20),
    project_scope VARCHAR(20),
    diy_level VARCHAR(20),
    timeline INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
    step_number INTEGER,
    title VARCHAR(255),
    description TEXT,
    estimated_cost DECIMAL(10,2),
    estimated_time INTEGER,
    risk_level VARCHAR(20),
    requires_professional BOOLEAN,
    can_diy BOOLEAN,
    order_priority INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE budget_allocation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
    category VARCHAR(50),
    percentage DECIMAL(5,2),
    amount DECIMAL(10,2),
    explanation TEXT,
    can_save_here BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Dag 5: Budsjettfordelingslogikk

**Oppgaver:**
- [ ] Lag `budgetCalculator.ts` utility:
  - Beregn 70/20/10 fordeling (materialer/verktøy/buffer)
  - Juster basert på romtype (bad = mer håndverkere)
  - Juster basert på egeninnsats (mer DIY = mindre labor)

- [ ] Lag `riskAnalyzer.ts` utility:
  - Identifiser høyrisiko-områder
  - Generer advarsler
  - Foreslå hvor man ikke bør spare

**Eksempel-kode:**
```typescript
// budgetCalculator.ts
export function calculateBudgetAllocation(
  totalBudget: number,
  roomType: string,
  diyLevel: string
) {
  let laborPercentage = 0.4; // 40% default
  let materialsPercentage = 0.45; // 45% default
  let bufferPercentage = 0.15; // 15% default

  // Juster basert på romtype
  if (roomType === 'bad') {
    laborPercentage = 0.5; // Bad krever mer fagfolk
    materialsPercentage = 0.35;
  } else if (roomType === 'maling') {
    laborPercentage = 0.2; // Maling kan gjøres selv
    materialsPercentage = 0.6;
  }

  // Juster basert på DIY-nivå
  if (diyLevel === 'experienced') {
    laborPercentage -= 0.15;
    materialsPercentage += 0.1;
    bufferPercentage += 0.05;
  }

  return {
    labor: totalBudget * laborPercentage,
    materials: totalBudget * materialsPercentage,
    buffer: totalBudget * bufferPercentage,
    breakdown: {
      laborPercentage,
      materialsPercentage,
      bufferPercentage
    }
  };
}
```

---

## UKE 2: Oppussingsplanlegger (Frontend)

### Dag 6-7: Design og UI-komponenter

**Oppgaver:**
- [ ] Design planlegger-flyt (Figma/sketch)
- [ ] Lag `PlannerStep` komponent (gjenbrukbar)
- [ ] Lag `ProgressBar` komponent (viser steg 1/4, 2/4, etc)
- [ ] Lag `InfoCard` komponent (for tips og advarsler)

### Dag 8-9: Steg 1-2 (Boliginfo og Rom)

**Oppgaver:**
- [ ] Lag `/planlegger` side
- [ ] Implementer Steg 1: Boliginfo
  - Velg boligtype (cards med ikoner)
  - Velg byggeår (dropdown)
  - Eier/leier (toggle)

- [ ] Implementer Steg 2: Rom
  - Velg rom (grid med ikoner)
  - Input størrelse (kvm)
  - Velg nåværende standard (cards med bilder)

**Eksempel-kode:**
```typescript
// app/planlegger/page.tsx
'use client';

import { useState } from 'react';

export default function Planlegger() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    housingType: '',
    buildYear: '',
    ownership: 'owner',
    roomType: '',
    roomSize: 0,
    currentCondition: ''
  });

  return (
    <div className="max-w-4xl mx-auto py-12">
      <ProgressBar currentStep={step} totalSteps={4} />
      
      {step === 1 && <Step1Boliginfo data={formData} setData={setFormData} />}
      {step === 2 && <Step2Rom data={formData} setData={setFormData} />}
      {step === 3 && <Step3Budsjett data={formData} setData={setFormData} />}
      {step === 4 && <Step4Egeninnsats data={formData} setData={setFormData} />}
      
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>← Tilbake</button>
        )}
        {step < 4 && (
          <button onClick={() => setStep(step + 1)}>Neste →</button>
        )}
        {step === 4 && (
          <button onClick={handleGeneratePlan}>Generer plan →</button>
        )}
      </div>
    </div>
  );
}
```

### Dag 10: Steg 3-4 (Budsjett og Egeninnsats)

**Oppgaver:**
- [ ] Implementer Steg 3: Budsjett
  - Input budsjett
  - Vis veiledende priser for valgt rom
  - Slider for budsjett-range

- [ ] Implementer Steg 4: Egeninnsats
  - Checkboxes for hva brukeren kan selv
  - Erfaring-level (nybegynner/erfaren)
  - Tidsperspektiv

---

## UKE 3: Plan-generator og Logikk

### Dag 11-12: Steg-for-steg generator

**Oppgaver:**
- [ ] Lag `planGenerator.ts` utility
- [ ] Implementer rom-spesifikke templates:
  - Bad: 7 faser (planlegging → riving → grovarbeid → fliser → montering → finish)
  - Kjøkken: 6 faser
  - Gulv: 4 faser
  - Maling: 3 faser

- [ ] Generer steg basert på:
  - Romtype
  - Prosjektomfang
  - DIY-nivå
  - Budsjett

**Eksempel-kode:**
```typescript
// utils/planGenerator.ts
export function generateProjectSteps(
  roomType: string,
  scope: string,
  diyLevel: string,
  budget: number
) {
  const templates = {
    bad: [
      {
        step: 1,
        title: 'Planlegging',
        description: 'Tegn opp rommet, bestill håndverkere',
        estimatedCost: 0,
        estimatedTime: 1,
        riskLevel: 'low',
        requiresProfessional: false,
        canDIY: true,
        priority: 1
      },
      {
        step: 2,
        title: 'Riving',
        description: 'Riv ut gammelt, sjekk rør og avløp',
        estimatedCost: budget * 0.05,
        estimatedTime: 1,
        riskLevel: 'medium',
        requiresProfessional: false,
        canDIY: diyLevel !== 'none',
        priority: 2
      },
      {
        step: 3,
        title: 'Rørleggerarbeid',
        description: 'Ny rørlegging og avløp',
        estimatedCost: budget * 0.2,
        estimatedTime: 2,
        riskLevel: 'critical',
        requiresProfessional: true,
        canDIY: false,
        priority: 3
      },
      // ... flere steg
    ],
    kjokken: [
      // Kjøkken-spesifikke steg
    ],
    // ... andre rom
  };

  return templates[roomType] || [];
}
```

### Dag 13-14: Produktanbefalingsmotor

**Oppgaver:**
- [ ] Lag `recommendationEngine.ts`
- [ ] Implementer logikk for å velge 3-5 produkter:
  - Filtrer på romtype
  - Filtrer på kvalitetsnivå (basert på budsjett)
  - Prioriter "Trygt valg"
  - Sorter etter verdi

- [ ] Lag "Hvorfor anbefales dette?"-logikk:
  - Basert på antall brukere
  - Basert på rating
  - Basert på pris/kvalitet

**Eksempel-kode:**
```typescript
// utils/recommendationEngine.ts
export async function getRecommendedProducts(
  roomType: string,
  budget: number,
  qualityLevel: string
) {
  // Hent alle produkter for romtype
  const { data: allProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', roomType);

  // Filtrer på kvalitetsnivå
  const filtered = allProducts.filter(p =>
    p.quality_level === qualityLevel
  );

  // Prioriter "Trygt valg"
  const safeChoices = filtered.filter(p =>
    p.times_used >= 100 && p.avg_rating >= 4
  );

  // Velg topp 3-5 produkter
  const recommended = safeChoices
    .sort((a, b) => {
      // Sorter etter verdi (rating / pris)
      const valueA = a.avg_rating / (a.price / 1000);
      const valueB = b.avg_rating / (b.price / 1000);
      return valueB - valueA;
    })
    .slice(0, 5);

  return recommended.map(product => ({
    ...product,
    reason: generateRecommendationReason(product),
    badge: product.times_used >= 100 ? 'Trygt valg' : null
  }));
}

function generateRecommendationReason(product: any) {
  if (product.times_used >= 500) {
    return `Brukt i ${product.times_used}+ prosjekter`;
  }
  if (product.avg_rating >= 4.5) {
    return `Høyt vurdert (${product.avg_rating}/5)`;
  }
  return 'God verdi for pengene';
}
```

### Dag 15: Risikoanalyse og advarsler

**Oppgaver:**
- [ ] Lag `riskAnalyzer.ts`
- [ ] Implementer advarselslogikk:
  - Sjekk om bruker vil gjøre kritiske oppgaver selv
  - Sjekk om budsjett er for lavt
  - Sjekk om bruker sparer på feil ting

- [ ] Generer advarsler:
  - Rød: Kritisk risiko (stopp!)
  - Gul: Moderat risiko (vurder)
  - Grønn: Lav risiko (OK)

**Eksempel-kode:**
```typescript
// utils/riskAnalyzer.ts
export function analyzeRisks(
  projectPlan: any,
  selectedProducts: any[]
) {
  const warnings = [];

  // Sjekk om bruker vil gjøre kritiske oppgaver selv
  if (projectPlan.roomType === 'bad' && projectPlan.diyLevel !== 'none') {
    const criticalSteps = projectPlan.steps.filter(s =>
      s.riskLevel === 'critical' && s.canDIY
    );

    if (criticalSteps.length > 0) {
      warnings.push({
        level: 'critical',
        title: 'Høyrisiko-advarsel',
        message: 'Du har valgt å gjøre rørleggerarbeid selv. Dette kan føre til vannskader som koster 100 000+ kr å fikse.',
        recommendation: 'Bruk sertifisert rørlegger (ca 25 000 kr)'
      });
    }
  }

  // Sjekk om budsjett er for lavt
  const estimatedCost = projectPlan.steps.reduce((sum, s) =>
    sum + s.estimatedCost, 0
  );

  if (projectPlan.budget < estimatedCost * 0.8) {
    warnings.push({
      level: 'warning',
      title: 'Budsjett kan være for lavt',
      message: `Estimert kostnad er ${estimatedCost} kr, men budsjettet ditt er ${projectPlan.budget} kr.`,
      recommendation: 'Vurder å øke budsjettet eller redusere omfang'
    });
  }

  // Sjekk om bruker sparer på feil ting
  const cheapMembraneProduct = selectedProducts.find(p =>
    p.name.includes('membran') && p.quality_level === 'budsjett'
  );

  if (cheapMembraneProduct) {
    warnings.push({
      level: 'critical',
      title: 'Ikke spar på membran!',
      message: 'Du har valgt budsjett-membran. Dette er høyrisiko for vannskader.',
      recommendation: 'Velg minimum standard kvalitet på membran'
    });
  }

  return warnings;
}
```

---

## UKE 4: Prosjektplan-side

### Dag 16-17: Prosjektplan UI

**Oppgaver:**
- [ ] Lag `/prosjektplan/[id]` side
- [ ] Vis generert plan:
  - Budsjettfordeling (visuell)
  - Steg-for-steg guide (timeline)
  - Produktanbefalinger (cards)
  - Advarsler (alert boxes)

- [ ] Implementer interaktive elementer:
  - Klikk på steg for detaljer
  - Hover på budsjett for forklaring
  - Toggle mellom kvalitetsnivåer

**Eksempel-kode:**
```typescript
// app/prosjektplan/[id]/page.tsx
export default async function ProsjektplanPage({ params }) {
  const { id } = params;

  // Hent prosjektplan fra database
  const { data: plan } = await supabase
    .from('project_plans')
    .select('*, project_steps(*), budget_allocation(*)')
    .eq('id', id)
    .single();

  const warnings = analyzeRisks(plan, plan.selectedProducts);
  const recommendations = await getRecommendedProducts(
    plan.roomType,
    plan.budget,
    plan.qualityLevel
  );

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Advarsler */}
      {warnings.length > 0 && (
        <WarningsSection warnings={warnings} />
      )}

      {/* Budsjettfordeling */}
      <BudgetAllocationCard allocation={plan.budget_allocation} />

      {/* Steg-for-steg guide */}
      <StepByStepGuide steps={plan.project_steps} />

      {/* Produktanbefalinger */}
      <ProductRecommendations products={recommendations} />

      {/* Handleliste */}
      <ShoppingList projectId={plan.project_id} />

      {/* CTA */}
      <div className="mt-12 text-center">
        <button className="btn-primary">
          Lagre prosjekt
        </button>
      </div>
    </div>
  );
}
```

### Dag 18-19: Budsjettvisualisering

**Oppgaver:**
- [ ] Lag `BudgetAllocationCard` komponent
- [ ] Vis budsjettfordeling med:
  - Pie chart eller bar chart
  - Forklaring for hver kategori
  - "Spar her / Ikke spar her"-indikatorer

- [ ] Implementer "Hva skjer hvis"-kalkulator:
  - Slider for å justere budsjett
  - Vis konsekvenser av endringer

### Dag 20: Steg-for-steg guide UI

**Oppgaver:**
- [ ] Lag `StepByStepGuide` komponent
- [ ] Vis steg som timeline:
  - Nummererte steg
  - Estimert tid og kostnad
  - Ikon for risiko-nivå
  - Badge for "Kan gjøres selv" / "Krever fagfolk"

- [ ] Implementer ekspanderbare detaljer:
  - Klikk på steg for mer info
  - Vis vanlige feil
  - Vis eksperttips

---

## UKE 5: Dashboard og Handleliste

### Dag 21-22: "Min Oppussing" Dashboard

**Oppgaver:**
- [ ] Lag `/dashboard` side
- [ ] Vis alle brukerens prosjekter:
  - Aktive prosjekter (med fremdrift)
  - Lagrede prosjekter
  - Fullførte prosjekter

- [ ] Implementer prosjektkort:
  - Tittel og romtype
  - Fremdriftbar
  - Budsjett brukt / totalt
  - Neste steg

**Eksempel-kode:**
```typescript
// app/dashboard/page.tsx
export default async function Dashboard() {
  const user = await getCurrentUser();

  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_plans(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const activeProjects = projects.filter(p => p.status === 'active');
  const savedProjects = projects.filter(p => p.status === 'saved');

  return (
    <div className="max-w-7xl mx-auto py-12">
      <h1>Mine prosjekter</h1>

      {/* Aktive prosjekter */}
      <section>
        <h2>Aktive prosjekter</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {activeProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Lagrede prosjekter */}
      <section className="mt-12">
        <h2>Lagrede prosjekter</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {savedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

### Dag 23-24: Smart handleliste

**Oppgaver:**
- [ ] Lag `ShoppingList` komponent
- [ ] Implementer prioritering:
  - Rød: Kjøp nå (trengs denne uken)
  - Gul: Kjøp snart (trengs neste uke)
  - Grønn: Kjøp senere (trengs om 2+ uker)

- [ ] Gruppér etter butikk:
  - Vis totalpris per butikk
  - Foreslå å kjøpe alt fra samme butikk (spar frakt)

- [ ] Implementer funksjoner:
  - Huk av kjøpte produkter
  - Legg til egne produkter
  - Eksporter til PDF

**Eksempel-kode:**
```typescript
// components/ShoppingList.tsx
export function ShoppingList({ projectId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadShoppingList();
  }, [projectId]);

  async function loadShoppingList() {
    const { data } = await supabase
      .from('shopping_list_items')
      .select('*, products(*)')
      .eq('project_id', projectId);

    // Prioriter basert på prosjektfase
    const prioritized = prioritizeItems(data);
    setItems(prioritized);
  }

  function prioritizeItems(items) {
    // Logikk for å prioritere basert på når produktet trengs
    return items.map(item => ({
      ...item,
      priority: calculatePriority(item),
      neededBy: calculateNeededDate(item)
    }));
  }

  return (
    <div className="shopping-list">
      <h2>Handleliste</h2>

      {/* Kjøp nå */}
      <section>
        <h3 className="text-red-600">🔴 KJØP NÅ (trengs denne uken)</h3>
        {items.filter(i => i.priority === 'high').map(item => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </section>

      {/* Kjøp snart */}
      <section>
        <h3 className="text-yellow-600">🟡 KJØP SNART (trengs neste uke)</h3>
        {items.filter(i => i.priority === 'medium').map(item => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </section>

      {/* Kjøp senere */}
      <section>
        <h3 className="text-green-600">🟢 KJØP SENERE (trengs om 2+ uker)</h3>
        {items.filter(i => i.priority === 'low').map(item => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </section>

      {/* Gruppér etter butikk */}
      <section className="mt-8">
        <h3>Gruppér etter butikk</h3>
        <StoreGrouping items={items} />
      </section>
    </div>
  );
}
```

### Dag 25: Fremdriftsplan

**Oppgaver:**
- [ ] Lag `ProgressTimeline` komponent
- [ ] Vis kalender-visning:
  - Uke-for-uke plan
  - Markér nåværende uke
  - Vis kommende oppgaver

- [ ] Implementer fremdriftstracking:
  - Huk av fullførte steg
  - Oppdater fremdriftbar
  - Beregn estimert ferdigdato

---

## UKE 6: Polish, Testing og Lansering

### Dag 26-27: UI/UX forbedringer

**Oppgaver:**
- [ ] Responsivt design (mobil/tablet/desktop)
- [ ] Animasjoner og transitions
- [ ] Loading states
- [ ] Error handling
- [ ] Accessibility (WCAG 2.1)

### Dag 28: Testing

**Oppgaver:**
- [ ] Manuell testing av alle flyter
- [ ] Test på ulike enheter
- [ ] Test med ekte brukere (5-10 personer)
- [ ] Fiks kritiske bugs

### Dag 29: Innhold og copy

**Oppgaver:**
- [ ] Skriv alle tekster (klart språk, ikke bransjespråk)
- [ ] Lag eksperttips for alle steg
- [ ] Skriv "vanlige feil" for alle rom
- [ ] Lag FAQ-seksjon

### Dag 30: Lansering

**Oppgaver:**
- [ ] Deploy til produksjon (Vercel)
- [ ] Sett opp analytics (Google Analytics / Plausible)
- [ ] Sett opp error tracking (Sentry)
- [ ] Lag landingsside med CTA
- [ ] Annonsér på sosiale medier

---

## PRIORITERT FEATURE-LISTE

### MUST HAVE (MVP):
1. ✅ Oppussingsplanlegger (4 steg)
2. ✅ Budsjettfordeling med forklaring
3. ✅ Steg-for-steg guide
4. ✅ Produktanbefalinger (3-5 per kategori)
5. ✅ "Trygt valg"-badge
6. ✅ Risikoadvarsler
7. ✅ Handleliste med prioritering
8. ✅ Dashboard for lagrede prosjekter

### SHOULD HAVE (Fase 2):
- Avanserte kalkulatorer (maling, fliser)
- Produktsammenligning
- Bildeopplasting
- PDF-eksport
- Deling av prosjekter

### NICE TO HAVE (Fase 3):
- AI-drevne anbefalinger
- Bildegjenkjenning
- Chatbot-assistent
- 3D-visualisering

---

## SUKSESSMÅL (MVP)

**Uke 1 etter lansering:**
- 50 registrerte brukere
- 20 opprettede prosjekter
- 5 produktkjøp via affiliate

**Måned 1:**
- 200 registrerte brukere
- 100 opprettede prosjekter
- 30 produktkjøp via affiliate
- 5 000 kr i affiliate-inntekt

**Måned 3:**
- 1 000 registrerte brukere
- 500 opprettede prosjekter
- 200 produktkjøp via affiliate
- 50 000 kr i affiliate-inntekt

---

## NESTE STEG - START I DAG!

**I dag (nå):**
1. Les gjennom hele strategidokumentet
2. Sett opp utviklingsmiljø
3. Start med database-endringer (Uke 1, Dag 1)

**I morgen:**
4. Fortsett med produktdatabase
5. Legg til 50 produkter med nye felter

**Denne uken:**
6. Fullfør Uke 1 (Database og Grunnlag)
7. Start på Uke 2 (Planlegger frontend)

**Neste uke:**
8. Fullfør planlegger-UI
9. Start på plan-generator logikk

---

## RESSURSER OG VERKTØY

**Design:**
- Figma (for wireframes)
- Tailwind CSS (styling)
- Heroicons (ikoner)

**Utvikling:**
- Next.js 15 (frontend)
- TypeScript (type-sikkerhet)
- Supabase (database + auth)
- Vercel (hosting)

**Testing:**
- Jest (unit tests)
- Playwright (e2e tests)
- Lighthouse (performance)

**Analytics:**
- Plausible (privacy-friendly analytics)
- Sentry (error tracking)
- Hotjar (user behavior)

**Markedsføring:**
- Facebook Ads
- Google Ads
- Instagram
- TikTok (før/etter oppussing)

---

## KONKLUSJON

**Du har nå en komplett plan for å bygge Norges smarteste oppussingsplanlegger!**

**Nøkkelen til suksess:**
1. 🎯 Fokus på MVP først (4-6 uker)
2. 🚀 Lanser tidlig, iterer raskt
3. 👥 Test med ekte brukere
4. 📊 Mål alt (analytics)
5. 💰 Monetiser fra dag 1 (affiliate)

**Start i dag. Bygg én funksjon om gangen. Ship tidlig og ofte.**

🚀 **La oss gjøre dette!**


