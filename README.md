# Project Nahan (نهان) Gateway `v3.1.0`

> High-Performance, Modular Telemetry Gateway, Dual VLESS & Trojan Proxy, Multi-Client Subscription Engine, and Self-Healing Relay Mesh for Cloudflare Workers & Pages.

[![Version](https://img.shields.io/badge/version-3.1.0-blue.svg)](https://github.com/itsyebekhe/nahan)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

---

## 🌟 Key Features

- **⚡ Dual Protocol Support**: Full VLESS and Trojan protocol demuxing over Cloudflare WebSockets (`cloudflare:sockets`) with early-data handling.
- **🛡️ Self-Healing Relay Mesh**:
  - Passive fail-streak quarantine (15-minute cool-off after 5 consecutive failures).
  - Active background TLS liveness probes with two-stage verdicts (4s fast check, 7s deep check).
  - Automated Graveyard burial with slow re-probing (30 minutes) and 3-strike resurrection.
  - Per-SNI AI quarantine: Preserves relays for standard traffic while routing AI traffic (Gemini, ChatGPT, Claude) through clean endpoints.
- **📦 Multi-Client Subscription Generator**:
  - Automatically exports configurations for **Clash Meta / Mihomo** (YAML & JSON), **Sing-box** (JSON), **V2Ray / Xray** (JSON), and standard **URI / Base64**.
  - Auto-generated per-country routing groups with national emoji flags and latency-based auto-selectors.
  - Support for Anti-Filtering TCP fragmentation, TLS cipher masks, and ECH (Encrypted Client Hello).
- **👥 Multi-User Quota & Accounting**:
  - Exact bidirectional byte accounting (upload + download) per tunnel.
  - Granular bandwidth limits (Total GB & Daily GB) and expiration dates with automatic disabling.
- **🤖 Bilingual Telegram Bot**:
  - Full management webhook with interactive inline menus in English and Persian (فارسی).
  - Manage subscribers, extend traffic quotas, inspect real-time connection counters, and trigger panic key rotations.
- **🎛️ Interactive Web Dashboard & Web Deployer**:
  - Built-in web dashboard for user management and real-time network topology inspection.
  - Browser-based 1-click deployer (`index.html`) using Cloudflare REST APIs with automated D1 database creation.
- **🧩 100% Modular ES Architecture**:
  - Refactored from an 11,000+ line monolith into focused, single-responsibility ES modules with all files strictly under 650 lines and the entry point under 300 lines.

---

## 🏗️ Architecture

```
                 Incoming Traffic (HTTP / WebSocket)
                                │
                                ▼
                       ┌─────────────────┐
                       │    worker.js    │ (279 lines - Router & Dispatcher)
                       └────────┬────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ src/tunnel.js │       │  src/api.js   │       │  src/subs/    │
│ VLESS & Trojan│       │ REST APIs     │       │ Transformers  │
│ WS Sockets    │       │ Auth & Sync   │       │ & Generators  │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ src/relays.js │       │  src/db.js    │       │ src/telegram/ │
│ Health Probes │       │ D1 KV Store   │       │ Bot Webhook   │
│ & Graveyard   │       │ & Runner Lock │       │ & i18n (FA/EN)│
└───────────────┘       └───────────────┘       └───────────────┘
```

### Module Directory

- `worker.js`: Central request router, telemetry WebSocket upgrade handler, and maintenance site fallback.
- `src/config.js`: Shared constants, system default settings, circuit breaker thresholds, and in-memory caches.
- `src/crypto.js`: Pure SHA-224 cryptographic hashing, Trojan password lookup registry, and UUID generators.
- `src/db.js`: Cloudflare D1 SQLite database binding, distributed runner lease locking, and audit logging.
- `src/relays.js`: Relay health monitoring, TLS probes, quarantine maps, and graveyard state machine.
- `src/tunnel.js`: Low-latency WebSocket data streaming, binary header decoding, and TCP socket pipelining.
- `src/subs/geo.js`: IP geolocation resolution, country flags, and ISP data caching.
- `src/subs/transformers.js`: Unified proxy schema transformer, fragmentation settings, and upstream VLESS URI parser.
- `src/subs/generators.js`: Output format adapters (Clash YAML, Clash JSON, Sing-box, V2Ray JSON, and URI lists).
- `src/telegram/bot.js`: Telegram bot state machine, administrative inline keyboards, and alert notifications.
- `src/telegram/i18n.js`: English and Persian localized translation tables.
- `src/api.js`: Administrative REST endpoints (`/api/auth`, `/api/sync`, `/api/users`, `/api/stats`, `/api/keys`, `/api/update`).

---

## 🚀 Deployment Guide

### Option 1: Browser 1-Click Deployer (No Terminal Required)
Open `index.html` in your browser (or visit the hosted gateway page):
1. Enter your **Cloudflare Account ID** and **Cloudflare API Token** (with *Workers:Edit* and *D1:Edit* permissions).
2. Choose your deployment target (**Worker** or **Pages**).
3. Click **Deploy to Cloudflare**. The deployer will automatically:
   - Check or create the D1 database (`nahan-db`).
   - Bundle and upload the gateway script with required bindings (`IOT_DB`, `nodejs_compat`).
   - Provide your live gateway dashboard link!

---

### Option 2: Automated 1-Click Deployer (`nahan-deployer.exe` & `deploy.py`)

#### A. Download Pre-Compiled Windows Executable (.exe)
No Python installation required! Download the standalone executable from [Releases](../../releases):
1. Download **`nahan-deployer-windows-x64.exe`**.
2. Double-click to launch or execute in Command Prompt/PowerShell:
   ```powershell
   .\nahan-deployer-windows-x64.exe
   ```

#### B. Run on Linux / macOS (Standalone Binary)
1. Download **`nahan-deployer-linux-x64`** (or **`nahan-deployer-macos`**).
2. Open your terminal, grant execution permissions, and run it:
   ```bash
   chmod +x nahan-deployer-linux-x64
   ./nahan-deployer-linux-x64
   ```

#### C. Run with Python CLI
```bash
python3 deploy.py
# Or: npm run deploy:cli
```

**Non-Interactive / CI Flags**:
```bash
# Deploy normal worker
python3 deploy.py --target worker --format normal --api-token "YOUR_TOKEN" --account-id "YOUR_ACCOUNT_ID"

# Deploy encrypted/encoded bundle to Cloudflare Pages
python3 deploy.py --target pages --format encoded --api-token "YOUR_TOKEN" --account-id "YOUR_ACCOUNT_ID"
```

---

### Option 3: Automated CI/CD via GitHub Actions

A full-featured deployment workflow is provided at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Add your Cloudflare credentials to your GitHub repository secrets (**Settings** > **Secrets and variables** > **Actions**):
   - `CLOUDFLARE_API_TOKEN` (Required)
   - `CLOUDFLARE_ACCOUNT_ID` (Required)
   - `D1_DATABASE_ID` (Optional - auto-creates and binds `nahan-db` if omitted)
   - `BOT_TOKEN` / `ADMIN_CHAT_ID` (Optional)
2. **Push or Dispatch**:
   - Pushes to `main`/`master` deploy automatically.
   - Go to **Actions** → **Deploy to Cloudflare** → **Run workflow** to choose between **Worker** vs **Pages**, and **Normal** vs **Encoded** code format.

---

### Option 4: Manual Deployment via Wrangler CLI

1. **Install Dependencies & Log In**:
   ```bash
   npm install
   npx wrangler login
   ```

2. **Create the D1 Database**:
   ```bash
   npx wrangler d1 create nahan-db
   ```
   Copy the `database_id` from the terminal output.

3. **Configure `wrangler.toml`**:
   Paste your `database_id` into `wrangler.toml`:
   ```toml
   name = "nahan-gateway"
   main = "worker.js"
   compatibility_date = "2024-03-01"
   compatibility_flags = ["nodejs_compat"]

   [[d1_databases]]
   binding = "IOT_DB"
   database_name = "nahan-db"
   database_id = "<YOUR_D1_DATABASE_ID>"
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

---

## ⚙️ Configuration & Routes

| Route | Method | Description |
|---|---|---|
| `/{apiRoute}` | `GET` | Client Subscription endpoint (auto-detects User-Agent or accepts `?flag=clash`, `sing-box`, `v2ray`) |
| `/{apiRoute}/dash` | `GET` | Web Administration Dashboard |
| `/{apiRoute}/api/auth` | `POST` | Dashboard and API authentication |
| `/{apiRoute}/api/sync` | `POST` | System configuration synchronization |
| `/{apiRoute}/api/users` | `GET/POST/PUT/DELETE` | Multi-user CRUD, traffic limits, and expiration controls |
| `/{apiRoute}/api/stats` | `GET` | Live telemetry metrics, active connections, and relay health |
| `/{apiRoute}/api/keys` | `GET/POST` | API Key management |
| `/{apiRoute}/tg` | `POST` | Telegram Bot Webhook endpoint |

---

## 🔒 Security & Best Practices

- **Master Key**: The initial default master key is `admin`. Change this immediately via the web dashboard or Telegram bot.
- **Brute-Force Shield**: IP addresses with 15 failed authorization attempts in a 15-minute window are temporarily rate-limited.
- **Camouflage Site**: Requests that do not match the secret `apiRoute` automatically proxy a clean camouflage site (default: `https://www.ubuntu.com`), ensuring stealth operation.
- **Panic Rotation**: In case of compromise, trigger the panic action to immediately randomize the secret API route and revoke active sessions.

---

## 🔐 Worker Converter (Encryption & Obfuscation)

`worker_convertor.py` allows you to bundle and encrypt/obfuscate the entire modular codebase into a single standalone file for easy deployment or code protection:

- **1-Command Bundle & Encrypt (Recommended for single-file deployment)**:
  ```bash
  python3 worker_convertor.py encode --bundle -o worker.encoded.js
  # Or: npm run encode
  ```
- **Encode Individual File**:
  ```bash
  python3 worker_convertor.py encode -i worker.js -o worker.encoded.js
  ```
- **Decode Encrypted Worker Back to Clean Code**:
  ```bash
  python3 worker_convertor.py decode -i worker.encoded.js -o worker.decoded.js
  # Or: npm run decode
  ```

### ⚡ Automated GitHub Action
A preconfigured workflow is included in [`.github/workflows/encode.yml`](.github/workflows/encode.yml):
- **Automatic Execution**: Runs whenever changes are pushed to `main` or `master`.
- **Manual Trigger**: Go to **Actions** → **Encode & Obfuscate Worker** → **Run workflow** to bundle, encode, and optionally commit `worker.encoded.js` back or download it from workflow artifacts.

---

## 📄 License

Distributed under the MIT License.
