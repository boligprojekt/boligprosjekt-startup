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
        console.log('⚠️ Ingen API-nøkkel funnet - kjører i demo-modus');
        console.log('For ekte AI-generering: Sett OPENAI_API_KEY i config.js');
        return generateDemoResult();
    }

    try {
        console.log('🚀 Starter ekte AI-generering med 2-stegs prosess:');
        console.log('   Steg 1: GPT-4 Vision analyserer bildet');
        console.log('   Steg 2: DALL-E 3 genererer nytt bilde');

        // STEG 1: Analyser bildet med GPT-4 Vision
        console.log('📸 Konverterer bilde til base64...');
        const base64Image = await fileToBase64(imageFile);

        console.log('🔍 Sender bilde til GPT-4 Vision for analyse...');
        const imageAnalysis = await analyzeImageWithGPT4Vision(base64Image, selectedStyle, selectedBudget);

        console.log('✅ Bildeanalyse mottatt:', imageAnalysis.substring(0, 200) + '...');

        // STEG 2: Generer nytt bilde med DALL-E 3 basert på analysen
        console.log('🎨 Genererer nytt bilde med DALL-E 3...');
        const generatedImageUrl = await generateImageWithDALLE3(imageAnalysis, prompt);

        console.log('✅ Bilde generert!', generatedImageUrl);

        return {
            imageUrl: generatedImageUrl,
            explanation: generateExplanation(selectedStyle, selectedBudget),
            analysis: imageAnalysis // For debugging
        };

    } catch (error) {
        console.error('❌ OpenAI API Error:', error);
        alert(`AI-generering feilet: ${error.message}\n\nViser demo-resultat i stedet.`);
        return generateDemoResult();
    }
}

// ============================================
// STEG 1: ANALYSER BILDE MED GPT-4 VISION
// ============================================
async function analyzeImageWithGPT4Vision(base64Image, style, budget) {
    const analysisPrompt = `Du er en ekspert på interiørdesign og romanalyse.

Analyser dette bildet nøye og beskriv:

1. **Romtype**: Er dette et kjøkken, bad, soverom, stue, eller annet?
2. **Nåværende stil**: Hvilken stil har rommet nå? (moderne, klassisk, skandinavisk, etc.)
3. **Fargepalett**: Hvilke farger dominerer?
4. **Lysforhold**: Naturlig lys, kunstig lys, lyse/mørke toner?
5. **Romstørrelse**: Lite, middels, stort rom?
6. **Arkitektoniske detaljer**: Vinduer, dører, takehøyde, vegger
7. **Møbler/innredning**: Hva finnes i rommet?
8. **Materialer**: Tre, metall, stein, tekstiler?
9. **Layout**: Hvordan er rommet organisert?
10. **Tilstand**: Nytt, slitt, trenger oppussing?

Vær EKSTREMT detaljert og presis. Dette brukes til å generere et nytt bilde.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o', // GPT-4 Omni (multimodal)
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: analysisPrompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                                detail: 'high' // High detail for better analysis
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000,
            temperature: 0.3 // Lower temperature for more accurate analysis
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('GPT-4 Vision API Error:', errorData);
        throw new Error(`GPT-4 Vision feilet: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('📊 GPT-4 Vision API Response:', data);

    return data.choices[0].message.content;
}

// ============================================
// STEG 2: GENERER BILDE MED DALL-E 3
// ============================================
async function generateImageWithDALLE3(imageAnalysis, stylePrompt) {
    const dallePrompt = `Basert på denne romanalysen, lag et fotorealistisk bilde av samme rom, men med ny stil og materialer:

ROMANALYSE:
${imageAnalysis}

ØNSKET ENDRING:
${stylePrompt}

VIKTIGE KRAV:
1. BEHOLD eksakt samme romstørrelse, vinduer, dører og arkitektur
2. BEHOLD samme layout og romorganisering
3. ENDRE kun: farger, materialer, møbler, stil, overflater
4. Lag et FOTOREALISTISK bilde (ikke 3D-rendering)
5. Bildet skal se ut som et profesjonelt interiørfoto
6. Bruk norske standarder og produkter
7. Tilpass materialvalg til budsjett

RESULTAT: Et fotorealistisk interiørbilde av samme rom med ny stil.`;

    console.log('📝 DALL-E 3 Prompt:', dallePrompt.substring(0, 300) + '...');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'dall-e-3',
            prompt: dallePrompt,
            n: 1,
            size: '1024x1024',
            quality: 'hd', // HD quality for better results
            style: 'natural' // Natural photographic style
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('DALL-E 3 API Error:', errorData);
        throw new Error(`DALL-E 3 feilet: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('🎨 DALL-E 3 API Response:', data);

    return data.data[0].url;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            console.log(`✅ Bilde konvertert til base64 (${(base64.length / 1024).toFixed(2)} KB)`);
            resolve(base64);
        };
        reader.onerror = (error) => {
            console.error('❌ Feil ved konvertering til base64:', error);
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

function generateDemoResult() {
    console.log('⚠️ DEMO-MODUS: Viser statisk bilde fra Unsplash');
    console.log('💡 For ekte AI-generering:');
    console.log('   1. Opprett config.js i deploy/ mappen');
    console.log('   2. Legg til: window.OPENAI_API_KEY = "sk-...";');
    console.log('   3. Få API-nøkkel fra https://platform.openai.com/');

    return {
        imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1024&h=1024&fit=crop',
        explanation: generateExplanation(selectedStyle, selectedBudget),
        isDemo: true
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

    // Add demo warning if in demo mode
    let explanationHTML = result.explanation;
    if (result.isDemo) {
        explanationHTML = `
            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">⚠️ Demo-modus</h4>
                <p style="color: #78350f; margin: 0; font-size: 14px;">
                    Dette er et statisk demo-bilde. For ekte AI-generering basert på ditt opplastede bilde,
                    må du sette opp OpenAI API-nøkkel i config.js.
                </p>
            </div>
        ` + explanationHTML;
    }

    resultText.innerHTML = explanationHTML;

    console.log('✅ Resultat vist til bruker');
}
