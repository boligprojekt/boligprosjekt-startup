import Anthropic from '@anthropic-ai/sdk';

// Debug: Sjekk API-nøkkel
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('🔑 Anthropic API Key status:');
console.log(`   Exists: ${!!apiKey}`);
console.log(`   Length: ${apiKey ? apiKey.length : 0}`);
console.log(`   Starts with: ${apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING'}`);

const anthropic = new Anthropic({
  apiKey: apiKey,
});

// ============================================
// STREAM CHAT MED CLAUDE
// ============================================

export async function streamChat(messages, options = {}, onChunk) {
  const { context } = options;

  console.log('💬 Starter chat med Claude...');
  console.log(`   Meldinger: ${messages.length}`);
  console.log(`   Context: ${context || 'general'}`);

  // Bygg system prompt basert på context
  const systemPrompt = getSystemPrompt(context);

  // Send initial status
  onChunk({
    type: 'status',
    message: 'Tenker...',
    progress: 0
  });

  try {
    // Start streaming fra Claude
    const stream = await anthropic.messages.stream({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
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
        progress: Math.min(95, tokenCount * 2)
      });
    });

    stream.on('message', (message) => {
      console.log('✅ Chat fullført');
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
      console.error('❌ Chat error:', error);
      onChunk({
        type: 'error',
        message: error.message
      });
    });

    // Vent på at stream er ferdig
    await stream.finalMessage();

  } catch (error) {
    console.error('❌ Feil ved chat:', error);
    onChunk({
      type: 'error',
      message: error.message
    });
    throw error;
  }
}

// ============================================
// SYSTEM PROMPTS
// ============================================

function getSystemPrompt(context) {
  const prompts = {
    interior_design: `Du er en ekspert norsk interiørarkitekt og AI-assistent.

ROLLE:
- Hjelp brukere med å visualisere og planlegge interiørprosjekter
- Gi konkrete, gjennomførbare råd
- Fokuser på norske forhold, leverandører og priser
- Vær vennlig, profesjonell og inspirerende

OPPGAVER:
1. Lytt til brukerens beskrivelse av rommet
2. Still oppfølgingsspørsmål for å få mer detaljer
3. Gi konkrete forslag til stil, farger, materialer
4. Anbefal norske leverandører (IKEA, Kvik, HTH, Sigdal, etc.)
5. Gi realistiske budsjettestimater (2025 priser)
6. Foreslå visualisering når du har nok informasjon

VIKTIG:
- Bruk norske termer og standarder
- Referer til TEK17 når relevant
- Vær realistisk om kostnader og tidsbruk
- Spør om budsjett, stil-preferanser, og praktiske behov
- Når du har nok informasjon, si: "Jeg kan visualisere dette for deg!"

STIL:
- Vennlig og personlig
- Profesjonell men ikke formell
- Bruk emojis sparsomt (👍 ✨ 🏠)
- Korte avsnitt, lett å lese

Svar alltid på norsk.`,

    general: `Du er en hjelpsom AI-assistent.

Svar alltid på norsk med en vennlig og profesjonell tone.`
  };

  return prompts[context] || prompts.general;
}

