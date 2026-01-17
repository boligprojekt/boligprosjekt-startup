-- Oppdater user_profiles tabell for å legge til display_name kolonne
-- Kjør dette i Supabase SQL Editor

-- Legg til display_name kolonne hvis den ikke finnes
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- Oppdater eksisterende brukere: sett display_name til full_name hvis display_name er NULL
UPDATE user_profiles
SET display_name = full_name
WHERE display_name IS NULL AND full_name IS NOT NULL;

-- Hvis du ikke har noen data i user_profiles, opprett en rad for din bruker
-- Erstatt 'DIN-USER-ID' med din faktiske user ID fra auth.users tabellen
-- Du kan finne din user ID ved å kjøre: SELECT id, email FROM auth.users;

-- Eksempel for å sette display_name manuelt:
-- UPDATE user_profiles SET display_name = 'Mohamed Abdo' WHERE id = 'DIN-USER-ID';

-- Eller opprett profil hvis den ikke finnes:
-- INSERT INTO user_profiles (id, display_name, full_name)
-- SELECT id, 'Mohamed Abdo', 'Mohamed Abdo'
-- FROM auth.users
-- WHERE email = 'din@epost.no'
-- ON CONFLICT (id) DO UPDATE SET display_name = 'Mohamed Abdo', full_name = 'Mohamed Abdo';

