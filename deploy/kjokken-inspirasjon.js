// AI Kjøkken-inspirasjon
// Bruker OpenAI DALL-E API for å generere realistiske kjøkkenbilder

let uploadedImages = [];
let selectedStyle = '';
let selectedBudget = 3;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
    initializeStyleSelector();
    initializeBudgetSlider();
    initializeGenerateButton();
});

// ============================================
// 1. BILDEOPPLASTING
// ============================================

function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const maxFiles = 3;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    for (let file of files) {
        if (uploadedImages.length >= maxFiles) {
            alert(`Du kan maksimalt laste opp ${maxFiles} bilder`);
            break;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('Kun JPG og PNG bilder er tillatt');
            continue;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('Bildet er for stort. Maks 10MB');
            continue;
        }

        uploadedImages.push(file);
        displayPreview(file);
    }

    updateGenerateButton();
}

function displayPreview(file) {
    const previewContainer = document.getElementById('previewContainer');
    const reader = new FileReader();

    reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button class="remove-btn" onclick="removeImage(${uploadedImages.length - 1})">×</button>
        `;
        previewContainer.appendChild(div);
    };

    reader.readAsDataURL(file);
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    uploadedImages.forEach(file => displayPreview(file));
    updateGenerateButton();
}

// ============================================
// 2. STILVELGER
// ============================================

function initializeStyleSelector() {
    const styleOptions = document.querySelectorAll('.style-option');
    
    styleOptions.forEach(option => {
        option.addEventListener('click', () => {
            styleOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedStyle = option.dataset.style;
            updateGenerateButton();
        });
    });
}

// ============================================
// 3. BUDSJETTVELGER
// ============================================

function initializeBudgetSlider() {
    const slider = document.getElementById('budgetSlider');
    
    slider.addEventListener('input', (e) => {
        selectedBudget = parseInt(e.target.value);
    });
}

// ============================================
// 4. GENERER-KNAPP
// ============================================

function initializeGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    
    generateBtn.addEventListener('click', async () => {
        if (uploadedImages.length === 0 || !selectedStyle) {
            alert('Vennligst last opp minst ett bilde og velg en stil');
            return;
        }

        await generateInspiration();
    });
}

function updateGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = uploadedImages.length === 0 || !selectedStyle;
}

// ============================================
// 5. AI-GENERERING
// ============================================

async function generateInspiration() {
    const resultSection = document.getElementById('resultSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContent = document.getElementById('resultContent');

    // Show loading
    resultSection.classList.add('show');
    loadingIndicator.style.display = 'block';
    resultContent.style.display = 'none';

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });

    try {
        // Get user description
        const description = document.getElementById('descriptionText').value;

        // Generate AI prompt
        const prompt = generatePrompt(selectedStyle, selectedBudget, description);

        // Call OpenAI API
        const result = await callOpenAI(uploadedImages[0], prompt);

        // Display result
        displayResult(result);

    } catch (error) {
        console.error('Error:', error);
        alert('Noe gikk galt. Vennligst prøv igjen.');
        resultSection.classList.remove('show');
    }
}

function generatePrompt(style, budget, userDescription) {
    const budgetText = {
        1: 'lavt budsjett (50 000-80 000 kr)',
        2: 'lavt til middels budsjett (80 000-120 000 kr)',
        3: 'middels budsjett (120 000-180 000 kr)',
        4: 'middels til høyt budsjett (180 000-250 000 kr)',
        5: 'høyt budsjett (250 000+ kr)'
    };

    const styleDescriptions = {
        'moderne': 'moderne stil med rene linjer, glatte fronter, minimalistisk design, nøytrale farger (hvit, grå, sort)',
        'klassisk': 'klassisk stil med rammedfronter, tradisjonelle detaljer, varme farger (beige, creme, lys grå)',
        'skandinavisk': 'skandinavisk stil med lyse trefarger (bjørk, eik), enkle linjer, funksjonelt design, hvite og lyse farger',
        'industriell': 'industriell stil med mørke farger, metall-detaljer, åpne hyller, betong-look eller mørk benkeplate',
        'landlig': 'landlig stil med synlig trestruktur, varme farger, klassiske detaljer, koselig uttrykk',
        'minimalistisk': 'minimalistisk stil med helt glatte fronter uten håndtak, monokrome farger, ekstremt rene linjer'
    };

    const budgetConstraints = {
        1: 'Bruk kun rimelige materialer: laminat benkeplate, flatpakket kjøkken (IKEA-stil), enkle fronter, standard hvitevarer. Unngå: marmor, stein, spesialtilpasninger.',
        2: 'Bruk rimelige til middels materialer: laminat eller enkel kompositt benkeplate, flatpakket kjøkken med oppgraderte fronter. Unngå: marmor, eksklusive materialer.',
        3: 'Bruk middels kvalitet materialer: kompositt benkeplate, god kvalitet flatpakket eller semi-custom kjøkken, gode hvitevarer. Kan ha noen påkostede detaljer.',
        4: 'Bruk god kvalitet materialer: kompositt eller kvarts benkeplate, semi-custom kjøkken, premium hvitevarer. Kan ha flere påkostede detaljer.',
        5: 'Bruk premium materialer: kvarts, marmor eller granitt benkeplate, custom kjøkken, premium hvitevarer og detaljer.'
    };

    const prompt = `Du er en digital interiørrådgiver spesialisert på realistisk kjøkken-inspirasjon for vanlige boliger i Norge.

OPPGAVE: Lag en realistisk inspirasjonsvisualisering av dette kjøkkenet i ${styleDescriptions[style]}.

BUDSJETT: ${budgetText[budget]}
${budgetConstraints[budget]}

${userDescription ? `BRUKERENS ØNSKER: ${userDescription}` : ''}

VIKTIGE REGLER:
1. BEHOLD rommets eksakte proporsjoner, vinduer, dører og planløsning
2. IKKE endre rommets størrelse eller arkitektur
3. Fokuser på: fronter, farger, benkeplate, overflater, helhetsstil
4. Lag et REALISTISK kjøkken som faktisk kan kjøpes i Norge
5. Tilpass materialvalg til budsjettet
6. Unngå luksusløsninger som ikke passer budsjettet
7. Behold samme type kjøkkenløsning (U-form, L-form, etc.)

RESULTAT: Et fotorealistisk bilde av samme kjøkken, men med ny stil og materialer som passer budsjettet.`;

    return prompt;
}

async function callOpenAI(imageFile, prompt) {
    // Check if API key exists
    if (!window.OPENAI_API_KEY) {
        // Demo mode - return mock result
        return generateDemoResult();
    }

    try {
        // Convert image to base64
        const base64Image = await fileToBase64(imageFile);

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard'
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();

        return {
            imageUrl: data.data[0].url,
            explanation: generateExplanation(selectedStyle, selectedBudget)
        };

    } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to demo mode
        return generateDemoResult();
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function generateDemoResult() {
    // Demo mode - return placeholder
    return {
        imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1024&h=1024&fit=crop',
        explanation: generateExplanation(selectedStyle, selectedBudget)
    };
}

function generateExplanation(style, budget) {
    const styleNames = {
        'moderne': 'moderne',
        'klassisk': 'klassiske',
        'skandinavisk': 'skandinaviske',
        'industriell': 'industrielle',
        'landlig': 'landlige',
        'minimalistisk': 'minimalistiske'
    };

    const budgetMatch = budget >= 3 ? 'passer godt' : budget === 2 ? 'kan bli stramt' : 'kan være utfordrende';

    const materialSuggestions = {
        1: 'flatpakket kjøkken (IKEA KNOXHULT/ENHET) med laminat benkeplate',
        2: 'flatpakket kjøkken (IKEA METOD) med oppgraderte fronter og laminat/enkel kompositt benkeplate',
        3: 'flatpakket eller semi-custom kjøkken (IKEA METOD, Epoq, Kvik) med kompositt benkeplate',
        4: 'semi-custom kjøkken (Epoq, Kvik, Sigdal) med kvarts eller kompositt benkeplate',
        5: 'custom kjøkken (HTH, Sigdal Premium) med kvarts, marmor eller granitt benkeplate'
    };

    const visualImpact = {
        'moderne': 'Glatte fronter og nøytrale farger gir et tidløst og romslig uttrykk',
        'klassisk': 'Rammedfronter og varme farger skaper en elegant og hjemmekoselig atmosfære',
        'skandinavisk': 'Lyse trefarger og enkle linjer gir et luftig og nordisk uttrykk',
        'industriell': 'Mørke farger og råe materialer skaper et urbant og moderne uttrykk',
        'landlig': 'Synlig trestruktur og varme farger gir en koselig og tradisjonell følelse',
        'minimalistisk': 'Håndtaksfrie fronter og monokrome farger gir et ekstremt rent og moderne uttrykk'
    };

    return `
        <h3 style="margin-bottom: 12px; color: #0f172a;">Forklaring</h3>
        <p style="margin-bottom: 12px; color: #475569;">
            Dette ${styleNames[style]} uttrykket passer godt til rommets proporsjoner og lysforhold.
            ${visualImpact[style]}.
        </p>

        <h4 style="margin-top: 16px; margin-bottom: 8px; color: #0f172a;">Materialretning</h4>
        <p style="margin-bottom: 12px; color: #475569;">
            ${materialSuggestions[budget]}
        </p>

        <h4 style="margin-top: 16px; margin-bottom: 8px; color: #0f172a;">Budsjettmatch</h4>
        <p style="margin-bottom: 12px; color: #475569;">
            Med ditt valgte budsjett ${budgetMatch} dette uttrykket.
            ${budget < 3 ? 'Vurder å prioritere de viktigste elementene først.' : 'Du har god margin for kvalitetsmaterialer.'}
        </p>

        <h4 style="margin-top: 16px; margin-bottom: 8px; color: #0f172a;">Anbefalte leverandører</h4>
        <p style="color: #475569;">
            ${budget <= 2 ? 'IKEA, Byggmakker, Maxbo' : budget === 3 ? 'IKEA METOD, Epoq, Kvik' : budget === 4 ? 'Epoq, Kvik, Sigdal' : 'HTH, Sigdal Premium, Kvik Premium'}
        </p>
    `;
}

function displayResult(result) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContent = document.getElementById('resultContent');
    const originalImage = document.getElementById('originalImage');
    const generatedImage = document.getElementById('generatedImage');
    const resultText = document.getElementById('resultText');

    // Hide loading, show result
    loadingIndicator.style.display = 'none';
    resultContent.style.display = 'block';

    // Display images
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(uploadedImages[0]);

    generatedImage.src = result.imageUrl;
    resultText.innerHTML = result.explanation;
}
