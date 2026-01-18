// Plan Generator - Genererer steg-for-steg plan basert på romtype
// Hver plan er tilpasset romtype, omfang og DIY-nivå

export interface ProjectStep {
  step: number;
  title: string;
  description: string;
  estimatedCost: number;
  estimatedTime: number; // i uker
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresProfessional: boolean;
  canDIY: boolean;
  priority: number;
  weekNumber: number;
  tips: string[];
  commonMistakes: string[];
}

export function generateProjectSteps(
  roomType: string,
  scope: string,
  diyLevel: string,
  budget: number
): ProjectStep[] {
  const templates: Record<string, ProjectStep[]> = {
    bad: [
      {
        step: 1,
        title: 'Planlegging og forberedelse',
        description: 'Tegn opp rommet, bestill håndverkere (lang ventetid!), kjøp materialer',
        estimatedCost: 0,
        estimatedTime: 1,
        riskLevel: 'low',
        requiresProfessional: false,
        canDIY: true,
        priority: 1,
        weekNumber: 0,
        tips: [
          'Bestill rørlegger og elektriker NÅ - ofte 4-8 ukers ventetid',
          'Tegn opp rommet med mål',
          'Ta bilder av alt før du starter'
        ],
        commonMistakes: [
          'Glemmer å bestille håndverkere tidlig nok',
          'Kjøper materialer før planlegging er ferdig'
        ]
      },
      {
        step: 2,
        title: 'Riving',
        description: 'Steng vannet, riv ut gammelt, sjekk rør og avløp',
        estimatedCost: budget * 0.05,
        estimatedTime: 1,
        riskLevel: 'medium',
        requiresProfessional: false,
        canDIY: diyLevel !== 'none',
        priority: 2,
        weekNumber: 1,
        tips: [
          'Steng vannet før du starter!',
          'Sjekk for råte og skader',
          'Ta bilder av rør og elektrisk før riving'
        ],
        commonMistakes: [
          'Glemmer å stenge vannet',
          'Skader rør eller kabler',
          'Kaster ting som skulle vært tatt vare på'
        ]
      },
      {
        step: 3,
        title: 'Rørleggerarbeid',
        description: 'Ny rørlegging, avløp og vannforsyning',
        estimatedCost: budget * 0.2,
        estimatedTime: 2,
        riskLevel: 'critical',
        requiresProfessional: true,
        canDIY: false,
        priority: 3,
        weekNumber: 2,
        tips: [
          'Bruk ALLTID sertifisert rørlegger',
          'Få skriftlig garanti på arbeidet',
          'Sjekk at alt er testet før neste steg'
        ],
        commonMistakes: [
          'Prøver å gjøre det selv - IKKE GJØR DETTE!',
          'Velger billigste tilbud uten referanser',
          'Glemmer å teste for lekkasjer'
        ]
      },
      {
        step: 4,
        title: 'Elektrisk arbeid',
        description: 'Ny kabling, stikkontakter, belysning',
        estimatedCost: budget * 0.15,
        estimatedTime: 1,
        riskLevel: 'critical',
        requiresProfessional: true,
        canDIY: false,
        priority: 4,
        weekNumber: 3,
        tips: [
          'Bruk ALLTID autorisert elektriker',
          'Planlegg plassering av stikkontakter nøye',
          'Tenk på fremtidige behov (flere stikkontakter)'
        ],
        commonMistakes: [
          'For få stikkontakter',
          'Glemmer stikkontakt ved toalett (for fremtidig bidet)',
          'Prøver å gjøre det selv - FARLIG!'
        ]
      },
      {
        step: 5,
        title: 'Membran og våtromssikring',
        description: 'Legg membran på gulv og vegger (kritisk!)',
        estimatedCost: budget * 0.1,
        estimatedTime: 1,
        riskLevel: 'critical',
        requiresProfessional: true,
        canDIY: diyLevel === 'experienced',
        priority: 5,
        weekNumber: 4,
        tips: [
          'Membran MÅ legges riktig - vannskader koster 100 000+ kr',
          'Bruk sertifisert fagperson hvis du er usikker',
          'Sjekk at alle hjørner og overganger er tette'
        ],
        commonMistakes: [
          'Sparer på membran - ALDRI GJØR DETTE!',
          'Dårlig tetting i hjørner',
          'Glemmer membran bak toalett'
        ]
      },
      {
        step: 6,
        title: 'Flislegging',
        description: 'Legg gulvfliser først, deretter veggfliser',
        estimatedCost: budget * 0.15,
        estimatedTime: 2,
        riskLevel: 'medium',
        requiresProfessional: false,
        canDIY: diyLevel === 'experienced',
        priority: 6,
        weekNumber: 5,
        tips: [
          'Start med gulvfliser, deretter veggfliser',
          'Bruk god flislim og fugmasse',
          'Ta deg tid - dette tar lengre tid enn du tror'
        ],
        commonMistakes: [
          'Dårlig planlegging av flisemønster',
          'For lite flislim',
          'Fuger for tidlig (vent 24 timer)'
        ]
      },
      {
        step: 7,
        title: 'Montering av sanitær',
        description: 'Monter toalett, servant, dusj og innredning',
        estimatedCost: budget * 0.2,
        estimatedTime: 1,
        riskLevel: 'medium',
        requiresProfessional: false,
        canDIY: diyLevel !== 'none',
        priority: 7,
        weekNumber: 7,
        tips: [
          'Følg monteringsanvisninger nøye',
          'Bruk riktig verktøy',
          'Test alt før du fester permanent'
        ],
        commonMistakes: [
          'Glemmer å tette rundt toalett',
          'Monterer servant for lavt/høyt',
          'Glemmer å sjekke for lekkasjer'
        ]
      },
      {
        step: 8,
        title: 'Maling og finish',
        description: 'Male tak og vegger, silikon, rengjøring',
        estimatedCost: budget * 0.05,
        estimatedTime: 1,
        riskLevel: 'low',
        requiresProfessional: false,
        canDIY: true,
        priority: 8,
        weekNumber: 8,
        tips: [
          'Bruk fuktsikker maling i bad',
          'Silikon rundt alle overganger',
          'Rengjør grundig før bruk'
        ],
        commonMistakes: [
          'Bruker vanlig maling i stedet for fuktsikker',
          'For lite silikon',
          'Maler før alt annet er ferdig'
        ]
      }
    ],
    kjokken: [
      {
        step: 1,
        title: 'Planlegging',
        description: 'Tegn opp kjøkken, bestill skap og benkeplate',
        estimatedCost: 0,
        estimatedTime: 1,
        riskLevel: 'low',
        requiresProfessional: false,
        canDIY: true,
        priority: 1,
        weekNumber: 0,
        tips: [
          'Mål nøye - kjøkken må passe perfekt',
          'Tenk på arbeidsflyt (kjøleskap → vask → komfyr)',
          'Bestill benkeplate tidlig (lang leveringstid)'
        ],
        commonMistakes: [
          'Måler feil',
          'Glemmer plass til hvitevarer',
          'Planlegger ikke arbeidsflyt'
        ]
      },
      {
        step: 2,
        title: 'Riving og forberedelse',
        description: 'Riv ut gammelt kjøkken, sjekk vegger og gulv',
        estimatedCost: budget * 0.05,
        estimatedTime: 1,
        riskLevel: 'low',
        requiresProfessional: false,
        canDIY: true,
        priority: 2,
        weekNumber: 1,
        tips: [
          'Steng vann og strøm før riving',
          'Ta vare på ting som kan gjenbrukes',
          'Sjekk vegger for skader'
        ],
        commonMistakes: [
          'Skader rør eller kabler',
          'Kaster ting som kunne vært solgt'
        ]
      },
      {
        step: 3,
        title: 'Elektrisk og rør',
        description: 'Ny kabling for komfyr, oppvaskmaskin, kjøleskap',
        estimatedCost: budget * 0.15,
        estimatedTime: 1,
        riskLevel: 'critical',
        requiresProfessional: true,
        canDIY: false,
        priority: 3,
        weekNumber: 2,
        tips: [
          'Bruk autorisert elektriker',
          'Planlegg nok stikkontakter',
          'Tenk på fremtidige behov'
        ],
        commonMistakes: [
          'For få stikkontakter',
          'Glemmer stikkontakt for oppvaskmaskin'
        ]
      },
      {
        step: 4,
        title: 'Montering av skap',
        description: 'Monter underskap og overskap',
        estimatedCost: budget * 0.3,
        estimatedTime: 2,
        riskLevel: 'medium',
        requiresProfessional: false,
        canDIY: diyLevel !== 'none',
        priority: 4,
        weekNumber: 3,
        tips: [
          'Start med overskap (lettere å justere)',
          'Bruk vater - alt må være rett',
          'Fest godt i veggen'
        ],
        commonMistakes: [
          'Skjeve skap',
          'Dårlig festing',
          'Glemmer å sjekke med vater'
        ]
      },
      {
        step: 5,
        title: 'Benkeplate og vask',
        description: 'Monter benkeplate, skjær ut for vask og komfyr',
        estimatedCost: budget * 0.25,
        estimatedTime: 1,
        riskLevel: 'high',
        requiresProfessional: diyLevel !== 'experienced',
        canDIY: diyLevel === 'experienced',
        priority: 5,
        weekNumber: 5,
        tips: [
          'Mål 10 ganger, skjær 1 gang',
          'Bruk riktig verktøy for materialet',
          'Tett godt rundt vask'
        ],
        commonMistakes: [
          'Skjærer feil',
          'Dårlig tetting rundt vask',
          'Benkeplate ikke i vater'
        ]
      },
      {
        step: 6,
        title: 'Finish og tilkobling',
        description: 'Monter hvitevarer, koble til vann og strøm',
        estimatedCost: budget * 0.1,
        estimatedTime: 1,
        riskLevel: 'medium',
        requiresProfessional: false,
        canDIY: diyLevel !== 'none',
        priority: 6,
        weekNumber: 6,
        tips: [
          'Test alt før du fester permanent',
          'Sjekk for lekkasjer',
          'Juster dører og skuffer'
        ],
        commonMistakes: [
          'Glemmer å teste før festing',
          'Dårlig justering av dører'
        ]
      }
    ]
  };

  // Returner template for romtype, eller tom array
  return templates[roomType] || [];
}

