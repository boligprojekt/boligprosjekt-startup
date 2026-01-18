// Prosjektplan - Viser generert oppussingsplan
// Henter data fra localStorage og genererer komplett plan

let planData = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPlanData();
    generatePlan();
});

function loadPlanData() {
    const savedPlan = localStorage.getItem('currentPlan');
    if (savedPlan) {
        planData = JSON.parse(savedPlan);
    } else {
        // Redirect back if no plan data
        window.location.href = 'planlegger.html';
        return;
    }
}

function generatePlan() {
    updateHeader();
    generateWarnings();
    generateBudgetOverview();
    generateSavingsRecommendations();
    generateSteps();
    generateProductRecommendations();
}

function updateHeader() {
    const roomNames = {
        bad: 'Bad',
        kjokken: 'Kjøkken',
        gulv: 'Gulv',
        maling: 'Maling',
        stue: 'Stue',
        soverom: 'Soverom'
    };
    
    const roomName = roomNames[planData.roomType] || planData.roomType;
    const subtitle = `${roomName} • ${planData.budget.toLocaleString('no-NO')} kr • ${planData.diyLevel}`;
    document.getElementById('planSubtitle').textContent = subtitle;
}

function generateWarnings() {
    const warnings = analyzeRisks();
    const warningsSection = document.getElementById('warningsSection');
    
    if (warnings.length === 0) {
        warningsSection.style.display = 'none';
        return;
    }
    
    warningsSection.innerHTML = warnings.map(warning => `
        <div class="warning-card ${warning.level}">
            <div class="warning-title">${warning.title}</div>
            <div class="warning-message">${warning.message}</div>
            <div class="warning-recommendation">${warning.recommendation}</div>
        </div>
    `).join('');
}

function analyzeRisks() {
    const warnings = [];
    
    // Budget warnings
    const budgetLimits = {
        bad: 80000,
        kjokken: 50000,
        gulv: 20000,
        maling: 10000
    };
    
    const minBudget = budgetLimits[planData.roomType] || 20000;
    
    if (planData.budget < minBudget) {
        warnings.push({
            level: 'critical',
            title: '🚨 Kritisk lavt budsjett',
            message: `Budsjettet ditt (${planData.budget.toLocaleString('no-NO')} kr) er under anbefalt minimum (${minBudget.toLocaleString('no-NO')} kr).`,
            recommendation: 'Vurder å øke budsjettet eller redusere omfanget. Å spare på feil ting kan koste deg 2-3x mer senere.'
        });
    }
    
    // DIY warnings for critical rooms
    if (planData.roomType === 'bad' && planData.diyLevel !== 'none') {
        warnings.push({
            level: 'critical',
            title: '🚨 Høyrisiko-advarsel: Baderom',
            message: 'Du har valgt å gjøre noe av arbeidet selv på badet. Dette er høyrisiko!',
            recommendation: 'Bruk ALLTID sertifisert rørlegger og elektriker. Vannskader kan koste 100 000+ kr å fikse.'
        });
    }
    
    // Savings opportunities
    if (planData.roomType === 'maling' && planData.diyLevel === 'none') {
        warnings.push({
            level: 'info',
            title: '💰 Stort sparepotensial',
            message: 'Maling er perfekt for egeninnsats! Du kan spare 10 000-20 000 kr.',
            recommendation: 'Vurder å gjøre malingen selv. Det er enkelt og du sparer mye penger.'
        });
    }
    
    return warnings;
}

function generateBudgetOverview() {
    const allocation = calculateBudgetAllocation();
    
    document.getElementById('laborBudget').textContent = allocation.labor.toLocaleString('no-NO') + ' kr';
    document.getElementById('laborPercentage').textContent = allocation.breakdown.laborPercentage + '%';
    document.getElementById('laborExplanation').textContent = allocation.explanation.labor;
    
    document.getElementById('materialsBudget').textContent = allocation.materials.toLocaleString('no-NO') + ' kr';
    document.getElementById('materialsPercentage').textContent = allocation.breakdown.materialsPercentage + '%';
    document.getElementById('materialsExplanation').textContent = allocation.explanation.materials;
    
    document.getElementById('bufferBudget').textContent = allocation.buffer.toLocaleString('no-NO') + ' kr';
    document.getElementById('bufferPercentage').textContent = allocation.breakdown.bufferPercentage + '%';
    document.getElementById('bufferExplanation').textContent = allocation.explanation.buffer;
}

