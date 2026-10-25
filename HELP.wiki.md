# Project Nahan Gateway - Technical Wiki & Operations Guide

Welcome to the comprehensive Wiki for Project Nahan Gateway `v3.1.0`. This guide covers detailed configuration, operational concepts, client client integration, anti-censorship tuning, and troubleshooting.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
   - [Clean IPs & Fronting Domains](#clean-ips--fronting-domains)
   - [Outbound Relays & Proxy IPs](#outbound-relays--proxy-ips)
   - [AI Smart Egress & `#AI` Tagging](#ai-smart-egress--ai-tagging)
   - [Parallel Nodes & Linked Panels](#parallel-nodes--linked-panels)
2. [Client Applications & Subscriptions](#2-client-applications--subscriptions)
   - [Subscription URL Formats](#subscription-url-formats)
   - [Supported Clients & Import Steps](#supported-clients--import-steps)
3. [Anti-Censorship Tuning (Fragmentation & TLS Masks)](#3-anti-censorship-tuning)
4. [Self-Healing Relay Engine Deep-Dive](#4-self-healing-relay-engine)
5. [Telegram Bot Administration](#5-telegram-bot-administration)
6. [Multi-Panel Federation](#6-multi-panel-federation)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Core Concepts

### Clean IPs & Fronting Domains
- **Clean IP (`cleanIps`)**: Cloudflare edge IP addresses or unblocked domain names used as the connection front for your clients.
- Format: `ip_or_domain[:port][#Tag]` separated by commas or line breaks.
- Example:
  ```text
  104.16.132.229#MCI, 104.18.2.14#MTN, time.is#Fallback
  ```
- If left blank, the gateway defaults to `time.is` or the worker hostname.

### Outbound Relays & Proxy IPs
- **Relay IP (`customRelay` / `backupRelay` / `user.proxyIp`)**: The remote exit node where traffic connects after passing through Cloudflare edge.
- Format: `host[:port][#Tag]`
- Example:
  ```text
  185.123.45.67:443#Frankfurt, 194.56.78.90:8443#Amsterdam#AI
  ```

### AI Smart Egress & `#AI` Tagging
- Cloudflare edge egress IPs are often blacklisted or challenged by LLM APIs (OpenAI, Anthropic, Google Gemini).
- Relays tagged with `#AI` (e.g. `1.2.3.4:443#Germany#AI`) are given highest priority whenever incoming SNI matches AI services (`openai.com`, `gemini.google.com`, `anthropic.com`, etc.).
- Normal browsing traffic continues to use load-balanced round-robin across all relays.

### Parallel Nodes & Linked Panels
- Enables a single subscription link to distribute configs across multiple edge domains.
- Configure in `linkedPanels` or `slaveNodes` to add alternate worker domains into subscriber outputs automatically.

---

## 2. Client Applications & Subscriptions

### Subscription URL Formats

| Flag | Client Type | URL Pattern |
|---|---|---|
| Auto | Auto-detected from User-Agent | `https://domain.workers.dev/{apiRoute}?sub={user}` |
| `clash` / `yaml` | Clash Meta, Mihomo, Stash | `https://domain.workers.dev/{apiRoute}?sub={user}&flag=clash` |
| `sing-box` / `sb` | Sing-box, Hiddify, Nekobox | `https://domain.workers.dev/{apiRoute}?sub={user}&flag=sing-box` |
| `vjson` | V2Ray, Xray | `https://domain.workers.dev/{apiRoute}?sub={user}&flag=vjson` |
| `base64` | V2rayNG, Streisand, Shadowrocket | `https://domain.workers.dev/{apiRoute}?sub={user}&flag=base64` |

---

## 3. Anti-Censorship Tuning

Nahan supports per-user TCP fragmentation and TLS cipher masking to bypass deep packet inspection (DPI):

1. **Fragmentation Mode (`segMode`)**:
   - `off`: Standard packets.
   - `builder`: Specify packets (`tlshello`), chunk lengths (`10-20,30-50`), and delays (`5-10,15-20`).
   - `manual`: Direct Xray fragment string or FinalMask JSON structure.
2. **TLS Mask (`tlsMask`)**:
   - Custom colon-separated cipher suite ordering (e.g., `TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384`).
3. **ECH (Encrypted Client Hello)**:
   - Encrypts the destination SNI to prevent intermediate firewalls from inspecting targeted hostnames.

---

## 4. Self-Healing Relay Engine

```
[ Active Relay ]
       │
       ▼ (5 consecutive fails)
[ Quarantined (15 min) ]
       │
       ▼ (3 failed active TLS probes)
[ Graveyard Burial ]
       │
       ▼ (Slow re-probe every 30 min)
[ 3 Consecutive Healthy Probes ]
       │
       ▼
[ Automatic Resurrection to Live List ]
```

- **Two-Stage Verdict**: Probes first attempt a 4-second TLS handshake. If it times out, a second 7-second probe confirms before marking a failure, avoiding false positives on congested networks.

---

## 5. Telegram Bot Administration

1. Create a bot using [@BotFather](https://t.me/BotFather) and obtain the `tgToken`.
2. Find your personal Telegram numerical ID via [@userinfobot](https://t.me/userinfobot) and set it as `tgAdminId`.
3. Set the webhook in the Gateway dashboard or via:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<WORKER_DOMAIN>/<API_ROUTE>/tg"
   ```
4. Start interacting with the bot in Telegram:
   - `/start` or `/menu`: Access administrative dashboard.
   - User creation, traffic reset, panic rotation, and real-time status.

---

## 6. Multi-Panel Federation

To link satellite nodes to your hub panel:
1. In the satellite worker, configure `hubPanelUrl = "https://hub-domain.workers.dev"` and `syncApiKey`.
2. In the hub worker, add the satellite URL and API key under `linkedPanels`.
3. Satellite nodes will sync user lists, traffic accounting, and update deployments automatically.

---

## 7. Troubleshooting & FAQ

#### Error: Cloudflare Error 1101 (Worker threw exception)
- **Cause**: Outbound connection hung without abort timeout.
- **Solution**: Project Nahan v3.1.0 uses strict TCP timeouts (`TCP_OPEN_TIMEOUT_MS = 5000ms`, `TCP_WRITE_TIMEOUT_MS = 5000ms`). Ensure you have updated to v3.1.0 and check that `IOT_DB` is bound.

#### Database not saving settings
- Ensure your Cloudflare D1 database is bound to the worker with the exact name `IOT_DB`.

#### Subscription shows empty list
- Verify that the subscriber's quota has not expired or exceeded total traffic. Check status via `/sync/api/users?id=<USER_ID>`.
