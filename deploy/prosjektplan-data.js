// BoligProsjekt - Prosjektplan Data
// Detaljerte planer for ulike rom

const prosjektplanMaler = {
    soverom: {
        faser: [
            {
                fase: 1,
                navn: "Planlegging og forberedelse",
                uke: "Uke 1",
                varighet_timer: [5, 8],
                kostnad_prosent: 0.03,
                risiko: "lav",
                hvemGjør: "selv",
                oppgaver: [
                    {
                        oppgave: "Velg farge og stil",
                        detaljer: "Test fargeprøver på veggen. Se på dem i dagslys og kveldslys.",
                        tid_timer: [2, 3],
                        kostnad_kr: 200,
                        tips: "Mørke farger krever ofte 3 strøk, lyse farger 2 strøk",
                        vanligeFeil: "Velger farge basert på små prøver - test alltid på stor flate først",
                        hvor: "Jotun Fargerike, IKEA eller Byggmakker"
                    },
                    {
                        oppgave: "Lag detaljert innkjøpsliste",
                        detaljer: "Bruk BoligProsjekt til å finne produkter og sammenligne priser",
                        tid_timer: [2, 3],
                        kostnad_kr: 0,
                        tips: "Kjøp 10% ekstra maling og gulv - bedre med litt for mye enn for lite"
                    },
                    {
                        oppgave: "Bestill elektriker",
                        detaljer: "Book elektriker 2-3 uker frem i tid. Bekreft at de er autoriserte.",
                        tid_timer: [1, 2],
                        kostnad_kr: 0,
                        lovpålagt: true,
                        tips: "Spør om de kan gjøre jobben i én dag for å spare penger",
                        advarsel: "MÅ være autorisert elektriker (TEK17 §14-4)"
                    },
                    {
                        oppgave: "Kjøp eller lei verktøy",
                        detaljer: "Slipemaskin, malerruller, pensler, sparkler, avrettingsmasse",
                        tid_timer: [1, 2],
                        kostnad_kr: 4800,
                        hvor: "Biltema, Jula eller XXL (utleieverktøy)",
                        tips: "Lei slipemaskin (300-500 kr/dag) i stedet for å kjøpe (3000-5000 kr)"
                    }
                ],
                sjekkliste: [
                    "Fargeprøver testet på veggen",
                    "Elektriker booket og bekreftet",
                    "Innkjøpsliste ferdig",
                    "Verktøy kjøpt eller reservert for utleie",
                    "Budsjett godkjent",
                    "Tidsplan lagt"
                ]
            },
            {
                fase: 2,
                navn: "Klargjøring og riving",
                uke: "Uke 1-2",
                varighet_timer: [12, 16],
                kostnad_prosent: 0.05,
                risiko: "lav",
                hvemGjør: "selv",
                oppgaver: [
                    {
                        oppgave: "Tøm rommet helt",
                        detaljer: "Flytt alle møbler, bilder, gardiner ut av rommet",
                        tid_timer: [2, 3],
                        kostnad_kr: 0,
                        tips: "Dekk til møbler i andre rom med plastduk - støv sprer seg overalt"
                    },
                    {
                        oppgave: "Demonter lister, stikkontakter og lysbrytere",
                        detaljer: "Skru av strømmen først! Ta bilder før du demonterer.",
                        tid_timer: [2, 3],
                        kostnad_kr: 0,
                        sikkerhet: "Slå av sikringen før du tar av stikkontakter",
                        tips: "Merk hvilken list som kom fra hvilken vegg med blyant på baksiden",
                        vanligeFeil: "Glemmer å ta bilder - vanskelig å huske hvordan det var montert"
                    },
                    {
                        oppgave: "Riv gammelt gulv (hvis nødvendig)",
                        detaljer: "Bruk brekkjern og hammer. Start i et hjørne.",
                        tid_timer: [4, 6],
                        kostnad_kr: 2000,
                        hvor: "Leie container: 2000-3000 kr",
                        tips: "Sjekk om det er asbest i gulvet hvis huset er bygget før 1980",
                        vanligeFeil: "Undervurderer mengden avfall - lei stor nok container",
                        advarsel_byggeår: "før_1980"
                    },
                    {
                        oppgave: "Rens og støvsug grundig",
                        detaljer: "Fjern alt støv og rusk. Vask gulv hvis det skal males.",
                        tid_timer: [2, 3],
                        kostnad_kr: 500,
                        tips: "Bruk industristøvsuger hvis mulig - vanlig støvsuger tetter fort"
                    },
                    {
                        oppgave: "Dekk til gulv og vinduer",
                        detaljer: "Bruk plastduk og malertape",
                        tid_timer: [1, 2],
                        kostnad_kr: 500,
                        produkter: "Plastduk (Biltema 200 kr), Malertape (Jula 150 kr)"
                    }
                ],
                sjekkliste: [
                    "Rommet er helt tomt",
                    "Lister demontert og merket",
                    "Stikkontakter og brytere demontert (strøm av)",
                    "Gammelt gulv fjernet",
                    "Avfall kjørt bort",
                    "Rommet rengjort og støvsuget",
                    "Gulv og vinduer dekket til"
                ]
            },
            {
                fase: 3,
                navn: "Elektrisk arbeid",
                uke: "Uke 2",
                varighet_timer: [8, 10],
                kostnad_prosent: 0.30,
                risiko: "høy",
                hvemGjør: "fagperson",
                lovpålagt: true,
                oppgaver: [
                    {
                        oppgave: "Ny elektrisk installasjon",
                        detaljer: "Elektriker installerer nye stikkontakter, lysbrytere og eventuelt downlights",
                        tid_timer: [6, 8],
                        kostnad_prosent: 0.23,
                        lovpålagt: true,
                        hvorfor: "Kun autorisert elektriker kan utføre elektrisk arbeid (TEK17 §14-4)",
                        tips: "Be elektrikeren om å installere ekstra stikkontakter - billigere å gjøre nå enn senere"
                    },
                    {
                        oppgave: "Kontroll og godkjenning",
                        detaljer: "Elektriker tester installasjonen og utsteder ferdigattest",
                        tid_timer: [1, 2],
                        kostnad_prosent: 0.03,
                        lovpålagt: true,
                        viktig: "Uten ferdigattest kan forsikringen bli ugyldig"
                    },
                    {
                        oppgave: "Sparkling rundt nye bokser",
                        detaljer: "Sparkle rundt nye elektriske bokser for jevn overflate",
                        tid_timer: [1, 2],
                        kostnad_prosent: 0.03,
                        hvemGjør: "elektriker eller selv",
                        tips: "Spør elektrikeren om de kan gjøre dette - ofte inkludert i prisen"
                    }
                ],
                sjekkliste: [
                    "Elektriker har bekreftet dato",
                    "Nye stikkontakter installert",
                    "Nye lysbrytere installert",
                    "Eventuelt downlights installert",
                    "Alt testet og godkjent",
                    "Ferdigattest mottatt (VIKTIG!)",
                    "Sparklet rundt nye bokser"
                ],
                advarsel: {
                    type: "kritisk",
                    melding: "ALDRI gjør elektrisk arbeid selv uten autorisasjon",
                    konsekvens: "Brudd på TEK17, forsikring ugyldig, livsfare"
                }
            },
            {
                fase: 4,
                navn: "Overflatebehandling av vegger",
                uke: "Uke 2-3",
                varighet_timer: [16, 20],
                kostnad_prosent: 0.10,
                risiko: "middels",
                hvemGjør: "selv",
                oppgaver: [
                    {
                        oppgave: "Slipe vegger",
                        detaljer: "Slipe ned ujevnheter og gammel maling. Bruk P120-P150 sandpapir.",
                        tid_timer: [4, 6],
                        kostnad_kr: 800,
                        verktøy: "Slipemaskin (lei for 400 kr/dag)",
                        sikkerhet: "Bruk støvmaske og goggles - mye støv!",
                        tips: "Åpne vinduer og bruk vifte - støvet setter seg overalt",
                        vanligeFeil: "Slipper for lett - gammel maling må slipes ordentlig for god heft"
                    },
                    {
                        oppgave: "Støvsug og vask vegger",
                        detaljer: "Fjern alt støv med støvsuger og vask med vann og såpe",
                        tid_timer: [2, 3],
                        kostnad_kr: 200,
                        tips: "La veggene tørke helt før du begynner å sparkle (12-24 timer)"
                    },
                    {
                        oppgave: "Sparkle hull og sprekker",
                        detaljer: "Bruk sparkel på alle hull, sprekker og ujevnheter. 2-3 strøk.",
                        tid_timer: [6, 8],
                        kostnad_kr: 1500,
                        produkter: "Sparkel (Jotun Perfecta, 300 kr), Sparkler (150 kr)",
                        tips: "Bedre med flere tynne lag enn ett tykt lag",
                        vanligeFeil: "Sparkler for tykt - får sprekker når det tørker"
                    },
                    {
                        oppgave: "Slipe sparklet overflate",
                        detaljer: "Slipe sparklet overflate jevn med P180-P220 sandpapir",
                        tid_timer: [2, 3],
                        kostnad_kr: 300,
                        tips: "Bruk en lampe fra siden for å se ujevnheter"
                    },
                    {
                        oppgave: "Grunning av vegger",
                        detaljer: "Påfør grunn på alle vegger. 1 strøk.",
                        tid_timer: [2, 3],
                        kostnad_kr: 1200,
                        produkter: "Grunning (Jotun, 600 kr), Ruller og pensler (600 kr)",
                        tips: "Grunn gjør at malingen fester bedre og du bruker mindre maling"
                    }
                ],
                sjekkliste: [
                    "Vegger slipt ned",
                    "Støvsuget og vasket",
                    "Alle hull og sprekker sparklet",
                    "Sparkel slipt jevn",
                    "Vegger grunnet",
                    "Grunn tørket (12-24 timer)"
                ]
            },
            {
                fase: 5,
                navn: "Gulvlegging",
                uke: "Uke 3",
                varighet_timer: [10, 12],
                kostnad_prosent: 0.23,
                risiko: "middels",
                hvemGjør: "selv eller fagperson",
                oppgaver: [
                    {
                        oppgave: "Klargjør undergulv",
                        detaljer: "Sjekk at undergulvet er plant og tørt. Bruk avrettingsmasse hvis nødvendig.",
                        tid_timer: [2, 3],
                        kostnad_kr: 2000,
                        produkter: "Avrettingsmasse (Byggmakker, 500 kr/sekk)",
                        tips: "Bruk vaterpas - gulvet må være plant innen 2mm per meter",
                        vanligeFeil: "Legger gulv på ujevnt underlag - gulvet knirker og slites ujevnt"
                    },
                    {
                        oppgave: "Legg underlagsmatte",
                        detaljer: "Rull ut underlagsmatte over hele gulvet. Tape skjøtene.",
                        tid_timer: [1, 2],
                        kostnad_kr: 1500,
                        produkter: "Underlagsmatte (IKEA/Byggmakker, 100 kr/kvm)",
                        tips: "Kjøp matte med dampsperre hvis du legger på betong"
                    },
                    {
                        oppgave: "Legg laminat/parkett",
                        detaljer: "Start i et hjørne. Bruk avstandsklosser mot vegg (8-10mm).",
                        tid_timer: [6, 8],
                        kostnad_per_kvm: 1500,
                        produkter: "Laminat/parkett (IKEA/Byggmakker, 150-200 kr/kvm)",
                        tips: "La gulvet akklimatisere seg i rommet i 48 timer før legging",
                        vanligeFeil: "Glemmer ekspansjonsfuge mot vegg - gulvet kan bule opp"
                    },
                    {
                        oppgave: "Monter gulvlister",
                        detaljer: "Skjær lister i riktig lengde og fest med lim eller spiker",
                        tid_timer: [2, 3],
                        kostnad_kr: 2000,
                        produkter: "Gulvlister (Byggmakker, 50-80 kr/meter)",
                        tips: "Bruk gjærsag for pene 45-graders hjørner"
                    }
                ],
                sjekkliste: [
                    "Undergulv sjekket og planert",
                    "Avrettingsmasse påført (hvis nødvendig)",
                    "Underlagsmatte lagt",
                    "Gulv akklimatisert i 48 timer",
                    "Gulv lagt med riktig ekspansjonsfuge",
                    "Gulvlister montert",
                    "Rommet ryddet for avfall"
                ],
                alternativ: {
                    navn: "Bruk fagperson",
                    kostnad_ekstra: 10000,
                    fordeler: "Profesjonelt resultat, garanti, raskere",
                    ulemper: "Dyrere",
                    anbefaling: "Vurder fagperson hvis du er usikker - gulv er synlig og vanskelig å fikse"
                }
            },
            {
                fase: 6,
                navn: "Maling og finish",
                uke: "Uke 3-4",
                varighet_timer: [12, 16],
                kostnad_prosent: 0.08,
                risiko: "lav",
                hvemGjør: "selv",
                oppgaver: [
                    {
                        oppgave: "Tape av lister og vinduer",
                        detaljer: "Bruk malertape langs alle lister, vinduer og dører",
                        tid_timer: [1, 2],
                        kostnad_kr: 300,
                        tips: "Bruk god kvalitet malertape - billig tape slipper eller river av maling"
                    },
                    {
                        oppgave: "Mal tak (hvis ønskelig)",
                        detaljer: "Mal taket først. 2 strøk hvit takfarge.",
                        tid_timer: [3, 4],
                        kostnad_kr: 1500,
                        produkter: "Takfarge (Jotun, 700 kr), Ruller (200 kr)",
                        tips: "Bruk teleskopstang - slipper å stå på stige hele tiden"
                    },
                    {
                        oppgave: "Mal vegger - 1. og 2. strøk",
                        detaljer: "Mal alle vegger. Bruk rulle og pensel i hjørner. 2-3 strøk.",
                        tid_timer: [6, 8],
                        kostnad_kr: 4000,
                        produkter: "Veggmaling (Jotun Lady, 800 kr/bøtte)",
                        tips: "Mal i W-bevegelser for jevn fordeling. Vent 4-6 timer mellom strøk",
                        vanligeFeil: "Maler for tynt - trenger ofte 3 strøk i stedet for 2"
                    },
                    {
                        oppgave: "Mal lister og dører",
                        detaljer: "Mal lister og dører med pensel eller liten rulle",
                        tid_timer: [2, 3],
                        kostnad_kr: 1200,
                        produkter: "Listmaling (Jotun, 600 kr)",
                        tips: "Bruk halvblank maling på lister - lettere å vaske"
                    }
                ],
                sjekkliste: [
                    "Alt tapet av",
                    "Tak malt (2 strøk)",
                    "Vegger malt (2-3 strøk)",
                    "Lister og dører malt",
                    "Tape fjernet",
                    "Rommet rengjort",
                    "Maling luftet ut (24-48 timer)"
                ]
            },
            {
                fase: 7,
                navn: "Møblering og styling",
                uke: "Uke 4",
                varighet_timer: [8, 10],
                kostnad_prosent: 0.20,
                risiko: "lav",
                hvemGjør: "selv",
                oppgaver: [
                    {
                        oppgave: "Monter gardiner/persienner",
                        detaljer: "Fest gardinoppheng eller persienner",
                        tid_timer: [2, 3],
                        kostnad_kr: 3000,
                        produkter: "Gardiner (IKEA, 1500-3000 kr)",
                        tips: "Heng gardinstangen høyt og bredt - rommet ser større ut"
                    },
                    {
                        oppgave: "Monter lamper",
                        detaljer: "Heng opp taklampe og eventuelt vegglamper",
                        tid_timer: [1, 2],
                        kostnad_kr: 5000,
                        produkter: "Lamper (IKEA/Elkjøp, 2000-5000 kr)",
                        sikkerhet: "Slå av strømmen før du monterer lamper"
                    },
                    {
                        oppgave: "Flytt inn møbler",
                        detaljer: "Flytt seng, skap og andre møbler tilbake",
                        tid_timer: [2, 3],
                        kostnad_kr: 0,
                        tips: "Vent til malingen er helt tørr (48 timer)"
                    },
                    {
                        oppgave: "Kjøp nye møbler (hvis ønskelig)",
                        detaljer: "Ny seng, nattbord, kommode",
                        tid_timer: [3, 4],
                        kostnad_prosent: 0.13,
                        produkter: "Seng (IKEA, 8000 kr), Nattbord (2000 kr), Kommode (5000 kr)",
                        tips: "Mål nøye før du kjøper - sjekk at møblene passer i rommet"
                    }
                ],
                sjekkliste: [
                    "Gardiner/persienner montert",
                    "Lamper montert og testet",
                    "Møbler flyttet inn",
                    "Nye møbler kjøpt og montert",
                    "Dekor på plass",
                    "Rommet klart til bruk!"
                ]
            }
        ]
    }
};