function calculateBudgetAllocation() {
    let laborPercentage = 0.4;
    let materialsPercentage = 0.45;
    let bufferPercentage = 0.15;
    
    // Adjust based on room type
    if (planData.roomType === 'bad') {
        laborPercentage = 0.5;
        materialsPercentage = 0.35;
    } else if (planData.roomType === 'kjokken') {
        laborPercentage = 0.35;
        materialsPercentage = 0.5;
    } else if (planData.roomType === 'maling') {
        laborPercentage = 0.2;
        materialsPercentage = 0.6;
        bufferPercentage = 0.2;
    } else if (planData.roomType === 'gulv') {
        laborPercentage = 0.3;
        materialsPercentage = 0.55;
    }
    
    // Adjust based on DIY level
    if (planData.diyLevel === 'experienced') {
        laborPercentage -= 0.15;
        materialsPercentage += 0.1;
        bufferPercentage += 0.05;
    } else if (planData.diyLevel === 'none') {
        laborPercentage += 0.1;
        materialsPercentage -= 0.05;
        bufferPercentage -= 0.05;
    }

    const labor = Math.round(planData.budget * laborPercentage);
    const materials = Math.round(planData.budget * materialsPercentage);
    const buffer = planData.budget - labor - materials;

    return {
        labor,
        materials,
        buffer,
        breakdown: {
            laborPercentage: Math.round(laborPercentage * 100),
            materialsPercentage: Math.round(materialsPercentage * 100),
            bufferPercentage: Math.round(bufferPercentage * 100)
        },
        explanation: {
            labor: getExplanation('labor', planData.roomType),
            materials: getExplanation('materials', planData.roomType),
            buffer: getExplanation('buffer', planData.roomType)
        }
    };
}

function getExplanation(category, roomType) {
    const explanations = {
        labor: {
            bad: 'Baderom krever sertifisert rørlegger og elektriker. Ikke spar her!',
            kjokken: 'Montering kan gjøres selv hvis erfaren, ellers bruk fagfolk.',
            maling: 'Maling kan enkelt gjøres selv. Spar penger her!',
            gulv: 'Gulvlegging kan gjøres selv med riktig verktøy.'
        },
        materials: {
            bad: 'Membran og fliser er kritisk. Velg god kvalitet.',
            kjokken: 'Skap og benkeplate er største utgift.',
            maling: 'God maling gir bedre resultat og dekker bedre.',
            gulv: 'Velg minimum AC4-klasse laminat for god holdbarhet.'
        },
        buffer: {
            bad: 'Baderom har ofte skjulte problemer. Ha god buffer!',
            kjokken: 'Buffer for uforutsette utgifter.',
            maling: 'Maling har sjelden store overraskelser.',
            gulv: 'Buffer for ekstra materialer (10% svinn).'
        }
    };

    return explanations[category][roomType] || 'Standard fordeling';
}

function generateSavingsRecommendations() {
    const savings = getSavingsRecommendations();

    const saveOnList = document.getElementById('saveOnList');
    saveOnList.innerHTML = savings.saveOn.map(item => `<li>✅ ${item}</li>`).join('');

    const dontSaveOnList = document.getElementById('dontSaveOnList');
    dontSaveOnList.innerHTML = savings.dontSaveOn.map(item => `<li>🚨 ${item}</li>`).join('');
}

function getSavingsRecommendations() {
    const recommendations = {
        bad: {
            saveOn: [
                'Baderomskap - IKEA holder i 10+ år',
                'Speil og tilbehør - kan oppgraderes senere',
                'Dekorative fliser - velg enkle fliser'
            ],
            dontSaveOn: [
                'Membran og tetting - vannskader koster 100 000+ kr',
                'Rørleggerarbeid - lekkasjer er katastrofalt',
                'Elektrisk arbeid - brannfare',
                'Ventilasjon - fukt og mugg'
            ]
        },
        kjokken: {
            saveOn: [
                'Kjøkkenskap - IKEA holder i 10+ år',
                'Hvitevarer - kjøp på tilbud',
                'Dekorative elementer'
            ],
            dontSaveOn: [
                'Benkeplate - brukes daglig i 15+ år',
                'Kjøkkenkran - billige lekker',
                'Elektrisk arbeid'
            ]
        },
        gulv: {
            saveOn: [
                'Gulvlist - plast vs tre',
                'Underlagsmatte - enkel kvalitet'
            ],
            dontSaveOn: [
                'Gulvkvalitet - billig må skiftes etter 3-5 år',
                'Underlag - viktig for lyd'
            ]
        },
        maling: {
            saveOn: [
                'Malerverktøy - billige ruller',
                'Tape og plastduk'
            ],
            dontSaveOn: [
                'Malingskvalitet - billig dekker dårlig',
                'Grunnmaling - viktig for resultat'
            ]
        }
    };

    return recommendations[planData.roomType] || { saveOn: [], dontSaveOn: [] };
}

