// ============================================
// AI CHAT - SANDBOX.DEV STIL
// ============================================
// Venstre: Chat med Claude
// Høyre: Live preview av rom-visualisering

// Backend URL
const BACKEND_URL = window.AI_BACKEND_URL || 'http://localhost:3001';

// DOM elements
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const previewContent = document.getElementById('previewContent');
const previewStatus = document.getElementById('previewStatus');

// Chat history
let chatHistory = [];
let currentRoomDescription = '';

console.log('🚀 AI Chat initialisert');
console.log(`   Backend: ${BACKEND_URL}`);

// ============================================
// EVENT LISTENERS
// ============================================

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

// ============================================
// SEND MESSAGE
// ============================================

async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;

    console.log('📤 Sender melding:', message);

    // Disable input
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Add user message to chat
    addMessage('user', message);

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';

    // Add to history
    chatHistory.push({
        role: 'user',
        content: message
    });

    try {
        // Send to Claude via backend
        await streamChatResponse(message);

    } catch (error) {
        console.error('❌ Feil ved sending:', error);
        addMessage('assistant', '❌ Beklager, noe gikk galt. Prøv igjen.');
    } finally {
        // Re-enable input
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// ============================================
// STREAM CHAT RESPONSE
// ============================================

async function streamChatResponse(userMessage) {
    console.log('🌊 Starter streaming fra Claude...');

    // Create assistant message placeholder
    const messageDiv = addMessage('assistant', '');
    const contentDiv = messageDiv.querySelector('.message-content');

    let fullResponse = '';

    try {
        const response = await fetch(`${BACKEND_URL}/api/chat-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: chatHistory,
                context: 'interior_design'
            }),
        });

        if (!response.ok) {
            throw new Error('Chat request failed');
        }

        // Read Server-Sent Events
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('✅ Streaming fullført');
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        console.log('🏁 Chat ferdig');
                        continue;
                    }

                    try {
                        const chunk = JSON.parse(data);
                        
                        if (chunk.type === 'text') {
                            fullResponse += chunk.content;
                            contentDiv.innerHTML = formatMessage(fullResponse);
                            scrollToBottom();
                        } else if (chunk.type === 'complete') {
                            fullResponse = chunk.fullText;
                            contentDiv.innerHTML = formatMessage(fullResponse);
                            
                            // Add to history
                            chatHistory.push({
                                role: 'assistant',
                                content: fullResponse
                            });

                            // Check if we should generate preview
                            checkForVisualization(fullResponse);
                        }
                    } catch (e) {
                        console.error('❌ Parse error:', e);
                    }
                }
            }
        }

    } catch (error) {
        console.error('❌ Streaming feilet:', error);
        contentDiv.innerHTML = '❌ Beklager, noe gikk galt. Prøv igjen.';
    }
}

// ============================================
// ADD MESSAGE TO CHAT
// ============================================

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'user' ? 'DU' : 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

function formatMessage(text) {
    // Simple markdown-like formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// CHECK FOR VISUALIZATION
// ============================================

function checkForVisualization(response) {
    // Check if response contains room description
    const keywords = ['kjøkken', 'bad', 'soverom', 'stue', 'rom', 'visualiser', 'se ut'];
    const hasRoomDescription = keywords.some(keyword =>
        response.toLowerCase().includes(keyword)
    );

    if (hasRoomDescription && chatHistory.length >= 2) {
        console.log('🎨 Genererer visualisering...');
        generateVisualization();
    }
}

// ============================================
// GENERATE VISUALIZATION
// ============================================

async function generateVisualization() {
    console.log('🎨 Starter visualisering...');

    // Update preview status
    previewStatus.textContent = 'Genererer...';
    previewStatus.style.background = '#f59e0b';

    // Show loading indicator
    previewContent.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <div class="loading-text">Genererer visualisering med DALL-E 3...</div>
        </div>
    `;

    try {
        // Extract room description from chat history
        const roomDescription = extractRoomDescription();

        console.log('📝 Rom-beskrivelse:', roomDescription);

        // Generate image via backend
        const response = await fetch(`${BACKEND_URL}/api/generate-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: buildImagePrompt(roomDescription),
                context: 'interior_design'
            }),
        });

        if (!response.ok) {
            throw new Error('Image generation failed');
        }

        const data = await response.json();

        console.log('✅ Bilde generert:', data.imageUrl);

        // Show image
        previewContent.innerHTML = `
            <img src="${data.imageUrl}" alt="AI-generert rom" class="preview-image">
        `;

        previewStatus.textContent = 'Ferdig!';
        previewStatus.style.background = '#10b981';

    } catch (error) {
        console.error('❌ Visualisering feilet:', error);

        previewContent.innerHTML = `
            <div class="preview-placeholder">
                <h2>❌ Kunne ikke generere bilde</h2>
                <p>Prøv å beskrive rommet mer detaljert i chatten.</p>
            </div>
        `;

        previewStatus.textContent = 'Feilet';
        previewStatus.style.background = '#ef4444';
    }
}

// ============================================
// EXTRACT ROOM DESCRIPTION
// ============================================

function extractRoomDescription() {
    // Combine user messages to get full room description
    const userMessages = chatHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');

    return userMessages;
}

// ============================================
// BUILD IMAGE PROMPT
// ============================================

function buildImagePrompt(description) {
    return `A photorealistic interior design image of a Norwegian home room.

User description: ${description}

The image should look like professional interior photography, not a 3D rendering.
Natural lighting, clean composition, realistic materials and textures.
Norwegian design standards and aesthetics.

High quality, 4K, professional interior photography.`;
}

// ============================================
// INITIAL HEALTH CHECK
// ============================================

async function checkBackendHealth() {
    try {
        const response = await fetch(`${BACKEND_URL}/health`);
        const data = await response.json();

        console.log('✅ Backend tilgjengelig');
        console.log(`   Service: ${data.service}`);
        console.log(`   Version: ${data.version}`);

        return true;
    } catch (error) {
        console.error('❌ Backend ikke tilgjengelig:', error);
        console.error('   Sjekk at backend kjører på:', BACKEND_URL);

        // Show error in chat
        addMessage('assistant', `❌ Kunne ikke koble til backend på ${BACKEND_URL}. Sjekk at serveren kjører.`);

        return false;
    }
}

// Check backend on load
checkBackendHealth();

