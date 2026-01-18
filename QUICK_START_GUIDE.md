# 🚀 QUICK START GUIDE - Start i dag!

**Mål:** Komme i gang med utviklingen av Norges smarteste oppussingsplanlegger

---

## 📚 Dokumenter du har nå:

1. **STRATEGI_SMARTESTE_OPPUSSINGSPLANLEGGER.md** (1000+ linjer)
   - Komplett produktvisjon
   - Alle 10 punkter dekket i detalj
   - Monetiseringsmodell
   - MVP vs Fase 2 vs Fase 3

2. **IMPLEMENTERINGSPLAN_MVP.md** (800+ linjer)
   - Uke-for-uke plan (6 uker)
   - Dag-for-dag oppgaver
   - Kodeeksempler
   - Database-schema

3. **Systemarkitektur** (Mermaid-diagrammer)
   - Oversikt over hele systemet
   - Brukerflyt
   - Inntektsmodell

---

## ⚡ START HER - De første 3 timene

### Time 1: Database-oppsett

**1. Oppdater produktdatabase (30 min)**

Kjør dette i Supabase SQL Editor:

```sql
-- Legg til nye kolonner i products-tabellen
ALTER TABLE products ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low';
ALTER TABLE products ADD COLUMN IF NOT EXISTS diy_friendly BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recommended_quality VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_term_value INTEGER DEFAULT 3;
ALTER TABLE products ADD COLUMN IF NOT EXISTS common_mistakes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS expert_tip TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS times_used INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT 4.0;

-- Oppdater eksisterende produkter med "Trygt valg"-data
UPDATE products 
SET times_used = 150, avg_rating = 4.5 
WHERE name LIKE '%IKEA%' OR name LIKE '%Byggmakker%';

UPDATE products 
SET risk_level = 'critical', diy_friendly = false 
WHERE category = 'bad' AND (name LIKE '%membran%' OR name LIKE '%rør%');

UPDATE products 
SET expert_tip = 'Alltid bruk sertifisert fagperson for rørleggerarbeid' 
WHERE category = 'bad' AND name LIKE '%rør%';
```

**2. Opprett nye tabeller (30 min)**

```sql
-- Tabell for prosjektplaner
CREATE TABLE IF NOT EXISTS project_plans (
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
    quality_level VARCHAR(20) DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabell for prosjektsteg
CREATE TABLE IF NOT EXISTS project_steps (
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

-- Tabell for budsjettfordeling
CREATE TABLE IF NOT EXISTS budget_allocation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
    category VARCHAR(50),
    percentage DECIMAL(5,2),
    amount DECIMAL(10,2),
    explanation TEXT,
    can_save_here BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_plans_user_id ON project_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_project_steps_plan_id ON project_steps(project_plan_id);
CREATE INDEX IF NOT EXISTS idx_budget_allocation_plan_id ON budget_allocation(project_plan_id);

-- RLS Policies
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own project plans"
    ON project_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project plans"
    ON project_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Time 2: Lag utility-funksjoner

**1. Opprett `utils/budgetCalculator.ts` (20 min)**

```typescript
// utils/budgetCalculator.ts
export interface BudgetAllocation {
  labor: number;
  materials: number;
  buffer: number;
  breakdown: {
    laborPercentage: number;
    materialsPercentage: number;
    bufferPercentage: number;
  };
  explanation: {
    labor: string;
    materials: string;
    buffer: string;
  };
}

export function calculateBudgetAllocation(
  totalBudget: number,
  roomType: string,
  diyLevel: string
): BudgetAllocation {
  let laborPercentage = 0.4; // 40% default
  let materialsPercentage = 0.45; // 45% default
  let bufferPercentage = 0.15; // 15% default

  // Juster basert på romtype
  if (roomType === 'bad') {
    laborPercentage = 0.5; // Bad krever mer fagfolk
    materialsPercentage = 0.35;
    bufferPercentage = 0.15;
  } else if (roomType === 'kjokken') {
    laborPercentage = 0.35;
    materialsPercentage = 0.5;
    bufferPercentage = 0.15;
  } else if (roomType === 'maling') {
    laborPercentage = 0.2; // Maling kan gjøres selv
    materialsPercentage = 0.6;
    bufferPercentage = 0.2;
  } else if (roomType === 'gulv') {
    laborPercentage = 0.3;
    materialsPercentage = 0.55;
    bufferPercentage = 0.15;
  }

  // Juster basert på DIY-nivå
  if (diyLevel === 'experienced') {
    laborPercentage -= 0.15;
    materialsPercentage += 0.1;
    bufferPercentage += 0.05;
  } else if (diyLevel === 'none') {
    laborPercentage += 0.1;
    materialsPercentage -= 0.05;
    bufferPercentage -= 0.05;
  }

  const labor = Math.round(totalBudget * laborPercentage);
  const materials = Math.round(totalBudget * materialsPercentage);
  const buffer = totalBudget - labor - materials;

  return {
    labor,
    materials,
    buffer,
    breakdown: {
      laborPercentage: Math.round(laborPercentage * 100),
      materialsPercentage: Math.round(materialsPercentage * 100),
      bufferPercentage: Math.round(bufferPercentage * 100)
    },
    explanation: {
      labor: getExplanation('labor', roomType, diyLevel),
      materials: getExplanation('materials', roomType, diyLevel),
      buffer: getExplanation('buffer', roomType, diyLevel)
    }
  };
}

