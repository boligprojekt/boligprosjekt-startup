// BoligProsjekt - Prosjektplan Engine
// Genererer detaljerte, personlige oppussingsplaner basert på norsk kontekst

// ============================================
// 1. FAGPERSON VS DIY REGLER (Norsk lovverk)
// ============================================

const fagpersonRegler = {
    // LOVPÅLAGT (TEK17, Plan- og bygningsloven)
    lovpålagt: {
        elektrisk: {
            regel: "MÅ utføres av autorisert elektriker",
            lovhjemmel: "TEK17 §14-4",
            konsekvens: "Brudd på lov, forsikring ugyldig, livsfare",
            unntak: null
        },
        rørlegger: {
            regel: "MÅ utføres av autorisert rørlegger",
            lovhjemmel: "TEK17 §15-7",
            konsekvens: "Brudd på lov, forsikring ugyldig, vannskade",
            unntak: "Kun utskifting av blandebatteri er OK selv"
        },
        bærende_konstruksjoner: {
            regel: "MÅ ha byggesøknad og fagperson",
            lovhjemmel: "Plan- og bygningsloven §20-1",
            konsekvens: "Ulovlig bygging, kan pålegges riving",
            eksempler: ["Fjerne bærende vegger", "Endre takstol", "Nye vinduer"]
        },
        membran_bad: {
            regel: "STERKT anbefalt fagperson",
            lovhjemmel: "TEK17 §13-3",
            konsekvens: "Vannskade kan koste 100 000+ kr å reparere",
            risiko: "høy"
        }
    },

    // STERKT ANBEFALT FAGPERSON
    anbefalFagperson: {
        flislegging: {
            vanskelighetsgrad: "høy",
            risiko: "middels",
            kostnad_fagperson_per_kvm: 500,
            kostnad_selv_per_kvm: 200,
            besparelse_prosent: 60
        },
        parkett_sliping: {
            vanskelighetsgrad: "middels",
            risiko: "middels",
            kostnad_fagperson_per_kvm: 250,
            kostnad_selv_per_kvm: 75,
            besparelse_prosent: 70
        }
    },

    // KAN GJØRES SELV
    kanGjøresSelv: {
        maling: {
            vanskelighetsgrad: "lett",
            risiko: "lav",
            besparelse_prosent: 70,
            tips: "Perfekt for nybegynnere"
        },
        gulvlegging_laminat: {
            vanskelighetsgrad: "middels",
            risiko: "lav",
            besparelse_prosent: 50,
            tips: "Følg instruksjoner nøye"
        },
        riving: {
            vanskelighetsgrad: "lett",
            risiko: "lav",
            besparelse_prosent: 90,
            tips: "Tung jobb, men enkel - perfekt å spare penger på"
        }
    }
};

// ============================================
// 2. BUDSJETT-REGLER (2025 Norge-priser)
// ============================================

const budsjettRegler = {
    // Minimumskostnader per rom
    minimumBudsjett: {
        soverom: {
            liten: 80000,    // < 10 kvm
            middels: 120000, // 10-20 kvm
            stor: 180000     // > 20 kvm
        },
        bad: {
            liten: 150000,   // < 5 kvm
            middels: 250000, // 5-10 kvm
            stor: 400000     // > 10 kvm
        },
        kjokken: {
            liten: 150000,
            middels: 300000,
            stor: 500000
        },
        stue: {
            liten: 100000,
            middels: 150000,
            stor: 250000
        },
        gulv: {
            liten: 30000,
            middels: 50000,
            stor: 80000
        },
        maling: {
            liten: 15000,
            middels: 25000,
            stor: 40000
        }
    },

    // Buffer-regler basert på erfaring
    buffer: {
        nybegynner: 0.20,      // 20% buffer
        middels: 0.15,         // 15% buffer
        erfaren: 0.10          // 10% buffer
    },

    // Budsjettfordeling (prosent)
    fordeling: {
        soverom: {
            materialer: 0.45,
            fagarbeid: 0.30,
            verktøy: 0.08,
            buffer: 0.17
        },
        bad: {
            materialer: 0.40,
            fagarbeid: 0.45,
            verktøy: 0.05,
            buffer: 0.10
        },
        kjokken: {
            materialer: 0.50,
            fagarbeid: 0.35,
            verktøy: 0.05,
            buffer: 0.10
        },
        stue: {
            materialer: 0.50,
            fagarbeid: 0.25,
            verktøy: 0.10,
            buffer: 0.15
        }
    }
};

