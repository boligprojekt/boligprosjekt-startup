import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

// ============================================
// SANDBOX RUNNER
// ============================================
// Kjører i isolert Docker container
// Håndterer bildebehandling og optimalisering

console.log('🔒 Sandbox startet');
console.log(`   Node version: ${process.version}`);
console.log(`   Memory limit: ${process.env.MEMORY_LIMIT || 'unlimited'}`);
console.log(`   CPU limit: ${process.env.CPU_LIMIT || 'unlimited'}`);

// Lytt på stdin for kommandoer
process.stdin.on('data', async (data) => {
  try {
    const command = JSON.parse(data.toString());
    
    console.log(`📥 Mottok kommando: ${command.type}`);

    switch (command.type) {
      case 'optimize-image':
        await optimizeImage(command.data);
        break;
      
      case 'generate-prompt':
        await generatePrompt(command.data);
        break;
      
      case 'health-check':
        sendResponse({ status: 'healthy', timestamp: new Date().toISOString() });
        break;
      
      default:
        sendError(`Ukjent kommando: ${command.type}`);
    }
  } catch (error) {
    console.error('❌ Feil i sandbox:', error);
    sendError(error.message);
  }
});

// ============================================
// BILDEOPTIMALISERING
// ============================================

async function optimizeImage(data) {
  const { imageBuffer, maxWidth = 1568, maxHeight = 1568, quality = 85 } = data;

  console.log('🖼️  Optimaliserer bilde...');
  console.log(`   Maks størrelse: ${maxWidth}x${maxHeight}`);
  console.log(`   Kvalitet: ${quality}`);

  const buffer = Buffer.from(imageBuffer, 'base64');

  // Optimaliser med sharp
  const optimized = await sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality })
    .toBuffer();

  // Hent metadata
  const metadata = await sharp(optimized).metadata();

  console.log('✅ Bilde optimalisert');
  console.log(`   Størrelse: ${metadata.width}x${metadata.height}`);
  console.log(`   Format: ${metadata.format}`);
  console.log(`   Størrelse: ${(optimized.length / 1024).toFixed(2)} KB`);

  sendResponse({
    success: true,
    image: optimized.toString('base64'),
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: optimized.length
    }
  });
}

// ============================================
// PROMPT-GENERERING
// ============================================

async function generatePrompt(data) {
  const { analysis, style, budget } = data;

  console.log('📝 Genererer DALL-E prompt...');

  // Ekstraher nøkkelinformasjon fra analysen
  const roomType = extractRoomType(analysis);
  const colors = extractColors(analysis);
  const materials = extractMaterials(analysis);

  // Bygg prompt
  const prompt = buildPrompt({
    roomType,
    colors,
    materials,
    style,
    budget
  });

  console.log('✅ Prompt generert');
  console.log(`   Lengde: ${prompt.length} tegn`);

  sendResponse({
    success: true,
    prompt,
    metadata: {
      roomType,
      colors,
      materials
    }
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractRoomType(text) {
  const keywords = {
    'kjøkken': ['kjøkken', 'kitchen'],
    'bad': ['bad', 'bathroom', 'toalett'],
    'soverom': ['soverom', 'bedroom'],
    'stue': ['stue', 'living room', 'livingroom']
  };

  for (const [type, words] of Object.entries(keywords)) {
    if (words.some(word => text.toLowerCase().includes(word))) {
      return type;
    }
  }

  return 'rom';
}

function extractColors(text) {
  const colorKeywords = ['hvit', 'svart', 'grå', 'beige', 'blå', 'grønn', 'brun', 'lys', 'mørk'];
  const found = colorKeywords.filter(color => text.toLowerCase().includes(color));
  return found.length > 0 ? found : ['nøytral'];
}

function extractMaterials(text) {
  const materialKeywords = ['tre', 'metall', 'stein', 'marmor', 'granitt', 'laminat', 'kompositt'];
  const found = materialKeywords.filter(material => text.toLowerCase().includes(material));
  return found.length > 0 ? found : ['standard'];
}

function buildPrompt({ roomType, colors, materials, style, budget }) {
  const budgetLevel = budget < 100000 ? 'affordable' : budget < 200000 ? 'mid-range' : 'premium';
  
  return `A photorealistic interior design image of a Norwegian ${roomType}.
Style: ${style || 'modern Scandinavian'}
Colors: ${colors.join(', ')}
Materials: ${materials.join(', ')}
Budget level: ${budgetLevel}

Professional interior photography, natural lighting, 4K quality, realistic textures.
Norwegian design standards and aesthetics.`;
}

function sendResponse(data) {
  process.stdout.write(JSON.stringify({ success: true, data }) + '\n');
}

function sendError(message) {
  process.stdout.write(JSON.stringify({ success: false, error: message }) + '\n');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Sandbox shutting down...');
  process.exit(0);
});

console.log('✅ Sandbox klar til å motta kommandoer');