function getExplanation(category: string, roomType: string, diyLevel: string): string {
  const explanations = {
    labor: {
      bad: 'Baderom krever sertifisert rørlegger og elektriker. Ikke spar her!',
      kjokken: 'Montering kan gjøres selv hvis erfaren, ellers bruk fagfolk.',
      maling: 'Maling kan enkelt gjøres selv. Spar penger her!',
      gulv: 'Gulvlegging kan gjøres selv med riktig verktøy.'
    },
    materials: {
      bad: 'Membran og fliser er kritisk. Velg god kvalitet.',
      kjokken: 'Skap og benkeplate er største utgift. Vurder standard kvalitet.',
      maling: 'God maling gir bedre resultat og dekker bedre.',
      gulv: 'Velg minimum AC4-klasse laminat for god holdbarhet.'
    },
    buffer: {
      bad: 'Baderom har ofte skjulte problemer. Ha god buffer!',
      kjokken: 'Buffer for uforutsette utgifter og ekstra materialer.',
      maling: 'Maling har sjelden store overraskelser.',
      gulv: 'Buffer for ekstra materialer (10% svinn).'
    }
  };

  return explanations[category][roomType] || 'Standard fordeling';
}
```

**2. Test budsjettkalkulatoren (10 min)**

Opprett en test-fil eller kjør i browser console:

```typescript
const result = calculateBudgetAllocation(150000, 'bad', 'beginner');
console.log(result);
// Output:
// {
//   labor: 75000,
//   materials: 52500,
//   buffer: 22500,
//   breakdown: { laborPercentage: 50, materialsPercentage: 35, bufferPercentage: 15 },
//   explanation: { ... }
// }
```

### Time 3: Lag første versjon av planlegger

**1. Opprett `/app/planlegger/page.tsx` (30 min)**

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  housingType: string;
  buildYear: string;
  roomType: string;
  roomSize: number;
  currentCondition: string;
  budget: number;
  diyLevel: string;
}

export default function Planlegger() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    housingType: '',
    buildYear: '',
    roomType: '',
    roomSize: 0,
    currentCondition: '',
    budget: 0,
    diyLevel: 'beginner'
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // TODO: Generer plan og lagre til database
    console.log('Genererer plan...', formData);
    // Redirect til prosjektplan
    window.location.href = '/prosjektplan/demo';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold">BoligProsjekt</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded ${
                  s <= step ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-slate-600">
            Steg {step} av 4
          </p>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <Step1Boliginfo formData={formData} updateFormData={updateFormData} />
          )}
          {step === 2 && (
            <Step2Rom formData={formData} updateFormData={updateFormData} />
          )}
          {step === 3 && (
            <Step3Budsjett formData={formData} updateFormData={updateFormData} />
          )}
          {step === 4 && (
            <Step4Egeninnsats formData={formData} updateFormData={updateFormData} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-slate-200 rounded-lg hover:bg-slate-300"
            >
              ← Tilbake
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Neste →
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generer plan →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Steg 1: Boliginfo
function Step1Boliginfo({ formData, updateFormData }) {
  const housingTypes = [
    { id: 'leilighet', name: 'Leilighet', icon: '🏢' },
    { id: 'enebolig', name: 'Enebolig', icon: '🏠' },
    { id: 'rekkehus', name: 'Rekkehus', icon: '🏘️' },
    { id: 'hytte', name: 'Hytte', icon: '🏔️' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Fortell oss om boligen din</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Boligtype</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {housingTypes.map(type => (
            <button
              key={type.id}
              onClick={() => updateFormData('housingType', type.id)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                formData.housingType === type.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <div className="font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Byggeår</label>
        <select
          value={formData.buildYear}
          onChange={(e) => updateFormData('buildYear', e.target.value)}
          className="w-full p-3 border-2 border-slate-200 rounded-lg"
        >
          <option value="">Velg byggeår</option>
          <option value="<1950">Før 1950</option>
          <option value="1950-1980">1950-1980</option>
          <option value="1980-2000">1980-2000</option>
          <option value=">2000">Etter 2000</option>
        </select>
      </div>
    </div>
  );
}

// Steg 2: Rom
function Step2Rom({ formData, updateFormData }) {
  const rooms = [
    { id: 'kjokken', name: 'Kjøkken', icon: '🍳' },
    { id: 'bad', name: 'Bad', icon: '🚿' },
    { id: 'stue', name: 'Stue', icon: '🛋️' },
    { id: 'soverom', name: 'Soverom', icon: '🛏️' },
    { id: 'gulv', name: 'Gulv', icon: '🪵' },
    { id: 'maling', name: 'Maling', icon: '🎨' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hvilket rom skal du pusse opp?</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Velg rom</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => updateFormData('roomType', room.id)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                formData.roomType === room.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="text-4xl mb-2">{room.icon}</div>
              <div className="font-medium">{room.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Størrelse (kvm)</label>
        <input
          type="number"
          value={formData.roomSize || ''}
          onChange={(e) => updateFormData('roomSize', parseFloat(e.target.value))}
          placeholder="f.eks. 15"
          className="w-full p-3 border-2 border-slate-200 rounded-lg text-2xl"
        />
      </div>
    </div>
  );
}

// Steg 3: Budsjett
function Step3Budsjett({ formData, updateFormData }) {
  const suggestedBudgets = {
    bad: { min: 80000, mid: 150000, max: 300000 },
    kjokken: { min: 50000, mid: 120000, max: 250000 },
    gulv: { min: 20000, mid: 50000, max: 100000 },
    maling: { min: 10000, mid: 25000, max: 50000 }
  };

  const suggested = suggestedBudgets[formData.roomType] || { min: 20000, mid: 50000, max: 100000 };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hva er ditt budsjett?</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Budsjett (kr)</label>
        <input
          type="number"
          value={formData.budget || ''}
          onChange={(e) => updateFormData('budget', parseFloat(e.target.value))}
          placeholder="f.eks. 150 000"
          className="w-full p-4 border-2 border-slate-200 rounded-lg text-3xl font-bold"
        />
      </div>

      <div className="bg-slate-50 p-6 rounded-lg">
        <p className="text-sm font-medium mb-3">Veiledende priser for {formData.roomType}:</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-600 mb-1">Budsjett</div>
            <div className="font-bold">{suggested.min.toLocaleString()} kr</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Standard</div>
            <div className="font-bold text-green-600">{suggested.mid.toLocaleString()} kr</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Premium</div>
            <div className="font-bold">{suggested.max.toLocaleString()} kr</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Steg 4: Egeninnsats
function Step4Egeninnsats({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Hva kan du gjøre selv?</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Erfaring med oppussing</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'none', name: 'Nybegynner', desc: 'Aldri pusset opp før' },
            { id: 'beginner', name: 'Noe erfaring', desc: 'Har malt og montert' },
            { id: 'experienced', name: 'Erfaren', desc: 'Kan det meste' }
          ].map(level => (
            <button
              key={level.id}
              onClick={() => updateFormData('diyLevel', level.id)}
              className={`p-6 border-2 rounded-xl text-center transition-all ${
                formData.diyLevel === level.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="font-medium mb-1">{level.name}</div>
              <div className="text-xs text-slate-600">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ SJEKKLISTE - Første dag

- [ ] Les gjennom STRATEGI_SMARTESTE_OPPUSSINGSPLANLEGGER.md
- [ ] Les gjennom IMPLEMENTERINGSPLAN_MVP.md
- [ ] Kjør database-oppdateringer i Supabase
- [ ] Opprett `utils/budgetCalculator.ts`
- [ ] Opprett `/app/planlegger/page.tsx`
- [ ] Test planleggeren i browser
- [ ] Commit og push til GitHub

---

## 🎯 NESTE STEG

**I morgen:**
1. Lag `utils/planGenerator.ts` (steg-for-steg generator)
2. Lag `utils/recommendationEngine.ts` (produktanbefalinger)
3. Lag `/app/prosjektplan/[id]/page.tsx` (vis generert plan)

**Denne uken:**
4. Fullfør alle utility-funksjoner
5. Implementer alle 4 steg i planleggeren
6. Lag demo-versjon av prosjektplan

**Neste uke:**
7. Implementer dashboard
8. Implementer handleliste
9. Testing og polish

---

## 💡 TIPS

1. **Start enkelt** - Ikke prøv å bygge alt på en gang
2. **Test ofte** - Kjør koden hver gang du legger til noe nytt
3. **Commit ofte** - Lagre arbeidet ditt regelmessig
4. **Bruk AI** - Spør ChatGPT/Claude om hjelp når du står fast
5. **Fokus på MVP** - Ikke legg til fancy features før kjernen fungerer

---

## 🚀 DU ER KLAR!

**Du har nå alt du trenger for å bygge Norges smarteste oppussingsplanlegger.**

**Start med database-oppdateringene, lag budsjettkalkulatoren, og bygg planleggeren.**

**Lykke til! 🎉**


