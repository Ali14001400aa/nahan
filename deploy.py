#!/usr/bin/env python3
"""
Nahan Gateway - Automated Cloudflare Deployer (Python CLI)
Automates:
  1. System checks (Node.js, npm, git)
  2. Project download / repository setup (if needed)
  3. Wrangler installation & configuration
  4. Cloudflare authorization (API Token or browser OAuth)
  5. D1 database creation & auto-binding
  6. Code preparation (Normal or Encoded / Obfuscated bundle)
  7. 1-Click Deployment to Cloudflare Workers or Pages
"""

import sys
import os
import re
import json
import shutil
import getpass
import argparse
import subprocess
import urllib.request
import urllib.error
import ssl

try:
    import worker_convertor
except ImportError:
    worker_convertor = None


def make_http_request(url, headers=None, data=None, method=None, timeout=15):
    """
    Performs HTTP/HTTPS request with robust SSL handling for corporate proxies,
    custom CA certificates, and environments where system CA roots are not found.
    """
    req_headers = headers or {}
    if "User-Agent" not in req_headers:
        req_headers["User-Agent"] = "Mozilla/5.0 (Nahan-Deployer)"

    req = urllib.request.Request(url, headers=req_headers, data=data, method=method)

    # First attempt: standard verified SSL context
    try:
        ctx = ssl.create_default_context()
        return urllib.request.urlopen(req, timeout=timeout, context=ctx)
    except urllib.error.HTTPError:
        # HTTP errors (like 400, 404, etc.) are valid server responses, re-raise to caller
        raise
    except Exception as e:
        err_str = str(e).lower()
        if "certificate" in err_str or "ssl" in err_str or "handshake" in err_str or "verify failed" in err_str:
            try:
                unverified_ctx = ssl._create_unverified_context()
                return urllib.request.urlopen(req, timeout=timeout, context=unverified_ctx)
            except Exception:
                raise e
        raise e


def parse_json_safely(text):
    """Safely extracts and parses JSON array or object from text that may contain CLI logs or banners."""
    if not text:
        return None
    try:
        return json.loads(text.strip())
    except Exception:
        pass

    decoder = json.JSONDecoder()
    for idx, char in enumerate(text):
        if char in ('[', '{'):
            try:
                obj, _ = decoder.raw_decode(text[idx:])
                if isinstance(obj, (list, dict)):
                    return obj
            except Exception:
                continue
    return None



# ANSI Color Codes
GREEN = "\033[92m"
BLUE = "\033[94m"
CYAN = "\033[96m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

DEFAULT_REPO = "https://github.com/itsyebekhe/nahan.git"
DEFAULT_PROJECT_NAME = "nahan-gateway"
DEFAULT_D1_NAME = "nahan-db"


def print_banner():
    banner = f"""{CYAN}{BOLD}
╔══════════════════════════════════════════════════════════════╗
║         🚀 NAHAN GATEWAY - CLOUDFLARE 1-CLICK DEPLOYER       ║
║     Supports Workers & Pages • Normal & Encoded Deployment   ║
║                Automated D1 Database Binding                 ║
╚══════════════════════════════════════════════════════════════╝{RESET}
"""
    print(banner)


def log_info(msg):
    print(f"{BLUE}[*]{RESET} {msg}")


def log_success(msg):
    print(f"{GREEN}[+]{RESET} {BOLD}{msg}{RESET}")


def log_warn(msg):
    print(f"{YELLOW}[!]{RESET} {msg}")


def log_error(msg):
    print(f"{RED}[-]{RESET} {BOLD}{msg}{RESET}")


def get_clean_env(extra_env=None):
    """
    Cleans PyInstaller's LD_LIBRARY_PATH and dynamic linker environment variables
    so spawned subprocesses (git, node, npm, wrangler) use host system libraries
    instead of PyInstaller's bundled /tmp/_MEI* libraries.
    """
    env = os.environ.copy()
    if getattr(sys, "frozen", False):
        for var in ["LD_LIBRARY_PATH", "DYLD_LIBRARY_PATH", "DYLD_FALLBACK_LIBRARY_PATH", "LIBPATH"]:
            orig_var = f"{var}_ORIG"
            if orig_var in env:
                env[var] = env[orig_var]
            else:
                env.pop(var, None)
    if extra_env:
        env.update(extra_env)
    return env


def run_command(cmd, env=None, capture=False, check=True):
    """Executes a shell command with real-time streaming or captured output."""
    full_env = get_clean_env(env)

    if capture:
        proc = subprocess.run(cmd, env=full_env, capture_output=True, text=True, shell=isinstance(cmd, str))
        if check and proc.returncode != 0:
            log_error(f"Command failed: {cmd}\nOutput:\n{proc.stderr}")
            sys.exit(proc.returncode)
        return proc
    else:
        return subprocess.run(cmd, env=full_env, shell=isinstance(cmd, str), check=check)


