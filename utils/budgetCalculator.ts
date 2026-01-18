// Budget Calculator - Smart budsjettfordeling
// Beregner optimal fordeling basert på romtype og DIY-nivå

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
  canSaveOn: string[];
  dontSaveOn: string[];
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
  } else if (roomType === 'belysning') {
    laborPercentage = 0.4;
    materialsPercentage = 0.45;
    bufferPercentage = 0.15;
  } else if (roomType === 'vinduer') {
    laborPercentage = 0.45;
    materialsPercentage = 0.4;
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

  // Beregn beløp
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
    },
    canSaveOn: getCanSaveOn(roomType),
    dontSaveOn: getDontSaveOn(roomType)
  };
}

function getExplanation(category: string, roomType: string, diyLevel: string): string {
  const explanations: Record<string, Record<string, string>> = {
    labor: {
      bad: 'Baderom krever sertifisert rørlegger og elektriker. Ikke spar her! Lekkasjer kan koste 100 000+ kr.',
      kjokken: 'Montering kan gjøres selv hvis erfaren, ellers bruk fagfolk for benkeplate og tilkobling.',
      maling: 'Maling kan enkelt gjøres selv. Spar penger her! Bruk tiden din i stedet for penger.',
      gulv: 'Gulvlegging kan gjøres selv med riktig verktøy. Vurder å leie profesjonelt utstyr.',
      belysning: 'Enkel montering kan gjøres selv, men ny kabling krever autorisert elektriker.',
      vinduer: 'Vindusmontering krever erfaring og 2 personer. Vurder fagfolk for beste resultat.'
    },
    materials: {
      bad: 'Membran og fliser er kritisk. Velg god kvalitet - dette holder i 20+ år.',
      kjokken: 'Skap og benkeplate er største utgift. Vurder standard skap + premium benkeplate.',
      maling: 'God maling gir bedre resultat og dekker bedre. Spar ikke på kvalitet.',
      gulv: 'Velg minimum AC4-klasse laminat for god holdbarhet. Parkett holder lengst.',
      belysning: 'LED-produkter er dyrere, men sparer strøm i 10+ år. God investering.',
      vinduer: 'Energivinduer (3-lags) sparer strøm og øker boligverdi. Ikke spar her.'
    },
    buffer: {
      bad: 'Baderom har ofte skjulte problemer (råte, rør). Ha god buffer (15-20%)!',
      kjokken: 'Buffer for uforutsette utgifter og ekstra materialer. 15% er standard.',
      maling: 'Maling har sjelden store overraskelser. 10-15% buffer er nok.',
      gulv: 'Buffer for ekstra materialer (10% svinn) og uforutsette utgifter.',
      belysning: 'Buffer for ekstra kabler og uforutsette elektriske utfordringer.',
      vinduer: 'Buffer for ekstra tetting og eventuelle justeringer av karm.'
    }
  };

  return explanations[category]?.[roomType] || 'Standard fordeling basert på erfaring.';
}

function getCanSaveOn(roomType: string): string[] {
  const savings: Record<string, string[]> = {
    bad: [
      'Baderomskap - IKEA vs premium sparer 15 000 kr',
      'Speil og tilbehør - kan oppgraderes senere',
      'Dekorative fliser - velg enkle fliser',
      'Håndkleholder og kroker - billige alternativer holder'
    ],
    kjokken: [
      'Kjøkkenskap - IKEA holder i 10+ år',
      'Hvitevarer - kjøp på tilbud',
      'Dekorative elementer - kan legges til senere',
      'Belysning under skap - kan oppgraderes senere'
    ],
    gulv: [
      'Gulvlist - plast vs tre sparer 5 000 kr',
      'Underlagsmatte - enkel kvalitet holder',
      'Overgangslist - billige alternativer finnes'
    ],
    maling: [
      'Malerverktøy - billige ruller holder for 1 gang',
      'Tape og plastduk - kjøp billigst',
      'Sparkel - budsjettvariant er OK'
    ],
    belysning: [
      'Dekorative lamper - kan oppgraderes senere',
      'Dimmer - kan legges til senere',
      'Smart-funksjoner - ikke nødvendig'
    ],
    vinduer: [
      'Vinduskarm - enkel kvalitet holder',
      'Beslag - standard kvalitet er nok'
    ]
  };

  return savings[roomType] || ['Dekorative elementer', 'Tilbehør'];
}

function getDontSaveOn(roomType: string): string[] {
  const critical: Record<string, string[]> = {
    bad: [
      'Membran og tetting - vannskader koster 100 000+ kr',
      'Rørleggerarbeid - lekkasjer er katastrofalt',
      'Elektrisk arbeid - brannfare',
      'Ventilasjon - fukt og mugg er dyrt å fikse'
    ],
    kjokken: [
      'Benkeplate - brukes daglig i 15+ år',
      'Kjøkkenkran - billige lekker ofte',
      'Elektrisk arbeid - brannfare',
      'Ventilasjon - viktig for luft og fukt'
    ],
    gulv: [
      'Gulvkvalitet - billig gulv må skiftes etter 3-5 år',
      'Underlag - viktig for lyd og komfort',
      'Montering - dårlig lagt gulv knirker'
    ],
    maling: [
      'Malingskvalitet - billig maling dekker dårlig',
      'Grunnmaling - viktig for godt resultat'
    ],
    belysning: [
      'Elektrisk arbeid - brannfare',
      'LED-kvalitet - billige LED flimrer og går fort'
    ],
    vinduer: [
      'Vinduskvalitet - 3-lags er viktig for energi',
      'Tetting - dårlig tetting gir kuldebroer',
      'Montering - dårlig montert vindu lekker'
    ]
  };

  return critical[roomType] || ['Fagarbeid', 'Kritiske materialer'];
}

