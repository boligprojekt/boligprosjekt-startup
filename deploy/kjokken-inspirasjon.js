// AI Generert Inspirasjon
// Bruker OpenAI DALL-E API for å generere realistiske rom-visualiseringer

let uploadedImages = [];
let selectedStyle = '';
let selectedBudget = 150000; // Default 150k kr

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
    const manualInput = document.getElementById('budgetManual');
    const budgetDisplay = document.getElementById('budgetDisplay');

    function updateBudgetDisplay(value) {
        selectedBudget = parseInt(value);
        const formatted = selectedBudget.toLocaleString('no-NO');
        budgetDisplay.textContent = `${formatted} kr`;
    }

    slider.addEventListener('input', (e) => {
        const value = e.target.value;
        updateBudgetDisplay(value);
        manualInput.value = value;
    });

    manualInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value) || 50000;
        if (value < 50000) value = 50000;
        if (value > 500000) value = 500000;

        updateBudgetDisplay(value);
        slider.value = Math.min(value, 300000); // Slider max is 300k
    });

    // Initialize display
    updateBudgetDisplay(150000);
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
    // Determine budget category based on amount
    let budgetCategory, budgetText, budgetConstraint;

    if (budget < 80000) {
        budgetCategory = 'lavt';
        budgetText = `lavt budsjett (${(budget/1000).toFixed(0)}k kr)`;
        budgetConstraint = 'Bruk kun rimelige materialer: laminat benkeplate, flatpakket kjøkken (IKEA-stil), enkle fronter, standard hvitevarer. Unngå: marmor, stein, spesialtilpasninger.';
    } else if (budget < 120000) {
        budgetCategory = 'lavt-middels';
        budgetText = `lavt til middels budsjett (${(budget/1000).toFixed(0)}k kr)`;
        budgetConstraint = 'Bruk rimelige til middels materialer: laminat eller enkel kompositt benkeplate, flatpakket kjøkken med oppgraderte fronter. Unngå: marmor, eksklusive materialer.';
    } else if (budget < 180000) {
        budgetCategory = 'middels';
        budgetText = `middels budsjett (${(budget/1000).toFixed(0)}k kr)`;
        budgetConstraint = 'Bruk middels kvalitet materialer: kompositt benkeplate, god kvalitet flatpakket eller semi-custom kjøkken, gode hvitevarer. Kan ha noen påkostede detaljer.';
    } else if (budget < 250000) {
        budgetCategory = 'middels-høyt';
        budgetText = `middels til høyt budsjett (${(budget/1000).toFixed(0)}k kr)`;
        budgetConstraint = 'Bruk god kvalitet materialer: kompositt eller kvarts benkeplate, semi-custom kjøkken, premium hvitevarer. Kan ha flere påkostede detaljer.';
    } else {
        budgetCategory = 'høyt';
        budgetText = `høyt budsjett (${(budget/1000).toFixed(0)}k kr)`;
        budgetConstraint = 'Bruk premium materialer: kvarts, marmor eller granitt benkeplate, custom kjøkken, premium hvitevarer og detaljer.';
    }

    const styleDescriptions = {
        'moderne': 'moderne stil med rene linjer, glatte fronter, minimalistisk design, nøytrale farger (hvit, grå, sort)',
        'klassisk': 'klassisk stil med rammedfronter, tradisjonelle detaljer, varme farger (beige, creme, lys grå)',
        'skandinavisk': 'skandinavisk stil med lyse trefarger (bjørk, eik), enkle linjer, funksjonelt design, hvite og lyse farger',
        'industriell': 'industriell stil med mørke farger, metall-detaljer, åpne hyller, betong-look eller mørk benkeplate',
        'landlig': 'landlig stil med synlig trestruktur, varme farger, klassiske detaljer, koselig uttrykk',
        'minimalistisk': 'minimalistisk stil med helt glatte fronter uten håndtak, monokrome farger, ekstremt rene linjer'
    };

    const prompt = `Du er en digital interiørrådgiver spesialisert på realistisk rom-inspirasjon for vanlige boliger i Norge.

OPPGAVE: Lag en realistisk inspirasjonsvisualisering av dette rommet i ${styleDescriptions[style]}.

BUDSJETT: ${budgetText}
${budgetConstraint}

${userDescription ? `BRUKERENS ØNSKER: ${userDescription}` : ''}

VIKTIGE REGLER:
1. BEHOLD rommets eksakte proporsjoner, vinduer, dører og planløsning
2. IKKE endre rommets størrelse eller arkitektur
3. Fokuser på: fronter, farger, overflater, materialer, helhetsstil
4. Lag et REALISTISK rom som faktisk kan realiseres i Norge
5. Tilpass materialvalg til budsjettet
6. Unngå luksusløsninger som ikke passer budsjettet
7. Behold samme type romløsning og layout

RESULTAT: Et fotorealistisk bilde av samme rom, men med ny stil og materialer som passer budsjettet.`;

    return prompt;
}

async function callOpenAI(imageFile, prompt) {
    // Check if API key exists
    if (!window.OPENAI_API_KEY || window.OPENAI_API_KEY === '') {
        console.log('Ingen API-nøkkel funnet - kjører i demo-modus');
        return generateDemoResult();
    }

    try {
        // DALL-E 3 støtter ikke image edits, kun generations
        // Vi må derfor beskrive rommet i prompten i stedet for å sende bildet

        const enhancedPrompt = `Lag et fotorealistisk interiørbilde av et rom i en norsk bolig. ${prompt}

Viktig: Bildet skal se ut som et ekte foto tatt med et profesjonelt kamera, ikke en 3D-rendering.`;

        // Call OpenAI DALL-E 3 API
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: enhancedPrompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();

        return {
            imageUrl: data.data[0].url,
            explanation: generateExplanation(selectedStyle, selectedBudget)
        };

    } catch (error) {
        console.error('OpenAI API Error:', error);
        alert(`AI-generering feilet: ${error.message}. Viser demo-resultat i stedet.`);
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

    let budgetMatch, materialSuggestion;

    if (budget < 80000) {
        budgetMatch = 'kan være utfordrende';
        materialSuggestion = 'flatpakket kjøkken (IKEA KNOXHULT/ENHET) med laminat benkeplate';
    } else if (budget < 120000) {
        budgetMatch = 'kan bli stramt';
        materialSuggestion = 'flatpakket kjøkken (IKEA METOD) med oppgraderte fronter og laminat/enkel kompositt benkeplate';
    } else if (budget < 180000) {
        budgetMatch = 'passer godt';
        materialSuggestion = 'flatpakket eller semi-custom kjøkken (IKEA METOD, Epoq, Kvik) med kompositt benkeplate';
    } else if (budget < 250000) {
        budgetMatch = 'passer veldig godt';
        materialSuggestion = 'semi-custom kjøkken (Epoq, Kvik, Sigdal) med kvarts eller kompositt benkeplate';
    } else {
        budgetMatch = 'gir god margin';
        materialSuggestion = 'custom kjøkken (HTH, Sigdal Premium) med kvarts, marmor eller granitt benkeplate';
    }

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
            ${materialSuggestion}
        </p>

        <h4 style="margin-top: 16px; margin-bottom: 8px; color: #0f172a;">Budsjettmatch</h4>
        <p style="margin-bottom: 12px; color: #475569;">
            Med ditt valgte budsjett (${(budget/1000).toFixed(0)}k kr) ${budgetMatch} dette uttrykket.
            ${budget < 120000 ? 'Vurder å prioritere de viktigste elementene først.' : 'Du har god margin for kvalitetsmaterialer.'}
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
