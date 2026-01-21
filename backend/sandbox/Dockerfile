# ============================================
# BOLIGPROSJEKT AI SANDBOX
# ============================================
# Sikker miljø for bildebehandling og AI-operasjoner
# Inspirert av vibecode.dev arkitektur

FROM node:20-alpine

# Metadata
LABEL maintainer="BoligProsjekt <dev@boligprosjekt.io>"
LABEL description="AI Sandbox for image processing and prompt generation"

# Installer system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

# Opprett sandbox bruker (ikke root)
RUN addgroup -g 1001 sandbox && \
    adduser -D -u 1001 -G sandbox sandbox

# Sett working directory
WORKDIR /sandbox

# Kopier package files
COPY package.json package-lock.json* ./

# Installer dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Kopier sandbox kode
COPY runner.js ./
COPY utils/ ./utils/

# Sett riktige permissions
RUN chown -R sandbox:sandbox /sandbox

# Bytt til sandbox bruker
USER sandbox

# Resource limits (settes ved runtime)
# --memory="512m" --cpus="1.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Start sandbox runner
CMD ["node", "runner.js"]

