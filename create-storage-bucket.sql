-- Opprett Storage Bucket for profilbilder
-- Kjør dette i Supabase SQL Editor

-- Først, sjekk om bucket finnes
SELECT * FROM storage.buckets WHERE name = 'profile-images';

-- Hvis bucket ikke finnes, opprett den
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images',
    'profile-images',
    true,
    2097152, -- 2MB i bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Verifiser at bucket er opprettet
SELECT * FROM storage.buckets WHERE name = 'profile-images';

-- Sett opp Storage Policies
-- Policy: Alle kan se profilbilder (public read)
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
    'Public Access',
    'profile-images',
    '(bucket_id = ''profile-images'')',
    NULL
)
ON CONFLICT DO NOTHING;

-- Policy: Brukere kan laste opp sine egne profilbilder
CREATE POLICY IF NOT EXISTS "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'profile-images' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy: Brukere kan oppdatere sine egne profilbilder
CREATE POLICY IF NOT EXISTS "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'profile-images' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy: Brukere kan slette sine egne profilbilder
CREATE POLICY IF NOT EXISTS "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'profile-images' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy: Alle kan lese profilbilder
CREATE POLICY IF NOT EXISTS "Public can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