function generateSteps() {
    const steps = getProjectSteps();
    const stepsList = document.getElementById('stepsList');

    stepsList.innerHTML = steps.map(step => `
        <div class="step-item ${step.riskLevel}">
            <div class="step-header">
                <div class="step-number">Steg ${step.step}</div>
                <div class="step-title-text">${step.title}</div>
                <div class="step-cost">${step.estimatedCost.toLocaleString('no-NO')} kr</div>
            </div>
            <div class="step-description">${step.description}</div>
            <div class="step-meta">
                <span>⏱️ ${step.estimatedTime} ${step.estimatedTime === 1 ? 'uke' : 'uker'}</span>
                <span>${step.requiresProfessional ? '👷 Krever fagperson' : step.canDIY ? '🔨 Kan gjøres selv' : ''}</span>
                <span class="risk-badge ${step.riskLevel}">${getRiskLabel(step.riskLevel)}</span>
            </div>
            ${step.tips.length > 0 ? `
                <div class="step-tips">
                    <div class="step-tips-title">💡 Tips:</div>
                    <ul>
                        ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function getRiskLabel(level) {
    const labels = {
        low: '✅ Lav risiko',
        medium: '⚠️ Middels risiko',
        high: '🔶 Høy risiko',
        critical: '🚨 Kritisk'
    };
    return labels[level] || level;
}

function getProjectSteps() {
    // Simplified steps - in real app, this would be more comprehensive
    if (planData.roomType === 'bad') {
        return getBathroomSteps();
    } else if (planData.roomType === 'kjokken') {
        return getKitchenSteps();
    } else {
        return getGenericSteps();
    }
}

function getBathroomSteps() {
    return [
        {
            step: 1,
            title: 'Planlegging og forberedelse',
            description: 'Tegn opp rommet, bestill håndverkere',
            estimatedCost: 0,
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: ['Bestill rørlegger NÅ - lang ventetid', 'Ta bilder før du starter']
        },
        {
            step: 2,
            title: 'Rørleggerarbeid',
            description: 'Ny rørlegging, avløp og vannforsyning',
            estimatedCost: Math.round(planData.budget * 0.2),
            estimatedTime: 2,
            riskLevel: 'critical',
            requiresProfessional: true,
            canDIY: false,
            tips: ['Bruk ALLTID sertifisert rørlegger', 'Få skriftlig garanti']
        },
        {
            step: 3,
            title: 'Membran og våtromssikring',
            description: 'Legg membran på gulv og vegger',
            estimatedCost: Math.round(planData.budget * 0.1),
            estimatedTime: 1,
            riskLevel: 'critical',
            requiresProfessional: true,
            canDIY: false,
            tips: ['Membran MÅ legges riktig', 'Vannskader koster 100 000+ kr']
        }
    ];
}

function getKitchenSteps() {
    return [
        {
            step: 1,
            title: 'Planlegging',
            description: 'Tegn opp kjøkken, bestill skap',
            estimatedCost: 0,
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: ['Mål nøye', 'Tenk på arbeidsflyt']
        }
    ];
}

function getGenericSteps() {
    return [
        {
            step: 1,
            title: 'Planlegging',
            description: 'Planlegg prosjektet',
            estimatedCost: 0,
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: ['Ta deg tid til god planlegging']
        }
    ];
}

function generateProductRecommendations() {
    // Placeholder - in real app, fetch from Supabase
    const productsSection = document.getElementById('productsList');
    productsSection.innerHTML = '<p style="text-align: center; color: #64748b;">Produktanbefalinger kommer snart...</p>';
}

function savePlan() {
    alert('Plan lagret! (Kommer snart: lagre til Supabase)');
}