// ============================================
// 3. RISIKO-REGLER
// ============================================

const risikoRegler = {
    byggeår: {
        før_1950: {
            risiko: "høy",
            årsaker: ["Mulig asbest", "Gamle elektriske ledninger", "Dårlig isolasjon"],
            tiltak: ["Asbesttest før riving", "Vurder total elektrisk oppgradering"]
        },
        1950_1980: {
            risiko: "middels",
            årsaker: ["Mulig asbest i gulv/lim", "Gamle rør"],
            tiltak: ["Asbesttest ved riving av gulv"]
        },
        1980_2000: {
            risiko: "lav",
            årsaker: [],
            tiltak: []
        },
        etter_2000: {
            risiko: "lav",
            årsaker: [],
            tiltak: []
        }
    },

    rom: {
        bad: {
            risiko: "høy",
            årsaker: ["Vannskade", "Mugg", "Membran"],
            tiltak: ["Bruk fagperson for membran", "Sørg for god ventilasjon"]
        },
        kjokken: {
            risiko: "middels",
            årsaker: ["Vann og elektrisk", "Tunge skap"],
            tiltak: ["Fagperson for vann og elektrisk"]
        },
        soverom: {
            risiko: "lav",
            årsaker: [],
            tiltak: []
        },
        stue: {
            risiko: "lav",
            årsaker: [],
            tiltak: []
        }
    }
};

// ============================================
// 4. HOVEDFUNKSJONER
// ============================================

// Beregn total risiko
function beregnRisiko(byggeår, rom, erfaring, budsjett, minimumBudsjett) {
    let risikoScore = 0;

    // Byggeår
    if (byggeår === '<1950') risikoScore += 3;
    else if (byggeår === '1950-1980') risikoScore += 2;
    else if (byggeår === '1980-2000') risikoScore += 1;

    // Rom
    if (rom === 'bad') risikoScore += 3;
    else if (rom === 'kjokken') risikoScore += 2;
    else risikoScore += 1;

    // Erfaring
    if (erfaring === 'beginner' || erfaring === 'none') risikoScore += 2;
    else if (erfaring === 'middels') risikoScore += 1;

    // Budsjett
    const budsjettRatio = budsjett / minimumBudsjett;
    if (budsjettRatio < 0.8) risikoScore += 2;
    else if (budsjettRatio < 1.0) risikoScore += 1;

    // Returner risiko
    if (risikoScore >= 7) return 'høy';
    else if (risikoScore >= 4) return 'middels';
    else return 'lav';
}

// Valider budsjett
function validerBudsjett(budsjett, rom, størrelse) {
    const budsjettData = budsjettRegler.minimumBudsjett[rom];
    if (!budsjettData) return { status: 'ok', melding: '' };

    let minimumBudsjett;
    if (størrelse < 10) minimumBudsjett = budsjettData.liten;
    else if (størrelse <= 20) minimumBudsjett = budsjettData.middels;
    else minimumBudsjett = budsjettData.stor;

    const ratio = budsjett / minimumBudsjett;

    if (ratio < 0.7) {
        return {
            status: 'kritisk',
            melding: `Budsjettet på ${formatKr(budsjett)} er for lavt. Minimum anbefalt: ${formatKr(minimumBudsjett)}`,
            konsekvens: 'Du vil sannsynligvis gå tom for penger underveis',
            anbefaling: 'Øk budsjettet eller reduser omfanget'
        };
    } else if (ratio < 0.9) {
        return {
            status: 'advarsel',
            melding: `Budsjettet er stramt. Anbefalt minimum: ${formatKr(minimumBudsjett)}`,
            konsekvens: 'Liten margin for uforutsette kostnader',
            anbefaling: 'Vurder å øke budsjettet med 10-20%'
        };
    } else if (ratio < 1.1) {
        return {
            status: 'ok',
            melding: 'Budsjettet er realistisk',
            anbefaling: 'Sett av 15-20% buffer for uforutsette kostnader'
        };
    } else {
        return {
            status: 'god',
            melding: 'Budsjettet gir god margin',
            anbefaling: 'Du har rom for kvalitetsprodukter og uforutsette kostnader'
        };
    }
}

