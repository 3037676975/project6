#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/www/wwwroot/project6"
BRANCH="${PROJECT6_BRANCH:-main}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Project6] $*"
}

if [ ! -d "$PROJECT_DIR" ]; then
  echo "[Project6] ERROR: project directory not found: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR"

# Baota / Git deployments can trigger Git's dubious ownership protection.
git config --global --add safe.directory "$PROJECT_DIR" >/dev/null 2>&1 || true

log "deployment started"

# The Baota Git deployment plugin normally pulls before this script runs.
# Keeping this fast-forward pull here also makes the script safe to run manually.
if [ -d .git ]; then
  log "syncing branch: $BRANCH"
  git fetch origin "$BRANCH"
  git pull --ff-only origin "$BRANCH"
fi

# Project6 vendors the complete ConardLi/garden-skills repository as a submodule.
# Initialize it on first deployment and keep it pinned to the commit recorded by Project6.
if [ -f .gitmodules ]; then
  log "initializing Garden Skills"
  git submodule sync --recursive
  git submodule update --init --recursive
fi

# Keep the standalone sync helper usable for future manual maintenance.
if [ -f scripts/sync-garden.sh ]; then
  chmod +x scripts/sync-garden.sh || true
fi

# Current V1 is a static site. Fail clearly if the site entry is missing.
if [ ! -f index.html ]; then
  echo "[Project6] ERROR: index.html not found"
  exit 1
fi

log "Garden Skills path: $PROJECT_DIR/vendor/garden-skills"
log "index page ready: $PROJECT_DIR/index.html"
log "deployment completed successfully"
