import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import sharp from 'sharp';

// ============================================
// INITIALISER AI CLIENTS
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// ANALYSER BILDE MED CLAUDE OPUS
// ============================================

export async function analyzeImage(imageBuffer, options = {}) {
  const { style, budget, description } = options;

  console.log('🔍 Analyserer bilde med Claude Opus...');
  
  // Optimaliser bilde med sharp
  const optimizedImage = await sharp(imageBuffer)
    .resize(1568, 1568, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const base64Image = optimizedImage.toString('base64');
  
  console.log(`   Bildestørrelse: ${(base64Image.length / 1024).toFixed(2)} KB`);

  // Bygg prompt basert på budsjett
  const budgetGuidance = getBudgetGuidance(budget);
  const styleGuidance = getStyleGuidance(style);

  const prompt = `Du er en ekspert norsk interiørarkitekt og rådgiver.

OPPGAVE:
Analyser dette bildet av et rom i en norsk bolig og gi en detaljert vurdering.

BRUKERENS ØNSKER:
- Ønsket stil: ${style || 'Ikke spesifisert'}
- Budsjett: ${budget ? `${(budget/1000).toFixed(0)}k kr` : 'Ikke spesifisert'}
${description ? `- Beskrivelse: ${description}` : ''}

ANALYSER FØLGENDE:

1. **Romtype og funksjon**
   - Hva slags rom er dette? (kjøkken, bad, soverom, stue, etc.)
   - Nåværende funksjon og bruk
   - Potensial for endring

2. **Arkitektoniske detaljer**
   - Romstørrelse (estimat i m²)
   - Takehøyde
   - Vinduer (antall, plassering, størrelse, lysinnfall)
   - Dører (antall, plassering)
   - Vegger og hjørner
   - Gulv (type, tilstand)

3. **Nåværende stil og uttrykk**
   - Stilperiode (moderne, klassisk, 70-tall, etc.)
   - Fargepalett (vegger, tak, detaljer)
   - Materialer (tre, metall, stein, tekstiler)
   - Møbler og innredning
   - Dekorative elementer

4. **Lysforhold**
   - Naturlig lys (retning, mengde)
   - Kunstig belysning (type, plassering)
   - Lyse/mørke toner i rommet

5. **Tilstand og utfordringer**
   - Generell tilstand (nytt, godt vedlikeholdt, slitt)
   - Synlige problemer eller skader
   - Tekniske utfordringer
   - Hva må endres/oppgraderes?

6. **Transformasjonsforslag**
${styleGuidance}
${budgetGuidance}

   Gi konkrete forslag til:
   - Fargevalg (vegger, tak, detaljer)
   - Materialer (gulv, benkeplate, fronter, etc.)
   - Møbler og innredning
   - Belysning
   - Dekorative elementer
   - Layout-endringer (hvis nødvendig)

7. **Norske leverandører og produkter**
   Anbefal konkrete norske leverandører basert på budsjett:
   - Lavt budsjett (< 100k): IKEA, Byggmakker, Maxbo
   - Middels budsjett (100-200k): IKEA METOD, Epoq, Kvik
   - Høyt budsjett (> 200k): HTH, Sigdal, Kvik Premium

8. **Budsjettestimat**
   Gi et realistisk estimat for transformasjonen:
   - Materialer
   - Arbeid (hvis håndverker trengs)
   - Totalt
   - Vurder om brukerens budsjett er realistisk

9. **Gjennomføring**
   - Hva kan gjøres selv?
   - Hva krever fagfolk?
   - Lovpålagt (TEK17, elektriker, rørlegger)?
   - Estimert tidsbruk

VIKTIG:
- Vær EKSTREMT detaljert og spesifikk
- Bruk norske termer og standarder
- Referer til konkrete produkter og leverandører
- Gi realistiske kostnadsestimater (2025 priser)
- Vær ærlig om budsjettets realisme
- Fokuser på gjennomførbarhet for vanlige nordmenn

Svar på norsk med profesjonell, men vennlig tone.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  console.log('✅ Claude Opus analyse fullført');
  console.log(`   Tokens brukt: ${response.usage.input_tokens} input, ${response.usage.output_tokens} output`);

  return {
    text: response.content[0].text,
    metadata: {
      model: 'claude-3-opus-20240229',
      tokens: response.usage,
      timestamp: new Date().toISOString(),
    },
  };
}

// ============================================
// GENERER BILDE MED DALL-E 3
// ============================================

export async function generateImage(analysisText, options = {}) {
  const { style, budget } = options;

  console.log('🎨 Genererer bilde med DALL-E 3...');

  // Ekstraher nøkkelinformasjon fra analysen
  const imagePrompt = buildImagePrompt(analysisText, style, budget);

  console.log('📝 DALL-E Prompt:', imagePrompt.substring(0, 200) + '...');

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt,
    n: 1,
    size: '1024x1024',
    quality: 'hd',
    style: 'natural',
  });

  console.log('✅ Bilde generert');

  return response.data[0].url;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getBudgetGuidance(budget) {
  if (!budget) return '';

  if (budget < 80000) {
    return `   BUDSJETT: LAVT (${(budget/1000).toFixed(0)}k kr)
   - Fokuser på rimelige løsninger
   - Flatpakket kjøkken (IKEA KNOXHULT/ENHET)
   - Laminat benkeplate
   - Standard hvitevarer
   - Mye egeninnsats
   - Unngå: marmor, stein, custom-løsninger`;
  } else if (budget < 150000) {
    return `   BUDSJETT: MIDDELS (${(budget/1000).toFixed(0)}k kr)
   - God balanse mellom kvalitet og pris
   - Flatpakket eller semi-custom (IKEA METOD, Epoq, Kvik)
   - Kompositt benkeplate
   - Gode hvitevarer
   - Noe håndverkerhjelp mulig`;
  } else {
    return `   BUDSJETT: HØYT (${(budget/1000).toFixed(0)}k kr)
   - Premium materialer og løsninger
   - Custom kjøkken (HTH, Sigdal Premium)
   - Kvarts, marmor eller granitt benkeplate
   - Premium hvitevarer
   - Profesjonell installasjon`;
  }
}

function getStyleGuidance(style) {
  const styles = {
    moderne: 'Moderne skandinavisk: rene linjer, minimalistisk, lyse farger, naturlige materialer',
    klassisk: 'Klassisk eleganse: tidløse detaljer, symmetri, kvalitetsmaterialer, dempede farger',
    skandinavisk: 'Skandinavisk: lyst, luftig, naturlige materialer, funksjonelt, hygge',
    industriell: 'Industriell: rå materialer, metall, betong, åpne løsninger, mørke toner',
    landlig: 'Landlig: varmt, koselig, tre, naturlige teksturer, rustikk sjarm',
    minimalistisk: 'Minimalistisk: enkelt, rent, få elementer, nøytrale farger, funksjonalitet',
  };

  return style && styles[style]
    ? `   STIL: ${styles[style]}`
    : '';
}

function buildImagePrompt(analysisText, style, budget) {
  // Dette er en forenklet versjon - i produksjon ville vi brukt AI til å ekstrahere nøkkelinfo
  return `A photorealistic interior design image of a Norwegian home room.
Style: ${style || 'modern Scandinavian'}
Budget level: ${budget < 100000 ? 'affordable' : budget < 200000 ? 'mid-range' : 'premium'}

The image should look like a professional interior photography shot, not a 3D rendering.
Natural lighting, clean composition, realistic materials and textures.
Norwegian design standards and aesthetics.

High quality, 4K, professional interior photography.`;
}

