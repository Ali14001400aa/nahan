# پروژه نهان (Nahan Gateway) نسخه `3.1.0`

> درگاه تلمتری و پروکسی با کارایی بالا، پشتیبانی هم‌زمان از پروتکل‌های VLESS و Trojan، سیستم تولید اشتراک هوشمند چند کلاینته و شبکه رله‌های خودترمیم‌شونده برای Cloudflare Workers و Pages.

[![Version](https://img.shields.io/badge/نسخه-3.1.0-blue.svg)](https://github.com/itsyebekhe/nahan)
[![License](https://img.shields.io/badge/مجوز-MIT-green.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/کلودفلر-ورکر-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

---

## 🌟 قابلیت‌های کلیدی

- **⚡ پشتیبانی همزمان از VLESS و Trojan**: ارتباط سریع مبتنی بر وب‌سوکت و سوکت‌های خام کلودفلر (`cloudflare:sockets`) با مدیریت داده‌های زودهنگام (Early Data).
- **🛡️ شبکه رله‌های خودترمیم‌شونده (Self-Healing Relays)**:
  - قرنطینه خودکار در صورت ۵ خطای متوالی (توقف موقت ۱۵ دقیقه‌ای).
  - بررسی فعال وضعیت TLS رله‌ها در پس‌زمینه با دو مرحله ارزیابی دقیق (۴ ثانیه تست سریع، ۷ ثانیه تست عمیق).
  - انتقال رله‌های قطع‌شده به قبرستان (Graveyard) و بازگردانی خودکار پس از ۳ تست سالم متوالی.
  - قرنطینه تفکیک‌شده ترافیک هوش مصنوعی: جلوگیری از مسدود شدن ترافیک سرویس‌های هوش مصنوعی (ChatGPT، Gemini، Claude) بدون اثرگذاری روی سایر ترافیک‌ها.
- **📦 موتور اشتراک هوشمند برای تمام کلاینت‌ها**:
  - خروجی آماده برای **Clash Meta / Mihomo** (فرمت‌های YAML و JSON)، **Sing-box** (JSON)، **V2Ray / Xray** (JSON) و لینک‌های خام **URI / Base64**.
  - دسته‌بندی خودکار بر اساس کشور به همراه پرچم ایموجی و سلکتور هوشمند کمترین پینگ.
  - پشتیبانی از فرگمنت ضدفیلتر (Fragmentation)، ماسک رمزنگاری TLS و ECH (Encrypted Client Hello).
- **👥 مدیریت چندکاربره و سهمیه‌بندی دقیق**:
  - محاسبه دقیق بایت‌های ارسالی و دریافتی به صورت زنده.
  - تنظیم محدودیت کل ترافیک (گیگابایت)، ترافیک روزانه و تاریخ انقضا با غیرفعال‌سازی خودکار.
- **🤖 ربات تلگرام دوزبانه (فارسی و انگلیسی)**:
  - وب‌هوک تعاملی با دکمه‌های شیشه‌ای برای مدیریت کاربران، افزایش سهمیه، مشاهده وضعیت آنلاین و تغییر کلید اضطراری.
- **🎛️ داشبورد وب و دیپلوی آنلاین**:
  - داشبورد مدیریتی وب برای نظارت بر ترافیک، اتصالات زنده و پیکربندی سیستم.
  - صفحه استقرار یک‌کلیکه در مرورگر (`index.html`) از طریق API کلودفلر با ساخت خودکار دیتابیس D1.
- **🧩 معماری کاملاً ماژولار (زیر ۱۰۰۰ خط)**:
  - تبدیل هسته ۱۱ هزار خطی قبلی به ماژول‌های مستقل و ساختاریافته که فایل اصلی ورکر زیر ۳۰۰ خط و سایر ماژول‌ها زیر ۶۵۰ خط هستند.

---

## 🏗️ ساختار معماری

```
                      ترافیک ورودی (HTTP / WebSocket)
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    worker.js    │ (۲۷۹ خط - مسیریاب و توزیع‌کننده)
                            └────────┬────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             ▼                       ▼                       ▼
     ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
     │ src/tunnel.js │       │  src/api.js   │       │  src/subs/    │
     │ VLESS و Trojan│       │ وب‌سرویس‌ها    │       │ تولید اشتراک  │
     │ سوکت وب‌سوکت  │       │ احراز هویت     │       │ کلش و سینگ‌باکس│
     └───────┬───────┘       └───────┬───────┘       └───────┬───────┘
             │                       │                       │
             ▼                       ▼                       ▼
     ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
     │ src/relays.js │       │  src/db.js    │       │ src/telegram/ │
     │ مانیتورینگ رله│       │ دیتابیس D1    │       │ ربات تلگرام   │
     │ و قرنطینه     │       │ و لاگ‌ها      │       │ دوزبانه (FA/EN│
     └───────────────┘       └───────────────┘       └───────────────┘
```

---

## 🚀 راهنمای نصب و راه‌اندازی

### روش اول: استقرار مستقیم در مرورگر (بدون نیاز به ترمینال)
فایل `index.html` را در مرورگر باز کنید:
1. شناسه اکانت کلودفلر (**Account ID**) و توکن دسترسی (**API Token**) خود را وارد کنید.
2. هدف استقرار را انتخاب کنید (**Worker** یا **Pages**).
3. دکمه **استقرار در کلودفلر (Deploy)** را بزنید. سیستم به صورت خودکار:
   - دیتابیس D1 (`nahan-db`) را ایجاد یا بررسی می‌کند.
   - ورکر را با تمام وابستگی‌ها، بایندینگ `IOT_DB` و فلگ `nodejs_compat` مستقر می‌کند.
   - لینک داشبورد فعال شما را نمایش می‌دهد!

---

### روش دوم: ابزار استقرار خودکار ۱-کلیک (`nahan-deployer.exe` و `deploy.py`)

#### الف) دانلود نسخه آماده ویندوز (.exe)
بدون نیاز به نصب پایتون! فایل اجرایی مستقل و پرتابل را از بخش [Releases](../../releases) دانلود کنید:
1. فایل **`nahan-deployer-windows-x64.exe`** را دریافت کنید.
2. با دابل‌کلیک یا از طریق PowerShell / CMD اجرا نمایید:
   ```powershell
   .\nahan-deployer-windows-x64.exe
   ```

#### ب) اجرا در لینوکس / macOS (فایل باینری مستقل)
1. فایل **`nahan-deployer-linux-x64`** (یا `nahan-deployer-macos`) را دانلود کنید.
2. ترمینال را باز کرده، دسترسی اجرا بدهید و برنامه را اجرا کنید:
   ```bash
   chmod +x nahan-deployer-linux-x64
   ./nahan-deployer-linux-x64
   ```

#### ج) اجرا از طریق سورس پایتون
```bash
python3 deploy.py
# یا: npm run deploy:cli
```

**فلگ‌های اجرای خودکار بدون پرسش (مناسب سرور و CI)**:
```bash
# استقرار ورکر معمولی
python3 deploy.py --target worker --format normal --api-token "YOUR_TOKEN" --account-id "YOUR_ACCOUNT_ID"

# استقرار نسخه رمزنگاری‌شده در Pages
python3 deploy.py --target pages --format encoded --api-token "YOUR_TOKEN" --account-id "YOUR_ACCOUNT_ID"
```

---

### روش سوم: استقرار خودکار با گیت‌هاب اکشن (GitHub Actions)

ورک‌فلو آماده در مسیر [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) قرار دارد:

1. در بخش Secrets مخزن گیت‌هاب خود مقادیر زیر را وارد کنید:
   - `CLOUDFLARE_API_TOKEN` (اجباری)
   - `CLOUDFLARE_ACCOUNT_ID` (اجباری)
   - `D1_DATABASE_ID` (اختیاری - در صورت خالی بودن دیتابیس `nahan-db` به صورت خودکار ساخته و بایند می‌شود)
2. با هر Push یا به صورت دستی از تب **Actions** گزینه **Deploy to Cloudflare** و سپس **Run workflow** را بزنید و نوع استقرار (Worker / Pages) و فرمت کد (Normal / Encoded) را انتخاب کنید.

---

### روش چهارم: نصب دستی در Cloudflare Workers با Wrangler

1. **نصب وابستگی‌ها و لاگین**:
   ```bash
   npm install
   npx wrangler login
   ```

2. **ایجاد دیتابیس D1**:
   ```bash
   npx wrangler d1 create nahan-db
   ```
   مقدار `database_id` نمایش داده‌شده را کپی کنید.

3. **ویرایش `wrangler.toml`**:
   شناسه دیتابیس را در فایل `wrangler.toml` قرار دهید:
   ```toml
   name = "nahan-gateway"
   main = "worker.js"
   compatibility_date = "2024-03-01"
   compatibility_flags = ["nodejs_compat"]

   [[d1_databases]]
   binding = "IOT_DB"
   database_name = "nahan-db"
   database_id = "شناسه_دیتابیس_شما"
   ```

4. **دیپلوی**:
   ```bash
   npm run deploy
   ```

---

### روش سوم: استقرار در Cloudflare Pages

1. ایجاد نسخه سازگار با Pages:
   ```bash
   cp worker.js _worker.js
   ```
2. استقرار پروژه:
   ```bash
   npx wrangler pages deploy . --project-name=nahan-gateway
   ```
3. در کنترل پنل کلودفلر (**Pages** > **Settings** > **Functions**):
   - فلگ سازگاری را اضافه کنید: `nodejs_compat`.
   - بایندینگ دیتابیس D1 را با نام متغیر `IOT_DB` به دیتابیس `nahan-db` متصل نمایید.

---

## ⚙️ مسیرهای اصلی سیستم (Routes)

| مسیر | متد | توضیحات |
|---|---|---|
| `/{apiRoute}` | `GET` | دریافت اشتراک کلاینت‌ها (تشخیص خودکار نرم‌افزار یا با پارامترهای `flag=clash`، `sing-box` و ...) |
| `/{apiRoute}/dash` | `GET` | داشبورد مدیریتی تحت وب |
| `/{apiRoute}/api/auth` | `POST` | احراز هویت ورود به پنل و API |
| `/{apiRoute}/api/sync` | `POST` | همگام‌سازی تنظیمات هسته |
| `/{apiRoute}/api/users` | `GET/POST/PUT/DELETE` | مدیریت کاربران، سهمیه‌ها و تاریخ انقضا |
| `/{apiRoute}/api/stats` | `GET` | آمار لحظه‌ای ترافیک، وضعیت اتصالات و سلامت رله‌ها |
| `/{apiRoute}/api/keys` | `GET/POST` | مدیریت کلیدهای دسترسی API |
| `/{apiRoute}/tg` | `POST` | وب‌هوک ربات تلگرام |

---

## 🔒 امنیت و نکات مهم

- **کلید مدیریت اولیه**: مقدار پیش‌فرض کلید اصلی `admin` است. بلافاصله پس از نصب از طریق داشبورد یا ربات آن را تغییر دهید.
- **سایت استتار (Camouflage)**: هر درخواستی که با مسیر مخفی شما تطابق نداشته باشد، به سایت استتار (مانند `ubuntu.com`) هدایت می‌شود تا هویت ورکر مخفی بماند.
- **کلید اضطراری (Panic)**: در صورت افشا شدن اطلاعات، قابلیت Panic به سرعت مسیر سرویس را به صورت تصادفی تغییر داده و کلیه سشن‌های قبلی را غیرفعال می‌کند.

---

## 🔐 اسکریپت تبدیل و رمزنگاری ورکر (Worker Converter)

اسکریپت `worker_convertor.py` به شما این امکان را می‌دهد که ساختار ماژولار جدید را به سادگی به یک فایل واحد کدگذاری‌شده/مبهم (Obfuscated) تبدیل کنید:

- **باندل و رمزنگاری با یک دستور (مناسب پیست کردن مستقیم در کلودفلر)**:
  ```bash
  python3 worker_convertor.py encode --bundle -o worker.encoded.js
  # یا: npm run encode
  ```
- **رمزنگاری یک فایل تکی**:
  ```bash
  python3 worker_convertor.py encode -i worker.js -o worker.encoded.js
  ```
- **دیکود و بازگردانی کد رمزنگاری‌شده به حالت اولیه**:
  ```bash
  python3 worker_convertor.py decode -i worker.encoded.js -o worker.decoded.js
  # یا: npm run decode
  ```

### ⚡ اکشن خودکار گیت‌هاب (GitHub Action)
فایل ورک‌فلو در مسیر [`.github/workflows/encode.yml`](.github/workflows/encode.yml) آماده شده است:
- **اجرای خودکار**: با هر پوش به برنچ‌های `main` یا `master`، به طور خودکار فایل‌ها باندل و کدگذاری می‌شوند.
- **اجرای دستی**: از تب **Actions** در مخزن گیت‌هاب، گزینه **Encode & Obfuscate Worker** و سپس **Run workflow** را بزنید تا فایل `worker.encoded.js` تولید و کامیت شود یا از طریق آرتیفکت‌های گیت‌هاب دانلود گردد.

---

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است.
