#!/usr/bin/env bash
# Optional Garden Skills synchronizer.
# This script is intentionally NOT part of the blocking Baota deployment path.
set -u

PROJECT_DIR="/www/wwwroot/project6"
export GIT_TERMINAL_PROMPT=0

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Garden] $*"
}

cd "$PROJECT_DIR" 2>/dev/null || {
  log "project directory missing"
  exit 0
}

git config --global --add safe.directory "$PROJECT_DIR" >/dev/null 2>&1 || true

if [ ! -f .gitmodules ]; then
  log "no .gitmodules found; nothing to sync"
  exit 0
fi

log "syncing submodule configuration"
git submodule sync --recursive || true

for attempt in 1 2 3; do
  log "Garden Skills update attempt $attempt/3"
  if git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=20 submodule update --init --recursive; then
    log "Garden Skills ready: $PROJECT_DIR/vendor/garden-skills"
    exit 0
  fi
  log "attempt $attempt failed"
  sleep 3
done

log "Garden Skills could not be downloaded now; main Project6 site is unaffected"
exit 0
