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
    // Generer plan med ny engine
    const detailedPlan = genererProsjektplan(planData);

    // Lagre detaljert plan
    window.detailedPlan = detailedPlan;

    // Oppdater UI
    updateHeader();
    generateSmartVurdering(detailedPlan);
    generateWarnings();
    generateDenneUken(detailedPlan);
    generateBudgetOverview();
    generateSavingsRecommendations();
    generateDetailedSteps(detailedPlan);
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

function generateSmartVurdering(plan) {
    const section = document.getElementById('smartVurdering');

    const risikoFarge = {
        'lav': '#10b981',
        'middels': '#f59e0b',
        'høy': '#ef4444',
        'kritisk': '#dc2626'
    };

    const html = `
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #0f172a;">
                Smart Vurdering
            </h2>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
                <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Risiko</div>
                    <div style="font-size: 18px; font-weight: 600; color: ${risikoFarge[plan.vurdering.totalRisiko]};">
                        ${plan.vurdering.totalRisiko.toUpperCase()}
                    </div>
                </div>
                <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Varighet</div>
                    <div style="font-size: 18px; font-weight: 600; color: #0f172a;">
                        ${plan.vurdering.estimertVarighet}
                    </div>
                </div>
                <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Arbeidstimer</div>
                    <div style="font-size: 18px; font-weight: 600; color: #0f172a;">
                        ${plan.vurdering.estimertArbeidstimer}
                    </div>
                </div>
                <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">For nybegynner?</div>
                    <div style="font-size: 18px; font-weight: 600; color: #0f172a;">
                        ${plan.vurdering.egnetForNybegynner === 'ja' ? '✓ Ja' : plan.vurdering.egnetForNybegynner === 'delvis' ? '⚠️ Delvis' : '✗ Nei'}
                    </div>
                </div>
            </div>

            <div style="margin-top: 16px;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #0f172a;">Anbefalinger:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${plan.vurdering.anbefalinger.map(anbefaling => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 14px;">
                            ${anbefaling}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    section.innerHTML = html;
}

function generateDenneUken(plan) {
    const section = document.getElementById('denneUkenSection');

    if (!plan.denneUken || plan.denneUken.length === 0) {
        section.style.display = 'none';
        return;
    }

    const html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; color: white;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
                Hva skal du gjøre denne uken?
            </h2>
            <p style="opacity: 0.9; margin-bottom: 20px; font-size: 14px;">
                Start med disse oppgavene for å komme i gang
            </p>

            <div style="display: grid; gap: 12px;">
                ${plan.denneUken.map((oppgave, index) => `
                    <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 8px; padding: 16px; border: 1px solid rgba(255,255,255,0.2);">
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <div style="background: rgba(255,255,255,0.25); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">
                                ${index + 1}
                            </div>
                            <div style="flex: 1;">
                                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">
                                    ${oppgave.oppgave}
                                </h3>
                                <p style="opacity: 0.9; font-size: 14px; margin-bottom: 8px;">
                                    ${oppgave.detaljer}
                                </p>
                                <div style="display: flex; gap: 16px; font-size: 13px; opacity: 0.85;">
                                    ${oppgave.hvor ? `<span>📍 ${oppgave.hvor}</span>` : ''}
                                    <span>⏱️ ${oppgave.tid}</span>
                                    <span>💰 ${oppgave.kostnad.toLocaleString('no-NO')} kr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    section.innerHTML = html;
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
            title: 'KRITISK: Lavt budsjett',
            message: `Budsjettet ditt (${planData.budget.toLocaleString('no-NO')} kr) er under anbefalt minimum (${minBudget.toLocaleString('no-NO')} kr).`,
            recommendation: 'Vurder å øke budsjettet eller redusere omfanget. Å spare på feil ting kan koste deg 2-3x mer senere.'
        });
    }

    // DIY warnings for critical rooms
    if (planData.roomType === 'bad' && planData.diyLevel !== 'none') {
        warnings.push({
            level: 'critical',
            title: 'ADVARSEL: Baderom krever fagfolk',
            message: 'Du har valgt å gjøre noe av arbeidet selv på badet. Dette er høyrisiko!',
            recommendation: 'Bruk ALLTID sertifisert rørlegger og elektriker. Vannskader kan koste 100 000+ kr å fikse.'
        });
    }

    // Savings opportunities
    if (planData.roomType === 'maling' && planData.diyLevel === 'none') {
        warnings.push({
            level: 'info',
            title: 'TIPS: Stort sparepotensial',
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
    saveOnList.innerHTML = savings.saveOn.map(item => `<li>${item}</li>`).join('');

    const dontSaveOnList = document.getElementById('dontSaveOnList');
    dontSaveOnList.innerHTML = savings.dontSaveOn.map(item => `<li>${item}</li>`).join('');
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

function generateDetailedSteps(plan) {
    const stepsList = document.getElementById('stepsList');

    if (!plan.faser || plan.faser.length === 0) {
        // Fallback til gamle steps
        generateSteps();
        return;
    }

    const risikoFarge = {
        'lav': '#10b981',
        'middels': '#f59e0b',
        'høy': '#ef4444',
        'kritisk': '#dc2626'
    };

    stepsList.innerHTML = plan.faser.map((fase, index) => `
        <div class="step-item" style="border-left: 4px solid ${risikoFarge[fase.risiko]}; margin-bottom: 20px;">
            <div class="step-header" style="cursor: pointer;" onclick="toggleFase(${index})">
                <div class="step-number">Fase ${fase.fase}</div>
                <div class="step-title-text">${fase.navn}</div>
                <div class="step-cost">${fase.kostnad.toLocaleString('no-NO')} kr</div>
            </div>

            <div class="step-meta" style="margin-top: 8px;">
                <span>⏱️ ${fase.varighet_timer[0]}-${fase.varighet_timer[1]} timer</span>
                <span>📅 ${fase.uke}</span>
                <span>${fase.hvemGjør === 'selv' ? '✓ Kan gjøres selv' : fase.hvemGjør === 'fagperson' ? '⚠️ Krever fagperson' : '⚠️ Selv eller fagperson'}</span>
                <span class="risk-badge" style="background: ${risikoFarge[fase.risiko]}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${fase.risiko.toUpperCase()}
                </span>
            </div>

            <div id="fase-${index}" style="display: none; margin-top: 16px;">
                ${fase.lovpålagt ? `
                    <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
                        <div style="font-weight: 600; color: #dc2626; margin-bottom: 4px;">⚠️ LOVPÅLAGT FAGARBEID</div>
                        <div style="font-size: 14px; color: #991b1b;">${fase.lovpålagt}</div>
                    </div>
                ` : ''}

                ${fase.advarsel ? `
                    <div style="background: ${fase.advarsel.type === 'kritisk' ? '#fee2e2' : '#fef3c7'}; border-left: 4px solid ${fase.advarsel.type === 'kritisk' ? '#dc2626' : '#f59e0b'}; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
                        <div style="font-weight: 600; color: ${fase.advarsel.type === 'kritisk' ? '#dc2626' : '#d97706'}; margin-bottom: 4px;">
                            ${fase.advarsel.type === 'kritisk' ? '🚨 KRITISK' : '⚠️ ADVARSEL'}
                        </div>
                        <div style="font-size: 14px; color: #0f172a; margin-bottom: 4px;">${fase.advarsel.melding}</div>
                        <div style="font-size: 13px; color: #64748b;">${fase.advarsel.konsekvens}</div>
                    </div>
                ` : ''}

                <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #0f172a;">Oppgaver:</h4>
                <div style="display: grid; gap: 12px; margin-bottom: 16px;">
                    ${fase.oppgaver.map(oppgave => `
                        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">${oppgave.oppgave}</div>
                            <div style="font-size: 14px; color: #475569; margin-bottom: 8px;">${oppgave.detaljer}</div>

                            <div style="display: flex; gap: 12px; flex-wrap: wrap; font-size: 13px; color: #64748b; margin-bottom: 8px;">
                                ${oppgave.tid_timer ? `<span>⏱️ ${oppgave.tid_timer[0]}-${oppgave.tid_timer[1]} timer</span>` : ''}
                                ${oppgave.kostnad ? `<span>💰 ${oppgave.kostnad.toLocaleString('no-NO')} kr</span>` : ''}
                            </div>

                            ${oppgave.produkter ? `<div style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Produkter:</strong> ${oppgave.produkter}</div>` : ''}
                            ${oppgave.verktøy ? `<div style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Verktøy:</strong> ${oppgave.verktøy}</div>` : ''}
                            ${oppgave.sikkerhet ? `<div style="font-size: 13px; color: #dc2626; margin-bottom: 4px;"><strong>⚠️ Sikkerhet:</strong> ${oppgave.sikkerhet}</div>` : ''}
                            ${oppgave.tips ? `<div style="font-size: 13px; color: #10b981; margin-bottom: 4px;"><strong>💡 Tips:</strong> ${oppgave.tips}</div>` : ''}
                            ${oppgave.vanligeFeil ? `<div style="font-size: 13px; color: #f59e0b;"><strong>⚠️ Vanlige feil:</strong> ${oppgave.vanligeFeil}</div>` : ''}
                            ${oppgave.hvor ? `<div style="font-size: 13px; color: #6366f1; margin-top: 4px;"><strong>📍 Hvor:</strong> ${oppgave.hvor}</div>` : ''}
                        </div>
                    `).join('')}
                </div>

                ${fase.sjekkliste && fase.sjekkliste.length > 0 ? `
                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: #0f172a;">Sjekkliste:</h4>
                    <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0;">
                        ${fase.sjekkliste.map((item, itemIndex) => `
                            <label style="display: flex; align-items: center; padding: 6px 0; cursor: pointer;">
                                <input type="checkbox" id="check-${index}-${itemIndex}" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 14px; color: #0f172a;">${item}</span>
                            </label>
                        `).join('')}
                    </div>
                ` : ''}

                ${fase.alternativ ? `
                    <div style="background: #eff6ff; padding: 12px; border-radius: 8px; border: 1px solid #bfdbfe; margin-top: 12px;">
                        <div style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">💡 Alternativ: ${fase.alternativ.navn}</div>
                        <div style="font-size: 14px; color: #475569; margin-bottom: 4px;">Ekstra kostnad: ${fase.alternativ.kostnad_ekstra.toLocaleString('no-NO')} kr</div>
                        <div style="font-size: 13px; color: #64748b;">
                            <strong>Fordeler:</strong> ${fase.alternativ.fordeler}<br>
                            <strong>Ulemper:</strong> ${fase.alternativ.ulemper}<br>
                            <strong>Anbefaling:</strong> ${fase.alternativ.anbefaling}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function toggleFase(index) {
    const element = document.getElementById(`fase-${index}`);
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
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
                <span>Tid: ${step.estimatedTime} ${step.estimatedTime === 1 ? 'uke' : 'uker'}</span>
                <span>${step.requiresProfessional ? 'Krever fagperson' : step.canDIY ? 'Kan gjøres selv' : ''}</span>
                <span class="risk-badge ${step.riskLevel}">${getRiskLabel(step.riskLevel)}</span>
            </div>
            ${step.tips.length > 0 ? `
                <div class="step-tips">
                    <div class="step-tips-title">Tips:</div>
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
        low: 'Lav risiko',
        medium: 'Middels risiko',
        high: 'Høy risiko',
        critical: 'KRITISK'
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
    const budget = planData.budget;
    return [
        {
            step: 1,
            title: 'Planlegging og forberedelse',
            description: 'Tegn opp rommet i detalj. Mål nøye og planlegg plassering av toalett, servant, dusj/badekar. Bestill håndverkere (rørlegger, elektriker, flislegger) - de har ofte 4-8 ukers ventetid. Søk om tillatelse hvis nødvendig.',
            estimatedCost: 0,
            estimatedTime: 2,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Bestill rørlegger og elektriker NÅ - lang ventetid',
                'Ta bilder og video av alt før du starter',
                'Sjekk om du trenger byggetillatelse (vanligvis ikke for bad)',
                'Lag detaljert tegning med mål - bruk gratis verktøy som SketchUp'
            ]
        },
        {
            step: 2,
            title: 'Riving og fjerning',
            description: 'Riv ut gammelt bad. Fjern fliser, membran, sanitærutstyr. Sjekk tilstanden på underlag og vegger. Dette er tungt arbeid men kan gjøres selv for å spare penger.',
            estimatedCost: Math.round(budget * 0.05),
            estimatedTime: 1,
            riskLevel: 'medium',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Leie container for avfall (ca 3000-5000 kr)',
                'Bruk støvmaske og vernebriller',
                'Sjekk for asbest i eldre hus (før 1980)',
                'Steng av vann og strøm før du starter',
                'Spar penger: Gjør dette selv og spar 10 000-15 000 kr'
            ]
        },
        {
            step: 3,
            title: 'Rørleggerarbeid - Grovarbeid',
            description: 'Rørlegger legger nye rør for vann og avløp. Dette inkluderer kaldtvann, varmtvann, og avløp til toalett, servant, dusj. KRITISK: Må gjøres av sertifisert rørlegger.',
            estimatedCost: Math.round(budget * 0.15),
            estimatedTime: 2,
            riskLevel: 'critical',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Bruk ALLTID sertifisert rørlegger - ikke spar her!',
                'Få skriftlig tilbud og kontrakt',
                'Krev 5 års garanti på arbeidet',
                'Sjekk at rørlegger har ansvarsforsikring',
                'Lekkasjer kan koste 100 000-300 000 kr å fikse'
            ]
        },
        {
            step: 4,
            title: 'Elektrisk arbeid',
            description: 'Elektriker trekker nye kabler for lys, vifte, varmekabler i gulv, og stikkontakter. Baderom har strenge krav til jordfeilbryter og IP-klasser. KRITISK: Må gjøres av autorisert elektriker.',
            estimatedCost: Math.round(budget * 0.08),
            estimatedTime: 1,
            riskLevel: 'critical',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Bruk ALLTID autorisert elektriker',
                'Krev ferdigattest etter arbeidet',
                'Planlegg ekstra stikkontakter - bedre med for mange enn for få',
                'Vurder gulvvarme - koster 3000-5000 kr ekstra men gir mye komfort'
            ]
        },
        {
            step: 5,
            title: 'Membran og våtromssikring',
            description: 'Legg membran på gulv og vegger (minimum 20cm opp fra gulv, 200cm i dusjsone). Dette er den VIKTIGSTE delen - feil her gir vannskader. Bruk sertifisert våtromsbygger eller flislegger med dokumentert erfaring.',
            estimatedCost: Math.round(budget * 0.08),
            estimatedTime: 2,
            riskLevel: 'critical',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Membran MÅ legges 100% riktig - vannskader koster 100 000-300 000 kr',
                'Bruk kun godkjente membransystemer (Mapei, Weber, Kerakoll)',
                'Krev 10 års garanti på membranarbeid',
                'Sjekk at håndverker har våtromssertifikat',
                'IKKE spar penger her - dette er fundamentet for hele badet'
            ]
        },
        {
            step: 6,
            title: 'Flislegging',
            description: 'Legg fliser på gulv og vegger. Velg sklisikre gulvfliser (R10-R11). Veggfliser kan være mer dekorative. Bruk fleksibel flislim og fuge for å unngå sprekker.',
            estimatedCost: Math.round(budget * 0.12),
            estimatedTime: 3,
            riskLevel: 'medium',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Velg store fliser (30x60 eller større) - færre fuger, enklere renhold',
                'Gulvfliser MÅ være sklisikre (R10 minimum)',
                'Bruk fleksibel lim og fuge - forhindrer sprekker',
                'Spar penger: Velg enkle fliser istedenfor mønster - spar 5000-10 000 kr',
                'Kan gjøres selv hvis erfaren, men anbefaler fagperson'
            ]
        },
        {
            step: 7,
            title: 'Montering av sanitærutstyr',
            description: 'Monter toalett, servant, dusjkabinett/badekar, blandebatterier. Rørlegger kobler til vann og avløp. Sjekk at alt er tett og fungerer.',
            estimatedCost: Math.round(budget * 0.15),
            estimatedTime: 1,
            riskLevel: 'medium',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Rørlegger må koble til vann og avløp',
                'Test GRUNDIG for lekkasjer før du lukker vegger',
                'Spar penger: Kjøp sanitærutstyr selv på tilbud - spar 5000-15 000 kr',
                'IKEA, Byggmax, Maxbo har gode tilbud på servant og toalett'
            ]
        },
        {
            step: 8,
            title: 'Maling og finish',
            description: 'Mal tak og eventuelle vegger som ikke er flislagt. Bruk fuktsikker maling (baderomsm aling). Monter speil, skap, hyller, håndkleholder. Dette kan du gjøre selv!',
            estimatedCost: Math.round(budget * 0.05),
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Bruk fuktsikker baderomsm aling på tak',
                'Spar penger: Mal selv og monter skap/speil - spar 5000-8000 kr',
                'IKEA har gode og rimelige baderomskap',
                'Kjøp LED-speil med integrert lys - gir bedre lys'
            ]
        },
        {
            step: 9,
            title: 'Sluttbefaring og rydding',
            description: 'Gjennomgå alt med håndverkerne. Sjekk at alt fungerer. Test dusjdør, toalett, servant, ventilasjon. Få alle garantidokumenter og fakturaer. Rydd og gjør rent.',
            estimatedCost: 0,
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Lag en sjekkliste og gå gjennom alt systematisk',
                'Test dusj i 10 minutter - sjekk for lekkasjer',
                'Få kopi av alle garantier og fakturaer',
                'Ta bilder av ferdig resultat',
                'Vent 24 timer før du bruker badet første gang'
            ]
        }
    ];
}

function getKitchenSteps() {
    const budget = planData.budget;
    return [
        {
            step: 1,
            title: 'Planlegging og design',
            description: 'Tegn opp kjøkkenet i detalj. Planlegg arbeidsflyt (kjøleskap → vask → komfyr). Mål nøye - feil mål er dyrt! Bestill kjøkkenskap (IKEA, HTH, Sigdal) - leveringstid 4-8 uker.',
            estimatedCost: 0,
            estimatedTime: 2,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Bruk IKEA sin gratis kjøkkenplanlegger',
                'Mål 3 ganger - bestill 1 gang!',
                'Tenk arbeidsflyt: Kjøleskap → Vask → Komfyr (arbeidstrekant)',
                'Planlegg nok stikkontakter (minimum 6-8 på kjøkken)',
                'Bestill skap NÅ - lang leveringstid'
            ]
        },
        {
            step: 2,
            title: 'Riving av gammelt kjøkken',
            description: 'Riv ut gamle skap, benkeplate, hvitevarer. Fjern fliser hvis nødvendig. Dette kan du gjøre selv for å spare penger. Vær forsiktig med rør og elektriske ledninger.',
            estimatedCost: Math.round(budget * 0.03),
            estimatedTime: 1,
            riskLevel: 'medium',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Steng av vann og strøm før du starter',
                'Ta bilder av rørplassering før du river',
                'Spar penger: Gjør dette selv - spar 8000-12 000 kr',
                'Selg gamle hvitevarer på Finn.no',
                'Leie container (ca 2000-3000 kr)'
            ]
        },
        {
            step: 3,
            title: 'Elektrisk arbeid',
            description: 'Elektriker trekker nye kabler for komfyr, oppvaskmaskin, kjøleskap, belysning. Moderne kjøkken trenger mange stikkontakter. VIKTIG: Komfyr krever egen sikring.',
            estimatedCost: Math.round(budget * 0.08),
            estimatedTime: 1,
            riskLevel: 'critical',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Bruk autorisert elektriker',
                'Komfyr MÅ ha egen sikring (16A eller 20A)',
                'Planlegg minimum 6-8 stikkontakter',
                'Vurder USB-lader i vegg - praktisk!',
                'Krev ferdigattest'
            ]
        },
        {
            step: 4,
            title: 'Rørleggerarbeid',
            description: 'Rørlegger kobler til vann for oppvaskmaskin, kjøkkenvask, eventuelt kjøleskap med isbiter. Sjekk at avløp fungerer godt.',
            estimatedCost: Math.round(budget * 0.06),
            estimatedTime: 1,
            riskLevel: 'high',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Bruk sertifisert rørlegger',
                'Vurder ekstra vannuttak for kjøleskap',
                'Sjekk at avløp har riktig fall',
                'Krev garanti på arbeidet'
            ]
        },
        {
            step: 5,
            title: 'Montering av kjøkkenskap',
            description: 'Monter underskap, overskap, høyskap. Start med underskap, deretter overskap. Bruk vater for å sikre at alt er rett. Dette kan du gjøre selv hvis du er erfaren!',
            estimatedCost: Math.round(budget * 0.35),
            estimatedTime: 2,
            riskLevel: 'medium',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Spar penger: Monter IKEA-kjøkken selv - spar 15 000-25 000 kr',
                'Bruk vater og målebånd - alt MÅ være rett',
                'Start med underskap, deretter overskap',
                'IKEA har gode monteringsvideo er på YouTube',
                'Leie verktøy hvis du ikke har (sag, drill, vater)'
            ]
        },
        {
            step: 6,
            title: 'Montering av benkeplate',
            description: 'Monter benkeplate. Laminat kan du montere selv, stein/kompositt bør monteres av fagperson. Kapp ut hull for vask og komfyr. Tett godt mot vegg.',
            estimatedCost: Math.round(budget * 0.15),
            estimatedTime: 1,
            riskLevel: 'medium',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Laminat: Kan monteres selv - spar 3000-5000 kr',
                'Stein/kompositt: Bruk fagperson - tungt og vanskelig',
                'Tett godt mot vegg med silikon',
                'Spar penger: Velg laminat istedenfor stein - spar 10 000-20 000 kr',
                'IKEA har gode laminatbenker til 2000-4000 kr'
            ]
        },
        {
            step: 7,
            title: 'Montering av hvitevarer',
            description: 'Monter komfyr, oppvaskmaskin, kjøleskap, ventilator. Elektriker og rørlegger kobler til. Sjekk at alt fungerer før du lukker skap.',
            estimatedCost: Math.round(budget * 0.20),
            estimatedTime: 1,
            riskLevel: 'medium',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Spar penger: Kjøp hvitevarer på Black Friday - spar 5000-15 000 kr',
                'Elkjøp, Power, Expert har gode tilbud',
                'Velg energiklasse A+++ - sparer strøm',
                'Elektriker MÅ koble til komfyr',
                'Test alt grundig før du lukker skap'
            ]
        },
        {
            step: 8,
            title: 'Flislegging og maling',
            description: 'Legg fliser på vegg bak benk (sprøytsone). Mal vegger og tak. Bruk kjøkkenmaling som tåler fukt og fett. Dette kan du gjøre selv!',
            estimatedCost: Math.round(budget * 0.08),
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Spar penger: Mal og flis selv - spar 5000-8000 kr',
                'Bruk kjøkkenmaling (tåler fukt og fett)',
                'Fliser bak benk: Velg enkle, store fliser',
                'Alternativ til fliser: Glassplate (2000-4000 kr)'
            ]
        },
        {
            step: 9,
            title: 'Finish og detaljer',
            description: 'Monter håndtak, sokkel, lister. Tett alle overganger med silikon. Monter belysning under overskap. Rydd og gjør rent. Nyt ditt nye kjøkken!',
            estimatedCost: Math.round(budget * 0.05),
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'LED-list under overskap gir godt arbeidslys (500-1500 kr)',
                'Bruk god silikon - billig silikon gulner',
                'Spar penger: Monter håndtak selv',
                'Vent 24 timer med å bruke kjøkkenet etter silikon',
                'Ta bilder av ferdig resultat!'
            ]
        }
    ];
}

function getGenericSteps() {
    const budget = planData.budget;
    const roomType = planData.roomType;

    if (roomType === 'gulv') {
        return [
            {
                step: 1,
                title: 'Planlegging og måling',
                description: 'Mål rommet nøye. Beregn antall kvadratmeter + 10% ekstra for svinn. Velg gulvtype (laminat, parkett, vinyl). Bestill gulv - leveringstid 1-3 uker.',
                estimatedCost: 0,
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Mål rommet nøye - lengde x bredde + 10% ekstra',
                    'Laminat: Billigst og enklest (200-400 kr/m²)',
                    'Parkett: Dyrere men mer eksklusivt (400-800 kr/m²)',
                    'Vinyl: Vanntett, perfekt for kjøkken/bad (300-600 kr/m²)'
                ]
            },
            {
                step: 2,
                title: 'Fjerning av gammelt gulv',
                description: 'Fjern gammelt gulv, teppegulv eller linoleum. Sjekk at undergulvet er plant og tørt. Reparer eventuelle skader. Dette kan du gjøre selv!',
                estimatedCost: Math.round(budget * 0.05),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Spar penger: Gjør dette selv - spar 5000-8000 kr',
                    'Leie container for avfall (2000-3000 kr)',
                    'Sjekk for asbest i eldre hus (før 1980)',
                    'Undergulv må være plant (max 3mm ujevnhet per meter)'
                ]
            },
            {
                step: 3,
                title: 'Legging av underlag',
                description: 'Legg lydreduserende underlag. Dette gir bedre lyd og komfort. Enkel jobb som kan gjøres selv.',
                estimatedCost: Math.round(budget * 0.10),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Bruk fuktsikker underlag i kjøkken/bad',
                    'Legg underlaget vinkelrett på gulvretningen',
                    'Teip skjøtene med tape',
                    'Koster ca 50-100 kr/m²'
                ]
            },
            {
                step: 4,
                title: 'Legging av gulv',
                description: 'Legg gulvet med klikksystem. Start fra en rett vegg. Bruk avstandsklosser mot vegg (8-10mm). Laminat og vinyl kan du legge selv!',
                estimatedCost: Math.round(budget * 0.70),
                estimatedTime: 1,
                riskLevel: 'medium',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Spar penger: Legg laminat/vinyl selv - spar 10 000-20 000 kr',
                    'Start fra lengste, retteste vegg',
                    'Bruk avstandsklosser (8-10mm) mot alle vegger',
                    'Kapp siste rad med sag eller gulvkniv',
                    'YouTube har gode veiledninger for gulvlegging'
                ]
            },
            {
                step: 5,
                title: 'Montering av lister',
                description: 'Monter gulvlister langs alle vegger. Skjuler ekspansjonsfugen og gir pent resultat. Kan gjøres selv!',
                estimatedCost: Math.round(budget * 0.15),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Velg lister som matcher gulvet',
                    'Bruk lim eller spiker (spiker er enklest)',
                    'Kapp hjørner i 45 grader for pent resultat',
                    'Koster ca 30-80 kr per meter'
                ]
            }
        ];
    }

    if (roomType === 'maling') {
        return [
            {
                step: 1,
                title: 'Planlegging og innkjøp',
                description: 'Beregn hvor mye maling du trenger (1 liter dekker ca 8-10 m²). Velg farge og kvalitet. Kjøp pensler, ruller, tape, sparkelmasse.',
                estimatedCost: Math.round(budget * 0.40),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Beregn: (Lengde x Høyde x 2) + (Bredde x Høyde x 2) = m²',
                    '1 liter maling dekker ca 8-10 m²',
                    'Kjøp god maling - billig maling krever flere strøk',
                    'Jotun Lady, Beckers, Nordsjø er gode merker',
                    'Spar penger: Kjøp på tilbud - spar 20-30%'
                ]
            },
            {
                step: 2,
                title: 'Forberedelse av rom',
                description: 'Flytt møbler ut eller samle i midten. Dekk gulv med plast. Tape vinduer, dører, lister. Vask vegger. Sparkle hull og sprekker.',
                estimatedCost: Math.round(budget * 0.10),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'God forberedelse = halvparten av jobben!',
                    'Vask vegger med såpe og vann',
                    'Sparkle alle hull og sprekker',
                    'Slip sparkel når tørr (P120 sandpapir)',
                    'Tape nøye - spar tid senere'
                ]
            },
            {
                step: 3,
                title: 'Grunnmaling',
                description: 'Mal tak først, deretter vegger. Bruk rulle for store flater, pensel i hjørner. La tørke 4-6 timer mellom strøk.',
                estimatedCost: Math.round(budget * 0.20),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Mal TAK først, deretter vegger',
                    'Bruk rulle for store flater (raskere)',
                    'Bruk pensel i hjørner og langs lister',
                    'Mal i W-form for jevn fordeling',
                    'La tørke 4-6 timer mellom strøk'
                ]
            },
            {
                step: 4,
                title: 'Toppstrøk',
                description: 'Mal andre strøk (toppstrøk). Dette gir jevn farge og god dekning. Fjern tape mens maling er litt fuktig for best resultat.',
                estimatedCost: Math.round(budget * 0.20),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Andre strøk gir jevn, fin farge',
                    'Fjern tape mens maling er litt fuktig',
                    'Mal i samme retning som første strøk',
                    'Åpne vindu for god ventilasjon',
                    'La tørke 24 timer før du flytter inn møbler'
                ]
            },
            {
                step: 5,
                title: 'Rydding og finish',
                description: 'Fjern tape og plastdekke. Vask pensler og ruller. Flytt inn møbler. Nyt ditt nymalte rom!',
                estimatedCost: Math.round(budget * 0.10),
                estimatedTime: 1,
                riskLevel: 'low',
                requiresProfessional: false,
                canDIY: true,
                tips: [
                    'Vask pensler og ruller grundig',
                    'Oppbevar restmaling til utbedringer',
                    'Vent 24 timer før du henger opp bilder',
                    'Spar penger: Mal selv - spar 10 000-20 000 kr!',
                    'Maling er perfekt for egeninnsats'
                ]
            }
        ];
    }

    // Default for andre romtyper
    return [
        {
            step: 1,
            title: 'Planlegging og forberedelse',
            description: 'Planlegg prosjektet i detalj. Lag tegninger, mål nøye, bestill materialer og håndverkere.',
            estimatedCost: 0,
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Ta deg tid til god planlegging',
                'Mål nøye før du bestiller',
                'Få flere tilbud fra håndverkere',
                'Lag detaljert budsjett'
            ]
        },
        {
            step: 2,
            title: 'Gjennomføring',
            description: 'Gjennomfør prosjektet i henhold til planen. Følg med på fremdrift og budsjett.',
            estimatedCost: Math.round(budget * 0.80),
            estimatedTime: 2,
            riskLevel: 'medium',
            requiresProfessional: true,
            canDIY: false,
            tips: [
                'Følg opp håndverkere regelmessig',
                'Sjekk kvalitet underveis',
                'Ha buffer i budsjett og tid'
            ]
        },
        {
            step: 3,
            title: 'Sluttføring',
            description: 'Gjennomgå arbeidet, sjekk at alt er gjort riktig. Få garantidokumenter.',
            estimatedCost: Math.round(budget * 0.20),
            estimatedTime: 1,
            riskLevel: 'low',
            requiresProfessional: false,
            canDIY: true,
            tips: [
                'Lag sjekkliste for sluttbefaring',
                'Få alle garantier skriftlig',
                'Ta bilder av ferdig resultat'
            ]
        }
    ];
}

function getStoreLogo(storeName) {
    const logos = {
        'Byggmax': 'https://www.byggmax.no/media/byggmax-logo.svg',
        'Maxbo': 'https://www.maxbo.no/Static/images/maxbo-logo.svg',
        'Montér': 'https://www.monter.no/Static/gfx/monter-logo.svg',
        'IKEA': 'https://www.ikea.com/global/assets/logos/brand/ikea-logo.svg',
        'Elkjøp': 'https://www.elkjop.no/INTERSHOP/static/WFS/store-elkjop-Site/-/no_NO/images/logo.svg',
        'Power': 'https://www.power.no/Static/gfx/power-logo.svg',
        'Expert': 'https://www.expert.no/Static/gfx/expert-logo.svg',
        'VVS Eksperten': 'https://www.vvseksperten.no/Static/gfx/vvs-logo.svg',
        'Flisekompaniet': 'https://www.flisekompaniet.no/Static/gfx/flisekompaniet-logo.svg',
        'Biltema': 'https://www.biltema.no/Static/gfx/biltema-logo.svg'
    };
    return logos[storeName] || '';
}

function generateProductRecommendations() {
    const products = getProductRecommendations();
    const productsSection = document.getElementById('productsList');

    if (products.length === 0) {
        productsSection.innerHTML = '<p style="text-align: center; color: #64748b;">Ingen produkter funnet for dette prosjektet.</p>';
        return;
    }

    productsSection.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-amount">${product.price.toLocaleString('no-NO')} kr</span>
                    ${product.originalPrice ? `<span class="price-original">${product.originalPrice.toLocaleString('no-NO')} kr</span>` : ''}
                </div>
                <div class="product-stores">
                    ${product.stores.map(store => {
                        const logoUrl = getStoreLogo(store.name);
                        return `
                            <a href="${store.url}" target="_blank" class="store-link" rel="noopener">
                                <div class="store-info">
                                    ${logoUrl ? `<img src="${logoUrl}" alt="${store.name}" class="store-logo" onerror="this.style.display='none'">` : ''}
                                    <span class="store-name">${store.name}</span>
                                </div>
                                <span class="store-price">${store.price.toLocaleString('no-NO')} kr</span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function getProductRecommendations() {
    // Real products from Norwegian stores
    const productDatabase = {
        bad: [
            {
                name: 'Mapei Mapegum WPS Membran',
                description: 'Profesjonell våtromsmembran. Godkjent for norske våtrom. 10 års garanti.',
                price: 1299,
                image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop',
                badge: 'Anbefalt',
                stores: [
                    { name: 'Byggmax', price: 1299, url: 'https://www.byggmax.no' },
                    { name: 'Maxbo', price: 1349, url: 'https://www.maxbo.no' },
                    { name: 'Montér', price: 1399, url: 'https://www.monter.no' }
                ]
            },
            {
                name: 'Ifö Sign Toalett',
                description: 'Vegghengt toalett med soft-close sete. Skandinavisk design, god kvalitet.',
                price: 2499,
                originalPrice: 3299,
                image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
                badge: 'Tilbud',
                stores: [
                    { name: 'VVS Eksperten', price: 2499, url: 'https://www.vvseksperten.no' },
                    { name: 'Maxbo', price: 2699, url: 'https://www.maxbo.no' },
                    { name: 'Byggmax', price: 2799, url: 'https://www.byggmax.no' }
                ]
            },
            {
                name: 'Gustavsberg Nautic Servant 60cm',
                description: 'Klassisk servant i porselen. 60cm bred, perfekt for små og mellomstore bad.',
                price: 1899,
                image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&h=300&fit=crop',
                stores: [
                    { name: 'VVS Eksperten', price: 1899, url: 'https://www.vvseksperten.no' },
                    { name: 'Maxbo', price: 1999, url: 'https://www.maxbo.no' }
                ]
            },
            {
                name: 'Porsgrunn Gulvfliser 30x30cm Matt Grå',
                description: 'Sklisikre gulvfliser (R10). Moderne grå farge, enkel å rengjøre.',
                price: 299,
                image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop',
                stores: [
                    { name: 'Flisekompaniet', price: 299, url: 'https://www.flisekompaniet.no' },
                    { name: 'Maxbo', price: 319, url: 'https://www.maxbo.no' },
                    { name: 'Byggmax', price: 329, url: 'https://www.byggmax.no' }
                ]
            },
            {
                name: 'IKEA GODMORGON Baderomskap 60cm',
                description: 'Baderomskap med 2 skuffer. Hvit høyglans. Inkluderer servant og speil.',
                price: 3495,
                image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
                badge: 'Populær',
                stores: [
                    { name: 'IKEA', price: 3495, url: 'https://www.ikea.com/no' }
                ]
            }
        ],
        kjokken: [
            {
                name: 'IKEA METOD Kjøkkenskap 60cm',
                description: 'Underskap med 2 skuffer. Hvit. Solid kvalitet, enkel montering.',
                price: 1295,
                image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=300&fit=crop',
                badge: 'Anbefalt',
                stores: [
                    { name: 'IKEA', price: 1295, url: 'https://www.ikea.com/no' }
                ]
            },
            {
                name: 'IKEA KARLBY Benkeplate 186cm Valnøtt',
                description: 'Laminat benkeplate. Valnøttmønster. Tåler varme og fukt.',
                price: 1999,
                image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
                stores: [
                    { name: 'IKEA', price: 1999, url: 'https://www.ikea.com/no' }
                ]
            },
            {
                name: 'Bosch Serie 4 Oppvaskmaskin',
                description: 'Energiklasse A+++. Stille (44dB). 13 kuverter. 5 års garanti.',
                price: 4999,
                originalPrice: 6499,
                image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=300&fit=crop',
                badge: 'Tilbud',
                stores: [
                    { name: 'Elkjøp', price: 4999, url: 'https://www.elkjop.no' },
                    { name: 'Power', price: 5199, url: 'https://www.power.no' },
                    { name: 'Expert', price: 5299, url: 'https://www.expert.no' }
                ]
            },
            {
                name: 'Oras Inspera Kjøkkenkran',
                description: 'Uttrekkbar tut. Krom. Nordisk kvalitet. 5 års garanti.',
                price: 1899,
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
                stores: [
                    { name: 'VVS Eksperten', price: 1899, url: 'https://www.vvseksperten.no' },
                    { name: 'Maxbo', price: 1999, url: 'https://www.maxbo.no' }
                ]
            },
            {
                name: 'Subway Veggfliser 10x30cm Hvit',
                description: 'Klassiske subway-fliser. Hvit blank. Perfekt bak benk.',
                price: 199,
                image: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&h=300&fit=crop',
                stores: [
                    { name: 'Flisekompaniet', price: 199, url: 'https://www.flisekompaniet.no' },
                    { name: 'Maxbo', price: 219, url: 'https://www.maxbo.no' }
                ]
            }
        ],
        gulv: [
            {
                name: 'Pergo Laminatgulv Eik AC4',
                description: 'Laminat med klikksystem. AC4 slitestyrke. 20 års garanti.',
                price: 249,
                image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop',
                badge: 'Anbefalt',
                stores: [
                    { name: 'Maxbo', price: 249, url: 'https://www.maxbo.no' },
                    { name: 'Byggmax', price: 259, url: 'https://www.byggmax.no' },
                    { name: 'Montér', price: 269, url: 'https://www.monter.no' }
                ]
            },
            {
                name: 'Underlagsmatte 3mm',
                description: 'Lydreduserende underlag. Fuktsikker. Enkel å legge.',
                price: 89,
                image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop',
                stores: [
                    { name: 'Byggmax', price: 89, url: 'https://www.byggmax.no' },
                    { name: 'Maxbo', price: 99, url: 'https://www.maxbo.no' }
                ]
            }
        ],
        maling: [
            {
                name: 'Jotun Lady Supreme Finish',
                description: 'Toppkvalitet veggmaling. Dekker godt. Lett å påføre. 10L spann.',
                price: 899,
                image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
                badge: 'Anbefalt',
                stores: [
                    { name: 'Maxbo', price: 899, url: 'https://www.maxbo.no' },
                    { name: 'Montér', price: 949, url: 'https://www.monter.no' },
                    { name: 'Byggmax', price: 959, url: 'https://www.byggmax.no' }
                ]
            },
            {
                name: 'Malerruller Sett (3 stk)',
                description: 'Inkluderer 3 ruller + håndtak. For vegg og tak.',
                price: 149,
                image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop',
                stores: [
                    { name: 'Byggmax', price: 149, url: 'https://www.byggmax.no' },
                    { name: 'Biltema', price: 159, url: 'https://www.biltema.no' }
                ]
            }
        ]
    };

    return productDatabase[planData.roomType] || [];
}

function savePlan() {
    alert('Plan lagret! (Kommer snart: lagre til Supabase)');
}

