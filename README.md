# TrustTrade

**AI-powered fraud detection for informal traders in Southern Africa.**

TrustTrade helps peer-to-peer (P2P) traders in the SADC region identify scams before they lose money. Enter the details of a transaction and get an instant risk score with actionable advice — no internet required.

**Live:** [https://trusttrade.nxtvortex.org](https://trusttrade.nxtvortex.org)

---

## Features

- **Instant risk scoring** — analyses 15+ signals across 6 dimensions and returns a 0–100 risk score
- **Clear risk levels** — LOW (safe), MEDIUM (caution), HIGH (stop)
- **Detailed explanations** — every flag is explained in plain language with recommended next steps
- **Transaction history** — optional local log of past checks (stored on-device only)
- **Offline-first** — works with zero internet or data connection
- **Multi-language** — built-in i18n support for SADC languages
- **Cross-platform** — runs as a PWA, Android app (Capacitor), or desktop app (Electron)
- **Privacy by default** — no accounts, no data sent anywhere, no tracking

---

## Risk Signals Analysed

| Dimension | Examples |
|-----------|---------|
| Contact type | New stranger / Known person / Repeat trader |
| Transaction amount | ZAR value relative to typical fraud thresholds |
| Prepayment % | How much is being paid upfront |
| Communication channel | WhatsApp, SMS, In-person, Unknown |
| Urgency / pressure | Time pressure tactics |
| Free-text notes | Keyword detection for common scam phrases |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Mobile | Capacitor (Android) |
| Desktop | Electron |
| PWA | Vite PWA Plugin |
| Optional AI | Anthropic Claude API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/your-username/trusttrade.git
cd trusttrade

# 2. Install all dependencies
npm run install:all

# 3. Start the backend (port 3002)
cd server
cp .env.example .env
node index.js

# 4. In a second terminal, start the frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts (root)

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install client and desktop dependencies |
| `npm run build:web` | Build the React frontend for production |
| `npm run start:web` | Start the Express server |
| `npm run dev:client` | Start the Vite dev server |
| `npm run desktop` | Build and launch the Electron desktop app |
| `npm run android:build` | Build the Android APK |

### Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

```env
PORT=3002
NODE_ENV=development

# Optional — enables enhanced Claude AI analysis
ANTHROPIC_API_KEY=your_api_key_here
```

---

## Project Structure

```
TrustTrade/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── screens/         # Home, Check, History, Info views
│   │   ├── components/      # NavBar, TabBar, UI components
│   │   ├── context/         # Settings context
│   │   ├── hooks/           # useHistory, useSettings
│   │   └── i18n/            # Translation strings
│   └── android/             # Capacitor Android project
├── server/                  # Express backend
│   ├── index.js             # Static file serving + API
│   └── .env.example
├── desktop/                 # Electron wrapper
│   ├── main.js
│   └── preload.js
├── deploy.sh                # PM2 production deployment
└── package.json             # Root build scripts
```

---

## API

### `POST /api/analyse`

Analyses a transaction and returns a risk assessment.

**Request body:**

```json
{
  "contactType": "new",
  "amount": 2500,
  "prepaymentPct": 100,
  "channel": "whatsapp",
  "urgency": "high",
  "notes": "Seller says he needs money today only"
}
```

**Response:**

```json
{
  "score": 82,
  "level": "HIGH",
  "label": "Stop — Be Careful",
  "flags": ["100% upfront payment requested", "High urgency pressure detected"],
  "recommendation": "Do not proceed. Multiple high-risk signals detected."
}
```

### `GET /health`

Returns `200 OK` when the server is running.

---

## Deployment

The app is deployed on Ubuntu Server using PM2 and Nginx.

```bash
# Build and deploy
bash deploy.sh
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "add your feature"`
4. Push and open a Pull Request

---

## License

MIT

---

> Built at a hackathon to protect informal traders across Southern Africa from financial fraud.
