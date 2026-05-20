# TrustTrade

AI-powered fraud detection for informal peer-to-peer traders in Southern Africa.

**Stack:** React + Tailwind CSS + Framer Motion · Node.js + Express · Anthropic Claude API (optional)

---

## Local Development

**Terminal 1 — Backend** (port 3002):
```bash
cd server
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

**Terminal 2 — Frontend** (port 5173, proxies `/api` → 3002):
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

> No API key? The app runs in **rule-based demo mode** automatically — no setup needed.

---

## Ubuntu Server Deployment (PM2)

### One-time server setup

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PM2 globally
sudo npm install -g pm2

# 3. Auto-start PM2 on reboot
pm2 startup
# Run the command it prints out (starts with "sudo env PATH=...")
```

### Deploy TrustTrade

```bash
# 1. Clone or upload the project to your server
git clone <your-repo-url> /var/www/trusttrade
cd /var/www/trusttrade

# — OR upload via scp from your local machine:
# scp -r TrustTrade/ user@your-server:/var/www/trusttrade

# 2. Configure environment
cp server/.env.example server/.env
nano server/.env
# Set NODE_ENV=production, PORT=3002
# Optionally add your ANTHROPIC_API_KEY

# 3. Run the deploy script
chmod +x deploy.sh
./deploy.sh
```

The deploy script:
- Installs server + client dependencies
- Builds the React frontend (`client/dist/`)
- Starts (or reloads) the app with PM2 on port **3002**
- Saves PM2 process list for reboots

### Redeploy after changes

```bash
cd /var/www/trusttrade
git pull          # or re-upload files
./deploy.sh       # rebuilds and hot-reloads PM2
```

### Useful PM2 commands

```bash
pm2 status                  # Check app status
pm2 logs trusttrade         # Live logs
pm2 logs trusttrade --lines 100  # Last 100 lines
pm2 restart trusttrade      # Restart
pm2 stop trusttrade         # Stop
```

---

## Nginx Reverse Proxy (optional but recommended)

If you want to serve on port 80/443 with a domain:

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/trusttrade
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/trusttrade /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

For HTTPS, add Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Variables (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `3002`) |
| `NODE_ENV` | Yes (prod) | Set to `production` |
| `ANTHROPIC_API_KEY` | No | Enables Claude AI mode. Leave blank for rule-based demo. |

---

## API

`POST /api/analyse`

```json
{
  "contactType": "New | Known | Repeat",
  "amount": "5000",
  "prepayment": "50",
  "channel": "WhatsApp | SMS | In person | Unknown platform",
  "urgency": "None | Moderate | High pressure",
  "notes": "optional free text"
}
```

Response:
```json
{
  "riskLevel": "LOW | MEDIUM | HIGH",
  "riskScore": 72,
  "reasons": ["reason 1", "reason 2"],
  "recommendation": "Plain English advice for the trader.",
  "demo": false
}
```

`GET /health` — returns status and current analysis mode.

---

## Get an Anthropic API Key (optional)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in → **API Keys** → **Create Key**
3. Add it to `server/.env` as `ANTHROPIC_API_KEY=sk-ant-...`
4. Redeploy with `./deploy.sh`
