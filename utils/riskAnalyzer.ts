// Risk Analyzer - Analyserer risiko basert på prosjektplan
// Gir advarsler for kritiske valg som kan koste dyrt

export interface RiskWarning {
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  recommendation: string;
  potentialCost?: number;
}

export function analyzeRisks(
  roomType: string,
  budget: number,
  diyLevel: string,
  currentCondition: string
): RiskWarning[] {
  const warnings: RiskWarning[] = [];

  // Sjekk budsjett vs romtype
  const budgetWarnings = checkBudget(roomType, budget);
  warnings.push(...budgetWarnings);

  // Sjekk DIY-nivå vs romtype
  const diyWarnings = checkDIYLevel(roomType, diyLevel);
  warnings.push(...diyWarnings);

  // Sjekk tilstand
  const conditionWarnings = checkCondition(roomType, currentCondition, budget);
  warnings.push(...conditionWarnings);

  return warnings;
}

function checkBudget(roomType: string, budget: number): RiskWarning[] {
  const warnings: RiskWarning[] = [];

  const minimumBudgets: Record<string, number> = {
    bad: 80000,
    kjokken: 50000,
    gulv: 20000,
    maling: 10000,
    stue: 30000,
    soverom: 20000
  };

  const minBudget = minimumBudgets[roomType] || 20000;

  if (budget < minBudget) {
    warnings.push({
      level: 'critical',
      title: '🚨 Kritisk lavt budsjett',
      message: `Budsjettet ditt (${budget.toLocaleString()} kr) er under anbefalt minimum (${minBudget.toLocaleString()} kr) for ${roomType}.`,
      recommendation: `Vurder å øke budsjettet eller redusere omfanget. Å spare på feil ting kan koste deg 2-3x mer senere.`,
      potentialCost: minBudget - budget
    });
  } else if (budget < minBudget * 1.2) {
    warnings.push({
      level: 'warning',
      title: '⚠️ Stramt budsjett',
      message: `Budsjettet ditt er på minimumsnivå. Du har liten buffer for uforutsette utgifter.`,
      recommendation: `Ha en ekstra buffer på 15-20% for uforutsette utgifter. ${roomType} har ofte skjulte problemer.`
    });
  }

  return warnings;
}

function checkDIYLevel(roomType: string, diyLevel: string): RiskWarning[] {
  const warnings: RiskWarning[] = [];

  // Kritiske rom som krever fagfolk
  if (roomType === 'bad' && diyLevel !== 'none') {
    warnings.push({
      level: 'critical',
      title: '🚨 Høyrisiko-advarsel: Baderom',
      message: 'Du har valgt å gjøre noe av arbeidet selv på badet. Dette er høyrisiko!',
      recommendation: 'Bruk ALLTID sertifisert rørlegger og elektriker. Vannskader kan koste 100 000+ kr å fikse.',
      potentialCost: 100000
    });
  }

  if (roomType === 'kjokken' && diyLevel === 'none') {
    warnings.push({
      level: 'info',
      title: '💡 Spar penger',
      message: 'Du kan spare penger ved å gjøre noe av arbeidet selv på kjøkkenet.',
      recommendation: 'Enkel montering av skap kan gjøres selv. Vurder å bruke fagfolk kun for benkeplate og tilkobling.'
    });
  }

  if (roomType === 'maling' && diyLevel === 'none') {
    warnings.push({
      level: 'info',
      title: '💰 Stort sparepotensial',
      message: 'Maling er perfekt for egeninnsats! Du kan spare 10 000-20 000 kr.',
      recommendation: 'Vurder å gjøre malingen selv. Det er enkelt og du sparer mye penger.'
    });
  }

  return warnings;
}

function checkCondition(roomType: string, currentCondition: string, budget: number): RiskWarning[] {
  const warnings: RiskWarning[] = [];

  if (currentCondition === 'poor' && roomType === 'bad') {
    warnings.push({
      level: 'warning',
      title: '⚠️ Skjulte problemer',
      message: 'Dårlig tilstand på bad betyr ofte skjulte problemer (råte, lekkasjer).',
      recommendation: 'Ha en buffer på 20-30% for uforutsette utgifter. Sjekk for råte og skader før du starter.',
      potentialCost: budget * 0.25
    });
  }

  if (currentCondition === 'poor' && budget < 50000) {
    warnings.push({
      level: 'critical',
      title: '🚨 Budsjett vs tilstand',
      message: 'Dårlig tilstand krever ofte mer arbeid enn forventet.',
      recommendation: 'Vurder å øke budsjettet eller gjøre prosjektet i flere faser.'
    });
  }

  return warnings;
}

// Analyser produktvalg
export function analyzeProductChoices(
  products: any[],
  roomType: string,
  budget: number
): RiskWarning[] {
  const warnings: RiskWarning[] = [];

  // Sjekk om brukeren sparer på kritiske produkter
  const criticalProducts = products.filter(p => p.risk_level === 'critical');
  const cheapCriticalProducts = criticalProducts.filter(p => p.quality_level === 'budsjett');

  if (cheapCriticalProducts.length > 0) {
    warnings.push({
      level: 'critical',
      title: '🚨 Sparer på kritiske produkter',
      message: `Du har valgt budsjettvariant av ${cheapCriticalProducts.length} kritiske produkter.`,
      recommendation: 'IKKE spar på membran, rør, elektrisk eller andre kritiske produkter. Dette kan koste deg 10x mer senere.',
      potentialCost: 100000
    });
  }

  // Sjekk om brukeren bruker for mye på dekorative ting
  const decorativeProducts = products.filter(p => 
    p.category === 'dekor' || p.name.includes('speil') || p.name.includes('lampe')
  );
  const expensiveDecorativeProducts = decorativeProducts.filter(p => p.quality_level === 'premium');

  if (expensiveDecorativeProducts.length > 2 && budget < 100000) {
    warnings.push({
      level: 'warning',
      title: '⚠️ Prioritering',
      message: 'Du bruker mye på dekorative elementer.',
      recommendation: 'Vurder å spare på dekor og bruke pengene på kvalitet i kritiske produkter i stedet.'
    });
  }

  return warnings;
}