// Formater kroner
function formatKr(beløp) {
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(beløp);
}

// Beregn budsjettfordeling
function beregnBudsjettfordeling(budsjett, rom, erfaring) {
    const fordeling = budsjettRegler.fordeling[rom] || budsjettRegler.fordeling.soverom;
    const bufferProsent = budsjettRegler.buffer[erfaring] || 0.15;

    return {
        materialer: Math.round(budsjett * fordeling.materialer),
        fagarbeid: Math.round(budsjett * fordeling.fagarbeid),
        verktøy: Math.round(budsjett * fordeling.verktøy),
        buffer: Math.round(budsjett * bufferProsent)
    };
}

// ============================================
// 5. GENERER PERSONLIG PROSJEKTPLAN
// ============================================

function genererProsjektplan(formData) {
    const { roomType, roomSize, budget, diyLevel, buildYear, housingType, currentCondition } = formData;

    // Hent mal for romtype
    const mal = prosjektplanMaler[roomType] || prosjektplanMaler.soverom;

    // Beregn minimum budsjett
    let minimumBudsjett;
    const budsjettData = budsjettRegler.minimumBudsjett[roomType];
    if (budsjettData) {
        if (roomSize < 10) minimumBudsjett = budsjettData.liten;
        else if (roomSize <= 20) minimumBudsjett = budsjettData.middels;
        else minimumBudsjett = budsjettData.stor;
    } else {
        minimumBudsjett = budget;
    }

    // Valider budsjett
    const budsjettVurdering = validerBudsjett(budget, roomType, roomSize);

    // Beregn risiko
    const totalRisiko = beregnRisiko(buildYear, roomType, diyLevel, budget, minimumBudsjett);

    // Beregn budsjettfordeling
    const budsjettfordeling = beregnBudsjettfordeling(budget, roomType, diyLevel);

    // Beregn kostnader per fase
    const faserMedKostnad = mal.faser.map(fase => {
        let fasekostnad;
        if (fase.kostnad_prosent) {
            fasekostnad = Math.round(budget * fase.kostnad_prosent);
        } else {
            // Beregn basert på oppgaver
            fasekostnad = fase.oppgaver.reduce((sum, oppgave) => {
                if (oppgave.kostnad_kr) return sum + oppgave.kostnad_kr;
                if (oppgave.kostnad_prosent) return sum + Math.round(budget * oppgave.kostnad_prosent);
                if (oppgave.kostnad_per_kvm) return sum + Math.round(oppgave.kostnad_per_kvm * roomSize);
                return sum;
            }, 0);
        }

        return {
            ...fase,
            kostnad: fasekostnad,
            oppgaver: fase.oppgaver.map(oppgave => {
                let oppgaveKostnad = oppgave.kostnad_kr || 0;
                if (oppgave.kostnad_prosent) oppgaveKostnad = Math.round(budget * oppgave.kostnad_prosent);
                if (oppgave.kostnad_per_kvm) oppgaveKostnad = Math.round(oppgave.kostnad_per_kvm * roomSize);

                return {
                    ...oppgave,
                    kostnad: oppgaveKostnad
                };
            })
        };
    });

    // Generer "Denne uken" oppgaver (fra fase 1)
    const denneUken = faserMedKostnad[0].oppgaver.slice(0, 3).map(oppgave => ({
        oppgave: oppgave.oppgave,
        detaljer: oppgave.detaljer,
        hvor: oppgave.hvor || '',
        kostnad: oppgave.kostnad,
        tid: `${oppgave.tid_timer[0]}-${oppgave.tid_timer[1]} timer`
    }));

    // Generer anbefalinger
    const anbefalinger = [];

    if (budsjettVurdering.status === 'ok' || budsjettVurdering.status === 'god') {
        anbefalinger.push(`✓ ${budsjettVurdering.melding}`);
    }

    // Sjekk for lovpålagt fagarbeid
    const harElektrisk = faserMedKostnad.some(f => f.lovpålagt);
    if (harElektrisk) {
        anbefalinger.push('⚠️ Du MÅ bruke autorisert elektriker for elektrisk arbeid (TEK17)');
    }

    // Besparelsespotensial
    const diyBesparelse = Math.round(budsjettfordeling.fagarbeid * 0.3);
    if (diyLevel === 'beginner' || diyLevel === 'none') {
        anbefalinger.push(`✓ Du kan spare ${formatKr(diyBesparelse)} ved å gjøre maling, riving og montering selv`);
    }

    // Buffer-anbefaling
    const bufferProsent = Math.round((budsjettfordeling.buffer / budget) * 100);
    anbefalinger.push(`⚠️ Legg inn ${bufferProsent}% buffer - oppussing tar ofte lenger tid enn planlagt`);

    // Egnet for nybegynner?
    if (totalRisiko === 'lav' && (diyLevel === 'beginner' || diyLevel === 'none')) {
        anbefalinger.push('✓ Dette prosjektet er godt egnet for nybegynnere med riktig veiledning');
    }

    // Beregn total varighet
    const totalTimer = faserMedKostnad.reduce((sum, fase) => sum + fase.varighet_timer[1], 0);
    const estimertUker = Math.ceil(totalTimer / 20); // Antatt 20 timer per uke

    return {
        prosjekt: {
            navn: `Oppussing av ${getRomNavn(roomType)}`,
            rom: getRomNavn(roomType),
            størrelse: `${roomSize} kvm`,
            budsjett: budget,
            erfaring: diyLevel,
            byggeår: buildYear,
            tilstand: currentCondition
        },
        vurdering: {
            totalRisiko: totalRisiko,
            budsjettVurdering: budsjettVurdering.status,
            egnetForNybegynner: totalRisiko === 'lav' ? 'ja' : totalRisiko === 'middels' ? 'delvis' : 'nei',
            estimertVarighet: `${estimertUker}-${estimertUker + 1} uker`,
            estimertArbeidstimer: `${totalTimer - 10}-${totalTimer} timer`,
            anbefalinger: anbefalinger,
            advarsler: budsjettVurdering.status === 'kritisk' || budsjettVurdering.status === 'advarsel' ? [
                {
                    type: budsjettVurdering.status === 'kritisk' ? 'lovpålagt' : 'anbefaling',
                    melding: budsjettVurdering.melding,
                    konsekvens: budsjettVurdering.konsekvens,
                    anbefaling: budsjettVurdering.anbefaling
                }
            ] : []
        },
        denneUken: denneUken,
        faser: faserMedKostnad,
        budsjett: {
            total: budget,
            fordeling: {
                materialer: {
                    beløp: budsjettfordeling.materialer,
                    prosent: Math.round((budsjettfordeling.materialer / budget) * 100)
                },
                fagarbeid: {
                    beløp: budsjettfordeling.fagarbeid,
                    prosent: Math.round((budsjettfordeling.fagarbeid / budget) * 100)
                },
                verktøy: {
                    beløp: budsjettfordeling.verktøy,
                    prosent: Math.round((budsjettfordeling.verktøy / budget) * 100)
                },
                buffer: {
                    beløp: budsjettfordeling.buffer,
                    prosent: Math.round((budsjettfordeling.buffer / budget) * 100)
                }
            }
        },
        risikovurdering: {
            totalRisiko: totalRisiko
        }
    };
}

function getRomNavn(roomType) {
    const navn = {
        'soverom': 'soverom',
        'bad': 'bad',
        'kjokken': 'kjøkken',
        'stue': 'stue',
        'gulv': 'gulv',
        'maling': 'hele boligen (maling)'
    };
    return navn[roomType] || roomType;
}

