#!/bin/bash
set -e

echo ""
echo "🚀 TrustTrade Deploy Script"
echo "─────────────────────────────"

# 1. Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install --omit=dev && cd ..

# 2. Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo "🏗️  Building frontend..."
cd client && npm run build && cd ..

# 3. Ensure .env exists
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
fi

# 4. Start or reload with PM2
echo "♻️  Starting TrustTrade with PM2..."
if pm2 list | grep -q 'trusttrade'; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
fi

pm2 save

echo ""
echo "✅ TrustTrade is live on port 3002"
echo ""
pm2 status trusttrade
