// Recommendation Engine - Smart produktanbefalinger
// Anbefaler 3-5 produkter per kategori basert på prosjekt

export interface Product {
  id: number;
  name: string;
  category: string;
  store: string;
  price: number;
  quality_level: string;
  risk_level?: string;
  diy_friendly?: boolean;
  times_used?: number;
  avg_rating?: number;
  long_term_value?: number;
  expert_tip?: string;
  common_mistakes?: string;
}

export interface RecommendedProduct extends Product {
  isSafeChoice: boolean;
  reason: string;
  priority: number;
}

export function getRecommendedProducts(
  allProducts: Product[],
  category: string,
  budget: number,
  diyLevel: string,
  roomType: string
): RecommendedProduct[] {
  // Filtrer produkter for kategori
  let categoryProducts = allProducts.filter(p => p.category === category);

  // Sorter og prioriter
  const recommended = categoryProducts.map(product => {
    const isSafeChoice = checkIfSafeChoice(product);
    const reason = getRecommendationReason(product, budget, diyLevel, roomType);
    const priority = calculatePriority(product, budget, diyLevel);

    return {
      ...product,
      isSafeChoice,
      reason,
      priority
    };
  });

  // Sorter etter prioritet
  recommended.sort((a, b) => b.priority - a.priority);

  // Returner topp 3-5 produkter
  return recommended.slice(0, 5);
}

function checkIfSafeChoice(product: Product): boolean {
  // "Trygt valg" kriterier:
  // 1. Brukt av mange (times_used > 100)
  // 2. God rating (avg_rating >= 4.0)
  // 3. God langsiktig verdi (long_term_value >= 3)
  // 4. Ikke budsjettvariant av kritiske produkter

  const hasGoodUsage = (product.times_used || 0) > 100;
  const hasGoodRating = (product.avg_rating || 0) >= 4.0;
  const hasGoodValue = (product.long_term_value || 0) >= 3;
  const notCheapCritical = !(product.risk_level === 'critical' && product.quality_level === 'budsjett');

  return hasGoodUsage && hasGoodRating && hasGoodValue && notCheapCritical;
}

function getRecommendationReason(
  product: Product,
  budget: number,
  diyLevel: string,
  roomType: string
): string {
  const reasons: string[] = [];

  // Trygt valg
  if (checkIfSafeChoice(product)) {
    reasons.push(`Anbefalt av ${product.times_used || 0} brukere`);
  }

  // God verdi for pengene
  const valueScore = (product.avg_rating || 0) / (product.price / 1000);
  if (valueScore > 0.5) {
    reasons.push('God verdi for pengene');
  }

  // DIY-vennlig
  if (product.diy_friendly && diyLevel !== 'none') {
    reasons.push('Enkel å montere selv');
  }

  // Kritisk produkt
  if (product.risk_level === 'critical') {
    reasons.push('Kritisk produkt - ikke spar her');
  }

  // Langsiktig verdi
  if ((product.long_term_value || 0) >= 4) {
    reasons.push('Holder i 10+ år');
  }

  // Budsjett-vennlig
  if (product.quality_level === 'budsjett' && product.risk_level !== 'critical') {
    reasons.push('Spar penger her');
  }

  return reasons.slice(0, 2).join(' • ') || 'God kvalitet';
}

function calculatePriority(
  product: Product,
  budget: number,
  diyLevel: string
): number {
  let priority = 0;

  // Trygt valg får høyest prioritet
  if (checkIfSafeChoice(product)) {
    priority += 100;
  }

  // God rating
  priority += (product.avg_rating || 0) * 10;

  // Mange brukere
  priority += Math.min((product.times_used || 0) / 10, 50);

  // Langsiktig verdi
  priority += (product.long_term_value || 0) * 5;

  // Kritiske produkter skal alltid være standard eller premium
  if (product.risk_level === 'critical') {
    if (product.quality_level === 'standard' || product.quality_level === 'premium') {
      priority += 30;
    } else {
      priority -= 50; // Straff budsjettvariant av kritiske produkter
    }
  }

  // Juster for budsjett
  if (budget < 50000) {
    // Lavt budsjett - prioriter budsjett og standard
    if (product.quality_level === 'budsjett' && product.risk_level !== 'critical') {
      priority += 20;
    }
  } else if (budget > 150000) {
    // Høyt budsjett - prioriter premium
    if (product.quality_level === 'premium') {
      priority += 20;
    }
  } else {
    // Middels budsjett - prioriter standard
    if (product.quality_level === 'standard') {
      priority += 20;
    }
  }

  // DIY-vennlig for de som vil gjøre selv
  if (product.diy_friendly && diyLevel !== 'none') {
    priority += 10;
  }

  return priority;
}

// Generer "Spar her / Ikke spar her" anbefalinger
export function getSavingRecommendations(
  roomType: string,
  budget: number
): { saveOn: string[]; dontSaveOn: string[] } {
  const recommendations: Record<string, any> = {
    bad: {
      saveOn: [
        'Baderomskap - IKEA holder i 10+ år',
        'Speil og tilbehør - kan oppgraderes senere',
        'Dekorative fliser - velg enkle fliser',
        'Håndkleholder og kroker'
      ],
      dontSaveOn: [
        'Membran og tetting - vannskader koster 100 000+ kr',
        'Rørleggerarbeid - lekkasjer er katastrofalt',
        'Elektrisk arbeid - brannfare',
        'Ventilasjon - fukt og mugg'
      ]
    },
    kjokken: {
      saveOn: [
        'Kjøkkenskap - IKEA holder i 10+ år',
        'Hvitevarer - kjøp på tilbud',
        'Dekorative elementer',
        'Belysning under skap'
      ],
      dontSaveOn: [
        'Benkeplate - brukes daglig i 15+ år',
        'Kjøkkenkran - billige lekker',
        'Elektrisk arbeid',
        'Ventilasjon'
      ]
    },
    gulv: {
      saveOn: [
        'Gulvlist - plast vs tre',
        'Underlagsmatte - enkel kvalitet',
        'Overgangslist'
      ],
      dontSaveOn: [
        'Gulvkvalitet - billig må skiftes etter 3-5 år',
        'Underlag - viktig for lyd',
        'Montering - dårlig lagt gulv knirker'
      ]
    },
    maling: {
      saveOn: [
        'Malerverktøy - billige ruller',
        'Tape og plastduk',
        'Sparkel - budsjett OK'
      ],
      dontSaveOn: [
        'Malingskvalitet - billig dekker dårlig',
        'Grunnmaling - viktig for resultat'
      ]
    }
  };

  return recommendations[roomType] || { saveOn: [], dontSaveOn: [] };
}

