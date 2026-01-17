-- Setup Supabase Storage for profilbilder
-- Kjør dette i Supabase SQL Editor

-- Legg til avatar_url kolonne i user_profiles hvis den ikke finnes
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Storage bucket opprettes via Supabase Dashboard, men her er policies:

-- Storage policies for profile-images bucket
-- Disse må kjøres ETTER at du har opprettet 'profile-images' bucket i Supabase Dashboard

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

