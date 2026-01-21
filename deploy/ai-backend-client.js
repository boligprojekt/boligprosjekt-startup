// ============================================
// BOLIGPROSJEKT AI BACKEND CLIENT
// ============================================
// Kommuniserer med Node.js backend for ekte AI-generering
// Støtter streaming med Server-Sent Events

// Backend URL (sett i config.js eller bruk default)
const BACKEND_URL = window.AI_BACKEND_URL || 'http://localhost:3001';

console.log('🔌 AI Backend Client initialisert');
console.log(`   Backend URL: ${BACKEND_URL}`);

// ============================================
// ANALYSER BILDE (STANDARD RESPONS)
// ============================================

export async function analyzeImage(imageFile, options = {}) {
  const { style, budget, description } = options;

  console.log('📤 Sender bilde til backend for analyse...');
  console.log(`   Fil: ${imageFile.name} (${(imageFile.size / 1024).toFixed(2)} KB)`);
  console.log(`   Stil: ${style}`);
  console.log(`   Budsjett: ${budget} kr`);

  // Bygg FormData
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('style', style);
  formData.append('budget', budget);
  if (description) {
    formData.append('description', description);
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Analyse feilet');
    }

    const data = await response.json();
    
    console.log('✅ Analyse mottatt fra backend');
    console.log(`   Tokens: ${data.metadata.tokens.input_tokens} input, ${data.metadata.tokens.output_tokens} output`);

    return data;

  } catch (error) {
    console.error('❌ Feil ved backend-kall:', error);
    throw error;
  }
}

// ============================================
// ANALYSER BILDE (STREAMING RESPONS)
// ============================================

export async function analyzeImageStream(imageFile, options = {}, callbacks = {}) {
  const { style, budget, description } = options;
  const { onProgress, onText, onComplete, onError } = callbacks;

  console.log('🌊 Starter streaming analyse...');
  console.log(`   Fil: ${imageFile.name} (${(imageFile.size / 1024).toFixed(2)} KB)`);

  // Bygg FormData
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('style', style);
  formData.append('budget', budget);
  if (description) {
    formData.append('description', description);
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze-stream`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Streaming feilet');
    }

    // Les Server-Sent Events
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('✅ Streaming fullført');
        break;
      }

      // Dekod chunk
      buffer += decoder.decode(value, { stream: true });
      
      // Prosesser komplette linjer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Behold siste ufullstendige linje

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Fjern 'data: '
          
          if (data === '[DONE]') {
            console.log('🏁 Stream ferdig');
            continue;
          }

          try {
            const chunk = JSON.parse(data);
            
            // Håndter forskjellige chunk-typer
            switch (chunk.type) {
              case 'status':
                console.log(`📊 Status: ${chunk.message} (${chunk.progress}%)`);
                if (onProgress) onProgress(chunk.progress, chunk.message);
                break;
              
              case 'text':
                if (onText) onText(chunk.content, chunk.fullText);
                if (onProgress) onProgress(chunk.progress);
                break;
              
              case 'complete':
                console.log('✅ Analyse fullført');
                if (onComplete) onComplete(chunk.fullText, chunk.metadata);
                break;
              
              case 'error':
                console.error('❌ Feil fra backend:', chunk.message);
                if (onError) onError(chunk.message);
                break;
            }
          } catch (e) {
            console.error('❌ Feil ved parsing av chunk:', e);
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Streaming feilet:', error);
    if (onError) onError(error.message);
    throw error;
  }
}

// ============================================
// GENERER BILDE MED DALL-E
// ============================================

export async function generateImage(prompt, options = {}) {
  const { style, budget } = options;

  console.log('🎨 Ber backend generere bilde...');
  console.log(`   Prompt lengde: ${prompt.length} tegn`);

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style,
        budget
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Bildegenerering feilet');
    }

    const data = await response.json();
    
    console.log('✅ Bilde generert');
    console.log(`   URL: ${data.imageUrl.substring(0, 50)}...`);

    return data.imageUrl;

  } catch (error) {
    console.error('❌ Feil ved bildegenerering:', error);
    throw error;
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    console.log('✅ Backend er tilgjengelig');
    console.log(`   Service: ${data.service}`);
    console.log(`   Version: ${data.version}`);
    
    return true;
  } catch (error) {
    console.error('❌ Backend er ikke tilgjengelig:', error);
    return false;
  }
}

