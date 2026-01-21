import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================
// STREAM ANALYSE MED CLAUDE OPUS
// ============================================

export async function streamAnalysis(imageBuffer, options = {}, onChunk) {
  const { style, budget, description } = options;

  console.log('🌊 Starter streaming analyse med Claude Opus...');
  
  // Optimaliser bilde
  const optimizedImage = await sharp(imageBuffer)
    .resize(1568, 1568, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const base64Image = optimizedImage.toString('base64');
  
  console.log(`   Bildestørrelse: ${(base64Image.length / 1024).toFixed(2)} KB`);

  // Bygg prompt
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
2. **Arkitektoniske detaljer**
3. **Nåværende stil og uttrykk**
4. **Lysforhold**
5. **Tilstand og utfordringer**
6. **Transformasjonsforslag**
${styleGuidance}
${budgetGuidance}
7. **Norske leverandører og produkter**
8. **Budsjettestimat**
9. **Gjennomføring**

Vær EKSTREMT detaljert og spesifikk. Bruk norske termer og standarder.
Svar på norsk med profesjonell, men vennlig tone.`;

  // Send initial status
  onChunk({
    type: 'status',
    message: 'Analyserer bilde med Claude Opus...',
    progress: 0
  });

  try {
    // Start streaming fra Claude
    const stream = await anthropic.messages.stream({
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

    let fullText = '';
    let tokenCount = 0;

    // Lytt til stream events
    stream.on('text', (text, snapshot) => {
      fullText = snapshot;
      tokenCount++;

      // Send tekst-chunk til frontend
      onChunk({
        type: 'text',
        content: text,
        fullText: fullText,
        progress: Math.min(95, tokenCount * 2) // Estimert progress
      });
    });

    stream.on('message', (message) => {
      console.log('✅ Streaming fullført');
      console.log(`   Tokens: ${message.usage.input_tokens} input, ${message.usage.output_tokens} output`);

      // Send final status
      onChunk({
        type: 'complete',
        fullText: fullText,
        metadata: {
          model: 'claude-3-opus-20240229',
          tokens: message.usage,
          timestamp: new Date().toISOString(),
        },
        progress: 100
      });
    });

    stream.on('error', (error) => {
      console.error('❌ Streaming error:', error);
      onChunk({
        type: 'error',
        message: error.message
      });
    });

    // Vent på at stream er ferdig
    await stream.finalMessage();

  } catch (error) {
    console.error('❌ Feil ved streaming:', error);
    onChunk({
      type: 'error',
      message: error.message
    });
    throw error;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getBudgetGuidance(budget) {
  if (!budget) return '';

  if (budget < 80000) {
    return `   BUDSJETT: LAVT (${(budget/1000).toFixed(0)}k kr) - Fokuser på rimelige løsninger`;
  } else if (budget < 150000) {
    return `   BUDSJETT: MIDDELS (${(budget/1000).toFixed(0)}k kr) - God balanse mellom kvalitet og pris`;
  } else {
    return `   BUDSJETT: HØYT (${(budget/1000).toFixed(0)}k kr) - Premium materialer og løsninger`;
  }
}

function getStyleGuidance(style) {
  const styles = {
    moderne: 'Moderne skandinavisk: rene linjer, minimalistisk, lyse farger',
    klassisk: 'Klassisk eleganse: tidløse detaljer, symmetri, kvalitetsmaterialer',
    skandinavisk: 'Skandinavisk: lyst, luftig, naturlige materialer, funksjonelt',
    industriell: 'Industriell: rå materialer, metall, betong, mørke toner',
    landlig: 'Landlig: varmt, koselig, tre, naturlige teksturer',
    minimalistisk: 'Minimalistisk: enkelt, rent, få elementer, nøytrale farger',
  };

  return style && styles[style] ? `   STIL: ${styles[style]}` : '';
}