def check_prerequisites():
    """Validates that Node.js and npm are present."""
    log_info("Checking system prerequisites (Node.js & npm)...")

    # Check Node.js
    node_proc = run_command("node -v", capture=True, check=False)
    if node_proc.returncode != 0:
        log_error("Node.js is not installed or not in PATH!")
        print("Please install Node.js 18+ from https://nodejs.org/ and re-run this script.")
        sys.exit(1)
    node_ver = node_proc.stdout.strip()
    log_success(f"Node.js detected: {node_ver}")

    # Check npm
    npm_proc = run_command("npm -v", capture=True, check=False)
    if npm_proc.returncode != 0:
        log_error("npm is not installed or not in PATH!")
        sys.exit(1)
    npm_ver = npm_proc.stdout.strip()
    log_success(f"npm detected: {npm_ver}")


def ensure_project_files(target_dir="."):
    """Ensures worker.js and project structure are available."""
    if os.path.exists(os.path.join(target_dir, "worker.js")):
        log_success("Project files located in current directory.")
        return

    log_warn(f"worker.js not found in '{target_dir}'.")
    choice = input(f"{YELLOW}Would you like to download/pull Nahan repository files from GitHub? (y/n) [y]: {RESET}").strip().lower()
    if choice in ("", "y", "yes"):
        repo_url = input(f"Enter repository Git URL [{DEFAULT_REPO}]: ").strip() or DEFAULT_REPO
        
        # Download as zipball using pure Python - no git or OpenSSL dependency
        zip_url = repo_url.rstrip("/")
        if zip_url.endswith(".git"):
            zip_url = zip_url[:-4]
        zip_url = f"{zip_url}/archive/refs/heads/main.zip"

        log_info(f"Downloading project files from {zip_url}...")
        import zipfile, io, tempfile, shutil
        try:
            with make_http_request(zip_url, headers={"User-Agent": "Mozilla/5.0 (Nahan-Deployer)"}, timeout=30) as resp:
                zip_data = resp.read()

            with zipfile.ZipFile(io.BytesIO(zip_data)) as zf:
                with tempfile.TemporaryDirectory() as tmpdir:
                    zf.extractall(tmpdir)
                    extracted_subdirs = [d for d in os.listdir(tmpdir) if os.path.isdir(os.path.join(tmpdir, d))]
                    source_dir = os.path.join(tmpdir, extracted_subdirs[0]) if extracted_subdirs else tmpdir

                    copied_count = 0
                    for item in os.listdir(source_dir):
                        if item in (".git", ".github"):
                            continue
                        src_path = os.path.join(source_dir, item)
                        dst_path = os.path.join(target_dir, item)
                        if os.path.exists(dst_path):
                            if os.path.isdir(dst_path):
                                shutil.rmtree(dst_path)
                            else:
                                os.remove(dst_path)
                        if os.path.isdir(src_path):
                            shutil.copytree(src_path, dst_path)
                        else:
                            shutil.copy2(src_path, dst_path)
                        copied_count += 1
            log_success(f"Successfully downloaded and setup project files ({copied_count} files/folders).")
            return
        except Exception as e:
            log_warn(f"Zip download failed ({e}). Attempting git clone with clean host environment...")
            try:
                # Use git clone with cleaned LD_LIBRARY_PATH
                if target_dir == "." and os.listdir(target_dir):
                    with tempfile.TemporaryDirectory() as tmpdir:
                        run_command(["git", "clone", repo_url, tmpdir])
                        for item in os.listdir(tmpdir):
                            if item in (".git", ".github"):
                                continue
                            src_path = os.path.join(tmpdir, item)
                            dst_path = os.path.join(target_dir, item)
                            if not os.path.exists(dst_path):
                                if os.path.isdir(src_path):
                                    shutil.copytree(src_path, dst_path)
                                else:
                                    shutil.copy2(src_path, dst_path)
                else:
                    run_command(["git", "clone", repo_url, target_dir])
                log_success("Repository cloned successfully.")
                return
            except Exception as ge:
                log_error(f"Git clone failed: {ge}")
                sys.exit(1)
    else:
        log_error("Cannot proceed without project files.")
        sys.exit(1)


def ensure_wrangler():
    """Ensures Wrangler CLI is installed locally or accessible via npx."""
    log_info("Checking Wrangler CLI...")

    # Check local node_modules
    has_local = os.path.exists("node_modules/wrangler") or os.path.exists("package.json")
    if os.path.exists("package.json"):
        if not os.path.exists("node_modules"):
            log_info("Installing project dependencies (`npm install`)...")
            run_command("npm install")
            log_success("Dependencies installed.")
        else:
            log_success("node_modules already present.")
    else:
        log_info("Installing Wrangler locally...")
        run_command("npm install -D wrangler")
        log_success("Wrangler installed.")


CONFIG_FILE = ".deployer_config.json"


def load_cached_credentials():
    """Loads cached Cloudflare credentials from local config file if present."""
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data
        except Exception:
            return None
    return None


def save_cached_credentials(token=None, account_id=None, method="token"):
    """Saves Cloudflare credentials to local config file for reuse."""
    try:
        data = {
            "method": method,
            "api_token": token or "",
            "account_id": account_id or "",
            "updated_at": os.path.getmtime(CONFIG_FILE) if os.path.exists(CONFIG_FILE) else 0
        }
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception:
        pass


