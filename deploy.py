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
        import urllib.request, zipfile, io, tempfile, shutil
        try:
            req = urllib.request.Request(zip_url, headers={"User-Agent": "Mozilla/5.0 (Nahan-Deployer)"})
            with urllib.request.urlopen(req, timeout=30) as resp:
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


def authenticate_cloudflare(api_token=None, account_id=None):
    """Handles Cloudflare authentication via Token, Account ID or OAuth login."""
    env_vars = {}

    # Check environment
    token = api_token or os.environ.get("CLOUDFLARE_API_TOKEN")
    acc_id = account_id or os.environ.get("CLOUDFLARE_ACCOUNT_ID")

    if token and acc_id:
        log_success("Cloudflare credentials detected via flags or environment variables.")
        env_vars["CLOUDFLARE_API_TOKEN"] = token
        env_vars["CLOUDFLARE_ACCOUNT_ID"] = acc_id
        return env_vars

    print(f"\n{BOLD}Select Cloudflare Authentication Method:{RESET}")
    print("1) Cloudflare API Token & Account ID (Recommended for CI & headless servers)")
    print("2) Browser Login via OAuth (`wrangler login`)")
    
    auth_choice = input(f"{CYAN}Enter choice (1/2) [1]: {RESET}").strip() or "1"

    if auth_choice == "2":
        log_info("Opening browser for Cloudflare login...")
        run_command("npx wrangler login")
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
            req = urllib.request.Request(
                "https://api.cloudflare.com/client/v4/accounts",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
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
    return env_vars


def setup_d1_database(env_vars, db_name=DEFAULT_D1_NAME):
    """Finds or creates the D1 database and returns its UUID."""
    log_info(f"Setting up D1 Database '{db_name}'...")

    database_id = None

    # Step 1: Check existing D1 databases via wrangler d1 list
    list_proc = run_command("npx wrangler d1 list --json", env=env_vars, capture=True, check=False)
    if list_proc.returncode == 0:
        try:
            dbs = json.loads(list_proc.stdout)
            for db in dbs:
                if db.get("name") == db_name:
                    database_id = db.get("uuid")
                    log_success(f"Found existing D1 database '{db_name}' (ID: {database_id})")
                    break
        except Exception:
            pass

    # Step 2: Create D1 database if not found
    if not database_id:
        log_info(f"Creating new D1 database '{db_name}'...")
        create_proc = run_command(f"npx wrangler d1 create {db_name}", env=env_vars, capture=True, check=False)
        output = create_proc.stdout + "\n" + create_proc.stderr
        
        match = re.search(r'database_id\s*=\s*"([0-9a-fA-F-]{36})"', output)
        if match:
            database_id = match.group(1)
            log_success(f"Created new D1 database '{db_name}' (ID: {database_id})")
        else:
            # Fallback search for any 36-char UUID
            uuid_match = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', output)
            if uuid_match:
                database_id = uuid_match.group(1)
                log_success(f"D1 database created (ID: {database_id})")
            else:
                log_warn(f"Could not extract database_id from output:\n{output}")
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
        if os.path.exists("worker_convertor.py"):
            run_command("python3 worker_convertor.py encode --bundle -o worker.encoded.js")
            log_success("Created obfuscated standalone bundle: `worker.encoded.js`")
            return "worker.encoded.js"
        else:
            log_warn("worker_convertor.py not found. Falling back to normal worker.js.")
            return "worker.js"
    else:
        log_info("Using clean modular worker architecture (`worker.js`).")
        return "worker.js"


def deploy_worker(entrypoint, env_vars):
    """Deploys as a Cloudflare Worker."""
    log_info("Deploying as Cloudflare Worker...")

    # Ensure wrangler.toml points to the correct entry point
    if os.path.exists("wrangler.toml"):
        with open("wrangler.toml", "r", encoding="utf-8") as f:
            content = f.read()
        updated = re.sub(r'main\s*=\s*"[^"]*"', f'main = "{entrypoint}"', content)
        with open("wrangler.toml", "w", encoding="utf-8") as f:
            f.write(updated)

    log_info("Executing `npx wrangler deploy`...")
    run_command("npx wrangler deploy", env=env_vars)
    log_success("Cloudflare Worker deployed successfully!")


def deploy_pages(entrypoint, env_vars, project_name=DEFAULT_PROJECT_NAME):
    """Deploys as Cloudflare Pages."""
    log_info(f"Deploying as Cloudflare Pages (Project: {project_name})...")

    dist_dir = "dist_pages"
    os.makedirs(dist_dir, exist_ok=True)

    # Copy static portal if available
    if os.path.exists("index.html"):
        shutil.copy("index.html", os.path.join(dist_dir, "index.html"))

    # Prepare _worker.js
    dest_worker = os.path.join(dist_dir, "_worker.js")
    if entrypoint == "worker.encoded.js" and os.path.exists("worker.encoded.js"):
        shutil.copy("worker.encoded.js", dest_worker)
    else:
        # Bundle into single _worker.js for Pages
        log_info("Bundling modular codebase into _worker.js for Pages...")
        run_command("npx wrangler deploy --dry-run --outdir=tmp_pages_bundle", env=env_vars)
        if os.path.exists("tmp_pages_bundle/worker.js"):
            shutil.copy("tmp_pages_bundle/worker.js", dest_worker)
            shutil.rmtree("tmp_pages_bundle", ignore_errors=True)
        else:
            shutil.copy("worker.js", dest_worker)

    log_info(f"Executing `npx wrangler pages deploy {dist_dir}`...")
    run_command(f"npx wrangler pages deploy {dist_dir} --project-name={project_name}", env=env_vars)
    log_success("Cloudflare Pages deployed successfully!")
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
    env_vars = authenticate_cloudflare(args.api_token, args.account_id)

    # Step 5: D1 Database
    if args.d1_id:
        db_id = args.d1_id
        if os.path.exists("wrangler.toml"):
            with open("wrangler.toml", "r", encoding="utf-8") as f:
                content = f.read()
            content = re.sub(r'database_id\s*=\s*"[^"]*"', f'database_id = "{db_id}"', content)
            with open("wrangler.toml", "w", encoding="utf-8") as f:
                f.write(content)
        log_success(f"Bound provided D1 Database ID: {db_id}")
    else:
        setup_d1_database(env_vars, args.d1_name)

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
        deploy_pages(entrypoint, env_vars, args.project_name)
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
