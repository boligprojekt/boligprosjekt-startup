// Smart Planlegger - JavaScript Logic
// Håndterer 4-stegs planlegger for oppussing

let currentStep = 1;
const formData = {
    housingType: '',
    buildYear: '',
    roomType: '',
    roomSize: 0,
    currentCondition: '',
    budget: 0,
    diyLevel: 'beginner'
};

// Budget suggestions per room type
const budgetSuggestions = {
    bad: { min: 80000, mid: 150000, max: 300000 },
    kjokken: { min: 50000, mid: 120000, max: 250000 },
    gulv: { min: 20000, mid: 50000, max: 100000 },
    maling: { min: 10000, mid: 25000, max: 50000 },
    stue: { min: 30000, mid: 70000, max: 150000 },
    soverom: { min: 20000, mid: 50000, max: 100000 }
};

// DIY tips per level
const diyTips = {
    none: 'Som nybegynner anbefaler vi å bruke fagfolk for de fleste oppgaver. Du kan spare penger på enklere ting som maling og montering av møbler.',
    beginner: 'Med noe erfaring kan du gjøre mye selv! Vi anbefaler fagfolk for elektrisk, rørlegger og andre kritiske oppgaver.',
    experienced: 'Som erfaren kan du gjøre det meste selv! Husk likevel at noen oppgaver (elektrisk, rørlegger) krever sertifisering.'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateStepDisplay();
});

function setupEventListeners() {
    // Option buttons (housing type, room type, condition, DIY level)
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const value = this.dataset.value;
            const stepId = this.closest('.step-content').id;
            
            if (stepId === 'step1') {
                formData.housingType = value;
            } else if (stepId === 'step2') {
                const label = this.closest('.form-group').querySelector('.form-label').textContent;
                if (label.includes('rom')) {
                    formData.roomType = value;
                    updateBudgetGuide();
                } else if (label.includes('tilstand')) {
                    formData.currentCondition = value;
                }
            } else if (stepId === 'step4') {
                formData.diyLevel = value;
                updateDIYTips();
            }
        });
    });

    // Build year select
    document.getElementById('buildYear').addEventListener('change', function() {
        formData.buildYear = this.value;
    });

    // Room size input
    document.getElementById('roomSize').addEventListener('input', function() {
        formData.roomSize = parseFloat(this.value) || 0;
    });

    // Budget input
    document.getElementById('budget').addEventListener('input', function() {
        formData.budget = parseFloat(this.value) || 0;
        checkBudgetWarning();
    });

    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', goBack);
    document.getElementById('nextBtn').addEventListener('click', goNext);
    document.getElementById('submitBtn').addEventListener('click', submitPlan);
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update step text
    document.getElementById('currentStep').textContent = currentStep;
    
    // Update navigation buttons
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentStep === 1) {
        backBtn.style.display = 'none';
    } else {
        backBtn.style.display = 'block';
    }
    
    if (currentStep === 4) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function goNext() {
    if (currentStep < 4) {
        currentStep++;
        updateStepDisplay();
    }
}

function goBack() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateBudgetGuide() {
    const suggestions = budgetSuggestions[formData.roomType] || { min: 20000, mid: 50000, max: 100000 };
    
    document.getElementById('budgetMin').textContent = suggestions.min.toLocaleString('no-NO') + ' kr';
    document.getElementById('budgetMid').textContent = suggestions.mid.toLocaleString('no-NO') + ' kr';
    document.getElementById('budgetMax').textContent = suggestions.max.toLocaleString('no-NO') + ' kr';
}

function checkBudgetWarning() {
    const suggestions = budgetSuggestions[formData.roomType];
    if (!suggestions) return;
    
    const warningBox = document.getElementById('budgetWarning');
    if (formData.budget > 0 && formData.budget < suggestions.min) {
        warningBox.style.display = 'block';
    } else {
        warningBox.style.display = 'none';
    }
}

function updateDIYTips() {
    const tipsText = diyTips[formData.diyLevel] || '';
    document.getElementById('diyTipsText').textContent = tipsText;
}

async function submitPlan() {
    console.log('Genererer plan...', formData);

    // Validate form data
    if (!formData.housingType || !formData.roomType || !formData.budget || formData.budget === 0) {
        alert('Vennligst fyll ut alle feltene');
        return;
    }

    // Save to localStorage for now (later: save to Supabase)
    localStorage.setItem('currentPlan', JSON.stringify(formData));

    // Redirect to plan page
    window.location.href = 'prosjektplan.html';
}

// Export formData for use in other pages
window.plannerData = formData;