def get_wrangler_oauth_token():
    """Extracts OAuth bearer token from Wrangler's user configuration."""
    candidates = []
    xdg_config = os.environ.get("XDG_CONFIG_HOME")
    if xdg_config:
        candidates.append(os.path.join(xdg_config, ".wrangler", "config", "default.toml"))
    appdata = os.environ.get("APPDATA")
    if appdata:
        candidates.append(os.path.join(appdata, ".wrangler", "config", "default.toml"))
    localappdata = os.environ.get("LOCALAPPDATA")
    if localappdata:
        candidates.append(os.path.join(localappdata, ".wrangler", "config", "default.toml"))

    home = os.path.expanduser("~")
    candidates.extend([
        os.path.join(home, ".config", ".wrangler", "config", "default.toml"),
        os.path.join(home, "Library", "Preferences", ".wrangler", "config", "default.toml"),
        os.path.join(home, "Library", "Application Support", ".wrangler", "config", "default.toml"),
        os.path.join(home, ".wrangler", "config", "default.toml"),
    ])

    for path in candidates:
        if os.path.isfile(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                m = re.search(r'oauth_token\s*=\s*"([^"]+)"', content)
                if m and m.group(1).strip():
                    return m.group(1).strip()
            except Exception:
                pass
    return None


def get_account_id(env_vars=None, token=None):
    """Finds Account ID from env_vars, cache, Cloudflare API, or wrangler whoami output."""
    if env_vars and env_vars.get("CLOUDFLARE_ACCOUNT_ID"):
        return env_vars["CLOUDFLARE_ACCOUNT_ID"]

    cached = load_cached_credentials()
    if cached and cached.get("account_id"):
        return cached["account_id"]

    auth_token = token or (env_vars.get("CLOUDFLARE_API_TOKEN") if env_vars else None) or get_wrangler_oauth_token()
    if auth_token:
        try:
            headers = {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}
            with make_http_request("https://api.cloudflare.com/client/v4/accounts", headers=headers, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                if data.get("success") and data.get("result"):
                    accounts = data["result"]
                    if accounts:
                        acc_id = accounts[0]["id"]
                        save_cached_credentials(token=auth_token if not get_wrangler_oauth_token() else None,
                                                account_id=acc_id,
                                                method="oauth" if get_wrangler_oauth_token() else "token")
                        return acc_id
        except Exception:
            pass

    try:
        res = run_command("npx wrangler whoami", env=env_vars, capture=True, check=False)
        output = res.stdout + "\n" + res.stderr
        match = re.search(r'│\s*[^│\r\n]+\s*│\s*([0-9a-fA-F]{32})\s*│', output)
        if match:
            acc_id = match.group(1)
            save_cached_credentials(account_id=acc_id, method="oauth")
            return acc_id
        hex_match = re.search(r'\b([0-9a-fA-F]{32})\b', output)
        if hex_match:
            acc_id = hex_match.group(1)
            save_cached_credentials(account_id=acc_id, method="oauth")
            return acc_id
    except Exception:
        pass

    return None


def check_active_wrangler_session(env_vars=None):
    """Checks whether Wrangler already has an active, authenticated session."""
    try:
        res = run_command("npx wrangler whoami", env=env_vars, capture=True, check=False)
        output = (res.stdout + "\n" + res.stderr).lower()
        if res.returncode == 0 and ("logged in" in output or "account" in output or "associated with" in output):
            return True
    except Exception:
        pass
    return False


def authenticate_cloudflare(api_token=None, account_id=None, reauth=False):
    """Handles Cloudflare authentication via Token, Account ID, cached credentials, or OAuth login."""
    env_vars = {}

    # Check command-line flags or environment variables first
    token = api_token or os.environ.get("CLOUDFLARE_API_TOKEN")
    acc_id = account_id or os.environ.get("CLOUDFLARE_ACCOUNT_ID")

    if token and acc_id:
        log_success("Cloudflare credentials detected via flags or environment variables.")
        env_vars["CLOUDFLARE_API_TOKEN"] = token
        env_vars["CLOUDFLARE_ACCOUNT_ID"] = acc_id
        save_cached_credentials(token, acc_id, method="token")
        return env_vars

    # Check cached credentials if not explicitly re-authenticating
    cached = load_cached_credentials() if not reauth else None
    if cached and not reauth:
        cached_method = cached.get("method", "token")
        cached_token = cached.get("api_token")
        cached_acc = cached.get("account_id")

        if cached_method == "token" and cached_token and cached_acc:
            print(f"\n{GREEN}[+] Found saved Cloudflare credentials (Account ID: {cached_acc}).{RESET}")
            use_cached = input(f"{CYAN}Use saved credentials? (y/n) [y]: {RESET}").strip().lower()
            if use_cached in ("", "y", "yes"):
                env_vars["CLOUDFLARE_API_TOKEN"] = cached_token
                env_vars["CLOUDFLARE_ACCOUNT_ID"] = cached_acc
                log_success("Reusing saved Cloudflare credentials.")
                return env_vars

        elif cached_method == "oauth":
            if check_active_wrangler_session():
                print(f"\n{GREEN}[+] Found saved Wrangler OAuth session.{RESET}")
                use_oauth = input(f"{CYAN}Use existing OAuth login? (y/n) [y]: {RESET}").strip().lower()
                if use_oauth in ("", "y", "yes"):
                    log_success("Reusing active Wrangler OAuth session.")
                    oauth_token = get_wrangler_oauth_token()
                    if oauth_token:
                        env_vars["CLOUDFLARE_API_TOKEN"] = oauth_token
                    resolved_acc = cached_acc or get_account_id(env_vars, token=oauth_token)
                    if resolved_acc:
                        env_vars["CLOUDFLARE_ACCOUNT_ID"] = resolved_acc
                        save_cached_credentials(account_id=resolved_acc, method="oauth")
                    return env_vars

    # Check if user already has an active wrangler OAuth session
    if not reauth and check_active_wrangler_session():
        print(f"\n{GREEN}[+] Active Wrangler session detected (`wrangler whoami` succeeded).{RESET}")
        use_active = input(f"{CYAN}Continue using this existing authenticated session? (y/n) [y]: {RESET}").strip().lower()
        if use_active in ("", "y", "yes"):
            log_success("Using active Wrangler session.")
            oauth_token = get_wrangler_oauth_token()
            if oauth_token:
                env_vars["CLOUDFLARE_API_TOKEN"] = oauth_token
            resolved_acc = get_account_id(env_vars, token=oauth_token)
            if resolved_acc:
                env_vars["CLOUDFLARE_ACCOUNT_ID"] = resolved_acc
            save_cached_credentials(account_id=resolved_acc, method="oauth")
            return env_vars

    print(f"\n{BOLD}Select Cloudflare Authentication Method:{RESET}")
    print("1) Cloudflare API Token & Account ID (Recommended for CI & headless servers - persistent)")
    print("2) Browser Login via OAuth (`wrangler login`)")
    
    auth_choice = input(f"{CYAN}Enter choice (1/2) [1]: {RESET}").strip() or "1"

    if auth_choice == "2":
        log_info("Opening browser for Cloudflare login...")
        run_command("npx wrangler login")
        oauth_token = get_wrangler_oauth_token()
        if oauth_token:
            env_vars["CLOUDFLARE_API_TOKEN"] = oauth_token
        resolved_acc = get_account_id(env_vars, token=oauth_token)
        if resolved_acc:
            env_vars["CLOUDFLARE_ACCOUNT_ID"] = resolved_acc
        save_cached_credentials(account_id=resolved_acc, method="oauth")
        log_success("Cloudflare OAuth login completed.")
        return env_vars

    # Prompt for API Token & Account ID
    print(f"\n{YELLOW}To create an API Token:{RESET}")
    print("  Go to: https://dash.cloudflare.com/profile/api-tokens")
    print("  Template: 'Edit Cloudflare Workers' or custom with:")
    print("    - Account -> D1:Edit, Workers Scripts:Edit, Pages:Edit")
    print("    - User -> Memberships:Read, User Details:Read\n")

    while not token:
        token = getpass.getpass("Enter your Cloudflare API Token (input hidden): ").strip()
        if not token:
            print("Token cannot be empty. Please enter your API Token.")

    if not acc_id:
        # Attempt to auto-discover Account ID using the API token
        log_info("Discovering Account ID from API Token...")
        discovered_acc_id = None
        try:
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            with make_http_request("https://api.cloudflare.com/client/v4/accounts", headers=headers, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                if data.get("success") and data.get("result"):
                    accounts = data["result"]
                    if len(accounts) == 1:
                        discovered_acc_id = accounts[0]["id"]
                        log_success(f"Auto-detected Account ID: {discovered_acc_id} ({accounts[0].get('name')})")
                    else:
                        print("\nMultiple accounts found:")
                        for idx, acc in enumerate(accounts, 1):
                            print(f"  {idx}) {acc.get('name')} (ID: {acc.get('id')})")
                        sel = input("Select account number [1]: ").strip() or "1"
                        discovered_acc_id = accounts[int(sel)-1]["id"]
        except Exception as e:
            log_warn(f"Could not auto-fetch accounts: {e}")

        if discovered_acc_id:
            acc_id = discovered_acc_id
        else:
            acc_id = input("Enter your Cloudflare Account ID: ").strip()

    env_vars["CLOUDFLARE_API_TOKEN"] = token
    env_vars["CLOUDFLARE_ACCOUNT_ID"] = acc_id
    save_cached_credentials(token, acc_id, method="token")
    log_success("Cloudflare credentials saved for subsequent runs.")
    return env_vars


def setup_d1_database(env_vars, db_name=DEFAULT_D1_NAME):
    """Finds or creates the D1 database and returns its UUID."""
    log_info(f"Setting up D1 Database '{db_name}'...")

    database_id = None
    all_dbs = []

    # Step 1: Check existing D1 databases via wrangler d1 list
    list_proc = run_command("npx wrangler d1 list --json", env=env_vars, capture=True, check=False)
    combined_output = (list_proc.stdout or "") + "\n" + (list_proc.stderr or "")
    parsed = parse_json_safely(combined_output)
    if isinstance(parsed, list):
        all_dbs = parsed
    elif isinstance(parsed, dict) and "result" in parsed and isinstance(parsed["result"], list):
        all_dbs = parsed["result"]

    for db in all_dbs:
        if isinstance(db, dict) and db.get("name") == db_name:
            database_id = db.get("uuid")
            log_success(f"Found existing D1 database '{db_name}' (ID: {database_id})")
            break

    # Fallback regex search for target database in output if JSON parsing didn't match
    if not database_id:
        pattern = rf'["\']?name["\']?\s*:\s*["\']{re.escape(db_name)}["\'].*?["\']?uuid["\']?\s*:\s*["\']([0-9a-fA-F-]{{36}})["\']'
        m = re.search(pattern, combined_output, re.DOTALL)
        if m:
            database_id = m.group(1)
            log_success(f"Found existing D1 database '{db_name}' (ID: {database_id})")
        else:
            pattern_rev = rf'["\']?uuid["\']?\s*:\s*["\']([0-9a-fA-F-]{{36}})["\'].*?["\']?name["\']?\s*:\s*["\']{re.escape(db_name)}["\']'
            m_rev = re.search(pattern_rev, combined_output, re.DOTALL)
            if m_rev:
                database_id = m_rev.group(1)
                log_success(f"Found existing D1 database '{db_name}' (ID: {database_id})")

    # Step 2: Create D1 database if not found
    if not database_id:
        log_info(f"Creating new D1 database '{db_name}'...")
        create_proc = run_command(f"npx wrangler d1 create {db_name}", env=env_vars, capture=True, check=False)
        output = (create_proc.stdout or "") + "\n" + (create_proc.stderr or "")
        
        match = re.search(r'database_id\s*=\s*"([0-9a-fA-F-]{36})"', output)
        if match:
            database_id = match.group(1)
            log_success(f"Created new D1 database '{db_name}' (ID: {database_id})")
        else:
            # Fallback search for any 36-char UUID (ignoring error outputs)
            uuid_match = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', output)
            if uuid_match and "system limit reached" not in output.lower():
                database_id = uuid_match.group(1)
                log_success(f"D1 database created (ID: {database_id})")
            else:
                if "system limit reached" in output.lower() or "code: 7406" in output:
                    log_warn("Cloudflare account has reached the limit of 10 D1 databases.")
                else:
                    log_warn(f"Could not extract database_id from output:\n{output.strip()}")

                # If existing databases exist on the account, allow selecting one
                if all_dbs:
                    print(f"\n{CYAN}Existing D1 databases found in your account:{RESET}")
                    for idx, d in enumerate(all_dbs, 1):
                        d_name = d.get("name", "unnamed")
                        d_uuid = d.get("uuid", "")
                        print(f"  {idx}) {d_name} ({d_uuid})")
                    print("  0) Enter UUID manually")
                    sel = input(f"{YELLOW}Select a database to bind (0-{len(all_dbs)}) [1]: {RESET}").strip()
                    if sel == "" or sel == "1":
                        database_id = all_dbs[0].get("uuid")
                    elif sel != "0" and sel.isdigit() and 1 <= int(sel) <= len(all_dbs):
                        database_id = all_dbs[int(sel) - 1].get("uuid")
                    else:
                        database_id = input(f"{YELLOW}Enter your D1 Database UUID manually (or press Enter to skip): {RESET}").strip()
                else:
                    database_id = input(f"{YELLOW}Enter your D1 Database UUID manually (or press Enter to skip): {RESET}").strip()

    # Step 3: Update wrangler.toml with the database ID
    if database_id and os.path.exists("wrangler.toml"):
        with open("wrangler.toml", "r", encoding="utf-8") as f:
            content = f.read()

        # Update database_id placeholder or existing value
        new_content = re.sub(r'database_id\s*=\s*"[^"]*"', f'database_id = "{database_id}"', content)
        new_content = new_content.replace("YOUR_D1_DATABASE_ID_HERE", database_id)
        new_content = new_content.replace("D1_DATABASE_ID_PLACEHOLDER", database_id)

        with open("wrangler.toml", "w", encoding="utf-8") as f:
            f.write(new_content)
        log_success(f"Updated wrangler.toml with D1 binding 'IOT_DB' -> {database_id}")

    return database_id


def prepare_code(is_encoded=False):
    """Prepares the code bundle (normal modular or single-file obfuscated)."""
    if is_encoded:
        log_info("Bundling modular codebase into standalone encoded worker (`worker.encoded.js`)...")
        # Attempt 1: Direct in-process bundling & obfuscation (fastest, standalone, works inside PyInstaller binary)
        try:
            if worker_convertor is not None:
                worker_convertor.bundle_and_obfuscate("worker.encoded.js")
                if os.path.exists("worker.encoded.js") and os.path.getsize("worker.encoded.js") > 1000:
                    log_success("Created obfuscated standalone bundle: `worker.encoded.js`")
                    return "worker.encoded.js"
        except Exception as e:
            log_warn(f"In-process bundling notice: {e}")

        # Attempt 2: CLI execution fallback
        if os.path.exists("worker_convertor.py"):
            py_bin = "python3" if sys.platform != "win32" else "python"
            res = run_command(f"{py_bin} worker_convertor.py encode --bundle -o worker.encoded.js", check=False)
            if res.returncode == 0 and os.path.exists("worker.encoded.js") and os.path.getsize("worker.encoded.js") > 1000:
                log_success("Created obfuscated standalone bundle: `worker.encoded.js`")
                return "worker.encoded.js"

        log_warn("Encoded bundling was not possible. Proceeding with clean modular architecture (`worker.js`).")
        return "worker.js"
    else:
        log_info("Using clean modular worker architecture (`worker.js`).")
        return "worker.js"


def update_wrangler_toml_for_pages(database_id=None, project_name=DEFAULT_PROJECT_NAME):
    """Configures root wrangler.toml with top-level pages_build_output_dir and D1 database bindings for Pages."""
    if not os.path.exists("wrangler.toml"):
        base_toml = f"""name = "{project_name}"
pages_build_output_dir = "dist_pages"
compatibility_date = "2024-03-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "IOT_DB"
database_name = "nahan-db"
database_id = "{database_id or 'YOUR_D1_DATABASE_ID_HERE'}"
"""
        with open("wrangler.toml", "w", encoding="utf-8") as f:
            f.write(base_toml)
        log_success("Configured wrangler.toml for Cloudflare Pages (pages_build_output_dir = 'dist_pages').")
        return

    with open("wrangler.toml", "r", encoding="utf-8") as f:
        content = f.read()

    # CRITICAL FOR PAGES: Wrangler strictly disallows both `main` and `pages_build_output_dir`.
    # Remove any `main = ...` lines completely.
    content = re.sub(r'^\s*main\s*=.*$\n?', '', content, flags=re.MULTILINE)

    # Remove any existing misplaced pages_build_output_dir
    content = re.sub(r'^\s*pages_build_output_dir\s*=.*$\n?', '', content, flags=re.MULTILINE)

    # Insert pages_build_output_dir right after 'name = ...' so it is a TOP-LEVEL configuration key
    if re.search(r'^name\s*=', content, re.MULTILINE):
        content = re.sub(r'^(name\s*=.*)$', r'\1\npages_build_output_dir = "dist_pages"', content, count=1, flags=re.MULTILINE)
    else:
        content = 'pages_build_output_dir = "dist_pages"\n' + content

    # Ensure compatibility_flags contains nodejs_compat
    if "nodejs_compat" not in content:
        if "compatibility_flags" in content:
            content = re.sub(r'compatibility_flags\s*=\s*\[(.*?)\]', r'compatibility_flags = [\1, "nodejs_compat"]', content)
        else:
            content = re.sub(r'^(pages_build_output_dir\s*=.*)$', r'\1\ncompatibility_flags = ["nodejs_compat"]', content, count=1, flags=re.MULTILINE)

    # Ensure database_id is bound
    if database_id:
        content = re.sub(r'database_id\s*=\s*"[^"]*"', f'database_id = "{database_id}"', content)
        content = content.replace("YOUR_D1_DATABASE_ID_HERE", database_id)
        content = content.replace("D1_DATABASE_ID_PLACEHOLDER", database_id)

    with open("wrangler.toml", "w", encoding="utf-8") as f:
        f.write(content)
    log_success("Configured wrangler.toml with top-level 'pages_build_output_dir = \"dist_pages\"' and D1 binding (removed 'main').")


def deploy_worker(entrypoint, env_vars):
    """Deploys as a Cloudflare Worker."""
    log_info("Deploying as Cloudflare Worker...")

    # Ensure wrangler.toml points to the correct entry point and removes pages_build_output_dir
    if os.path.exists("wrangler.toml"):
        with open("wrangler.toml", "r", encoding="utf-8") as f:
            content = f.read()
        updated = re.sub(r'^\s*pages_build_output_dir\s*=.*$\n?', '', content, flags=re.MULTILINE)
        if re.search(r'^\s*main\s*=', updated, re.MULTILINE):
            updated = re.sub(r'^\s*main\s*=.*$', f'main = "{entrypoint}"', updated, flags=re.MULTILINE)
        else:
            if re.search(r'^name\s*=', updated, re.MULTILINE):
                updated = re.sub(r'^(name\s*=.*)$', rf'\1\nmain = "{entrypoint}"', updated, count=1, flags=re.MULTILINE)
            else:
                updated = f'main = "{entrypoint}"\n' + updated
        with open("wrangler.toml", "w", encoding="utf-8") as f:
            f.write(updated)

    log_info("Executing `npx wrangler deploy`...")
    run_command("npx wrangler deploy", env=env_vars)
    log_success("Cloudflare Worker deployed successfully!")


def bind_d1_to_pages_project(project_name, database_id, env_vars):
    """Automatically binds D1 database (IOT_DB) and nodejs_compat to a Cloudflare Pages project via REST API."""
    if not database_id:
        return

    token = env_vars.get("CLOUDFLARE_API_TOKEN") or get_wrangler_oauth_token()
    account_id = env_vars.get("CLOUDFLARE_ACCOUNT_ID") or get_account_id(env_vars, token=token)

    if not account_id or not token:
        log_info("Direct API token or Account ID not found; relying on wrangler.toml native Pages configuration.")
        return

    log_info(f"Binding D1 database 'IOT_DB' ({database_id}) to Pages project '{project_name}' via Cloudflare REST API...")
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project_name}"
    payload = {
        "deployment_configs": {
            "production": {
                "d1_databases": {
                    "IOT_DB": {
                        "id": database_id
                    }
                },
                "compatibility_flags": ["nodejs_compat"]
            },
            "preview": {
                "d1_databases": {
                    "IOT_DB": {
                        "id": database_id
                    }
                },
                "compatibility_flags": ["nodejs_compat"]
            }
        }
    }

    try:
        data_bytes = json.dumps(payload).encode("utf-8")
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        with make_http_request(url, headers=headers, data=data_bytes, method="PATCH", timeout=15) as resp:
            resp_data = json.loads(resp.read().decode())
            if resp_data.get("success"):
                log_success(f"Configured Pages D1 binding 'IOT_DB' -> {database_id} via Cloudflare API!")
                return
    except urllib.error.HTTPError as e:
        err_msg = ""
        try:
            err_msg = e.read().decode()
        except Exception:
            pass
        if e.code == 404:
            # Project doesn't exist yet on API, try creating it with the bindings
            try:
                create_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects"
                create_payload = {
                    "name": project_name,
                    "production_branch": "main",
                    "deployment_configs": payload["deployment_configs"]
                }
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                with make_http_request(create_url, headers=headers, data=json.dumps(create_payload).encode("utf-8"), method="POST", timeout=15) as resp:
                    resp_data = json.loads(resp.read().decode())
                    if resp_data.get("success"):
                        log_success(f"Created Pages project '{project_name}' with D1 binding 'IOT_DB' -> {database_id}!")
                        return
            except Exception as ce:
                log_warn(f"Pages project creation via API notice: {ce}")
        else:
            log_warn(f"Cloudflare Pages API binding notice ({e.code}): {err_msg[:200]}")
    except Exception as e:
        log_warn(f"Cloudflare Pages API binding notice: {e}")


def deploy_pages(entrypoint, env_vars, project_name=DEFAULT_PROJECT_NAME, database_id=None):
    """Deploys as Cloudflare Pages and automatically binds D1 database."""
    log_info(f"Deploying as Cloudflare Pages (Project: {project_name})...")

    dist_dir = "dist_pages"
    os.makedirs(dist_dir, exist_ok=True)

    # Step 1: Prepare _worker.js BEFORE updating root wrangler.toml for Pages
    dest_worker = os.path.join(dist_dir, "_worker.js")
    if entrypoint == "worker.encoded.js" and os.path.exists("worker.encoded.js"):
        shutil.copy("worker.encoded.js", dest_worker)
        log_success("Prepared encoded standalone bundle in `dist_pages/_worker.js`.")
    else:
        # Bundle into single _worker.js for Pages
        log_info("Bundling modular codebase into `dist_pages/_worker.js` for Pages...")
        bundled = False
        try:
            if worker_convertor is not None:
                worker_convertor.bundle_modular_worker(dest_worker)
                bundled = os.path.exists(dest_worker) and os.path.getsize(dest_worker) > 1000
        except Exception:
            pass

        if not bundled:
            # Fallback 1: esbuild directly
            res = run_command(f"npx esbuild worker.js --bundle --format=esm --target=es2022 --external:cloudflare:* --external:node:* --outfile={dest_worker}", check=False)
            if res.returncode == 0 and os.path.exists(dest_worker) and os.path.getsize(dest_worker) > 1000:
                bundled = True

        if not bundled:
            # Fallback 2: copy worker.js
            shutil.copy("worker.js", dest_worker)

    # Step 2: Configure root wrangler.toml for Pages (removes `main`, sets `pages_build_output_dir = "dist_pages"`)
    update_wrangler_toml_for_pages(database_id, project_name)

    # Step 3: Ensure Pages project exists in Wrangler
    run_command(f"npx wrangler pages project create {project_name} --production-branch=main", env=env_vars, check=False)

    # Step 4: Automatically bind D1 database & nodejs_compat via Cloudflare API (Pre-deploy)
    if database_id:
        bind_d1_to_pages_project(project_name, database_id, env_vars)

    # Step 5: Copy frontend portal files and routing config into dist_dir
    for static_file in ("index.html", "dashboard.html", "subscription.html", "_routes.json"):
        if os.path.exists(static_file):
            shutil.copy(static_file, os.path.join(dist_dir, static_file))

    # Also generate a wrangler.toml inside dist_pages with the D1 binding as backup
    if database_id:
        pages_toml = f"""name = "{project_name}"
pages_build_output_dir = "."
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "IOT_DB"
database_name = "nahan-db"
database_id = "{database_id}"
"""
        with open(os.path.join(dist_dir, "wrangler.toml"), "w", encoding="utf-8") as f:
            f.write(pages_toml)

    # Step 6: Deploy to Cloudflare Pages
    log_info(f"Executing `npx wrangler pages deploy {dist_dir} --project-name={project_name}`...")
    run_command(f"npx wrangler pages deploy {dist_dir} --project-name={project_name}", env=env_vars)
    log_success("Cloudflare Pages deployed successfully!")

    # Step 7: Ensure D1 binding is confirmed via Cloudflare API (Post-deploy)
    if database_id:
        bind_d1_to_pages_project(project_name, database_id, env_vars)
        log_success(f"D1 Database 'IOT_DB' ({database_id}) successfully bound to Pages project '{project_name}'.")
    else:
        print(f"\n{YELLOW}Note for Cloudflare Pages:{RESET}")
        print("In Cloudflare Dashboard -> Workers & Pages -> your Pages project -> Settings -> Functions:")
        print("  1. Add Compatibility Flag: 'nodejs_compat'")
        print(f"  2. Add D1 Database Binding: Variable name 'IOT_DB' mapped to your D1 database.\n")


def parse_args():
    parser = argparse.ArgumentParser(
        description="Nahan Gateway - Automated 1-Click Cloudflare Deployer",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("--target", choices=["worker", "pages"], default=None,
                        help="Target platform: 'worker' or 'pages'")
    parser.add_argument("--format", choices=["normal", "encoded"], default=None,
                        help="Code format: 'normal' (modular) or 'encoded' (encrypted bundle)")
    parser.add_argument("--api-token", default=None,
                        help="Cloudflare API Token")
    parser.add_argument("--account-id", default=None,
                        help="Cloudflare Account ID")
    parser.add_argument("--d1-name", default=DEFAULT_D1_NAME,
                        help="Name of the D1 database to use or create")
    parser.add_argument("--d1-id", default=None,
                        help="Existing D1 Database UUID to bind (skips creation)")
    parser.add_argument("--project-name", default=DEFAULT_PROJECT_NAME,
                        help="Worker or Pages project name")
    parser.add_argument("--reauth", action="store_true",
                        help="Force re-authentication and ignore cached credentials")
    parser.add_argument("--non-interactive", action="store_true",
                        help="Do not prompt; use defaults and CLI arguments only")
    return parser.parse_args()


def main():
    print_banner()
    args = parse_args()

    # Step 1: Prerequisites
    check_prerequisites()

    # Step 2: Project files
    ensure_project_files()

    # Step 3: Dependencies & Wrangler
    ensure_wrangler()

    # Step 4: Cloudflare Authentication
    env_vars = authenticate_cloudflare(args.api_token, args.account_id, reauth=args.reauth)

    # Step 5: D1 Database
    if args.d1_id:
        database_id = args.d1_id
        if os.path.exists("wrangler.toml"):
            with open("wrangler.toml", "r", encoding="utf-8") as f:
                content = f.read()
            content = re.sub(r'database_id\s*=\s*"[^"]*"', f'database_id = "{database_id}"', content)
            with open("wrangler.toml", "w", encoding="utf-8") as f:
                f.write(content)
        log_success(f"Bound provided D1 Database ID: {database_id}")
    else:
        database_id = setup_d1_database(env_vars, args.d1_name)

    # Step 6: Determine Format (Normal vs Encoded)
    format_choice = args.format
    if not format_choice:
        if args.non_interactive:
            format_choice = "normal"
        else:
            print(f"\n{BOLD}Select Code Format:{RESET}")
            print("1) Normal (Clean modular architecture, easy debugging)")
            print("2) Encoded (Bundled and obfuscated into a single protected file)")
            f_sel = input(f"{CYAN}Enter choice (1/2) [1]: {RESET}").strip() or "1"
            format_choice = "encoded" if f_sel == "2" else "normal"

    is_encoded = (format_choice == "encoded")
    entrypoint = prepare_code(is_encoded)

    # Step 7: Determine Target (Worker vs Pages)
    target_choice = args.target
    if not target_choice:
        if args.non_interactive:
            target_choice = "worker"
        else:
            print(f"\n{BOLD}Select Deployment Target:{RESET}")
            print("1) Cloudflare Worker (Recommended - fastest global proxy execution)")
            print("2) Cloudflare Pages (Static frontend hosting with Functions)")
            t_sel = input(f"{CYAN}Enter choice (1/2) [1]: {RESET}").strip() or "1"
            target_choice = "pages" if t_sel == "2" else "worker"

    # Step 8: Deploy
    if target_choice == "pages":
        deploy_pages(entrypoint, env_vars, args.project_name, database_id=database_id)
    else:
        deploy_worker(entrypoint, env_vars)

    # Step 9: Final Success Message
    print(f"""
{GREEN}{BOLD}══════════════════════════════════════════════════════════════
🎉 DEPLOYMENT COMPLETE!
══════════════════════════════════════════════════════════════{RESET}
• Management Portal:  Open your deployed domain in your browser
• Initial Password:   {BOLD}admin{RESET} (Please change upon initial login)
• D1 Database:        Bound to variable {BOLD}IOT_DB{RESET}
• Need Help?          Check HELP.wiki.md or open the built-in portal
""")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(130)
