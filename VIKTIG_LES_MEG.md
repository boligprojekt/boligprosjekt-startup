# ⚠️ VIKTIG: Oppdater API-nøkkel

## 🔑 Du må oppdatere Supabase API-nøkkelen

API-nøkkelen du ga meg ser ut til å være en **secret key** i stedet for **anon/public key**.

### Slik finner du riktig nøkkel:

1. Gå til [https://supabase.com](https://supabase.com)
2. Åpne prosjektet ditt: `smeepfduuzxuhrptfczx`
3. Klikk på **Settings** (tannhjul-ikonet) i venstre meny
4. Velg **API** under Project Settings
5. Under **Project API keys**, finn nøkkelen merket **`anon`** `public`
6. Kopier denne nøkkelen (den starter med `eyJ...`)

### Oppdater config.js:

Åpne filen `config.js` og erstatt `SUPABASE_ANON_KEY` med den riktige nøkkelen:

```javascript
const SUPABASE_ANON_KEY = 'eyJ...'; // Lim inn din anon/public key her
```

## 📋 Neste steg:

1. ✅ Oppdater API-nøkkelen i `config.js`
2. ✅ Følg instruksjonene i `SUPABASE_SETUP.md` for å sette opp databasen
3. ✅ Åpne `index.html` i nettleseren for å teste

## 🚨 Viktig sikkerhetsinformasjon:

- **ANON/PUBLIC KEY**: Trygg å bruke i frontend-kode (dette er den du skal bruke)
- **SECRET KEY**: Skal ALDRI brukes i frontend! Kun for backend/server-side kode

Den nøkkelen du ga meg (`sb_secret_...`) er en secret key og skal ikke brukes i nettleseren.

## 📞 Trenger du hjelp?

Hvis du har problemer med å finne riktig nøkkel, kan du:
1. Sjekke Supabase dokumentasjonen
2. Se på skjermbildet i `SUPABASE_SETUP.md`
3. Spørre meg om hjelp!

