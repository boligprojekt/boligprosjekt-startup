#!/bin/bash

# Script for å forberede filer for deployment

echo "Forbereder filer for deployment..."

# Opprett deploy mappe
mkdir -p deploy

# Kopier HTML filer
cp index.html deploy/
cp login.html deploy/
cp registrer.html deploy/
cp profil.html deploy/
cp prosjekt.html deploy/
cp om.html deploy/

# Kopier CSS filer
cp styles.css deploy/
cp auth.css deploy/
cp om.css deploy/
cp profil.css deploy/
cp prosjekt.css deploy/

# Kopier JavaScript filer
cp script.js deploy/
cp auth.js deploy/
cp profil.js deploy/
cp prosjekt.js deploy/
cp config.js deploy/

# Kopier Netlify config
cp netlify.toml deploy/

echo "✅ Filer kopiert til 'deploy' mappen!"
echo ""
echo "Neste steg:"
echo "1. Høyreklikk på 'deploy' mappen"
echo "2. Velg 'Compress deploy'"
echo "3. Du får en 'deploy.zip' fil"
echo "4. Dra deploy.zip til Netlify Drop: https://app.netlify.com/drop"

