# Oppsett av Profilbilde Funksjonalitet

## Steg 1: Oppdater Database Schema

Kjør dette i Supabase SQL Editor:

```sql
-- Legg til avatar_url kolonne i user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Opprett user_images tabell for å holde oversikt over alle bilder
CREATE TABLE IF NOT EXISTS user_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    public_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'avatar',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_type ON user_images(image_type);

-- Enable RLS
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_images
CREATE POLICY "Users can view their own images"
    ON user_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
    ON user_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
    ON user_images FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
    ON user_images FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_images_updated_at
    BEFORE UPDATE ON user_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Steg 2: Opprett Storage Bucket i Supabase Dashboard

1. Gå til Supabase Dashboard: https://supabase.com/dashboard
2. Velg ditt prosjekt
3. Klikk på "Storage" i venstre meny
4. Klikk på "New bucket"
5. Fyll inn:
   - Name: `profile-images`
   - Public bucket: ✅ JA (huk av)
6. Klikk "Create bucket"

## Steg 3: Sett opp Storage Policies

Etter at bucket er opprettet, kjør dette i SQL Editor:

```sql
-- Policy: Alle kan se profilbilder
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

-- Policy: Brukere kan laste opp sine egne profilbilder
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Brukere kan oppdatere sine egne profilbilder
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Brukere kan slette sine egne profilbilder
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Steg 4: Test Funksjonaliteten

1. Åpne nettsiden og logg inn
2. Gå til profilsiden (profil.html)
3. Klikk på kamera-ikonet nederst til høyre på profilbildet
4. Velg et bilde (maks 2MB)
5. Bildet skal lastes opp og vises umiddelbart

## Filbegrensninger

- Filtype: Kun bildefiler (image/*)
- Maksimal størrelse: 2MB
- Støttede formater: JPG, PNG, GIF, WebP, etc.

## Hva gjør user_images tabellen?

Tabellen `user_images` holder oversikt over alle bilder som brukere laster opp:

- **id**: Unik ID for hvert bilde
- **user_id**: Hvilken bruker som eier bildet
- **file_name**: Filnavnet som ble lagret
- **file_path**: Full sti i storage bucket
- **file_size**: Størrelse i bytes
- **mime_type**: Filtype (image/jpeg, image/png, etc.)
- **public_url**: Offentlig URL til bildet
- **image_type**: Type bilde (avatar, project, other)
- **is_active**: Om bildet er aktivt (kun ett aktivt avatar per bruker)
- **created_at**: Når bildet ble lastet opp
- **updated_at**: Når bildet sist ble oppdatert

### Fordeler med denne tabellen:

1. Full historikk over alle opplastede bilder
2. Enkel å finne og slette gamle bilder
3. Kan se hvor mye lagringsplass hver bruker bruker
4. Kan utvide til å støtte flere bildetyper (prosjektbilder, etc.)

## Feilsøking

Hvis opplasting ikke fungerer:

1. Sjekk at bucket "profile-images" er opprettet og er PUBLIC
2. Sjekk at alle policies er opprettet riktig (både storage og user_images)
3. Sjekk nettleserkonsollen for feilmeldinger
4. Verifiser at avatar_url kolonnen finnes i user_profiles tabellen
5. Verifiser at user_images tabellen er opprettet

