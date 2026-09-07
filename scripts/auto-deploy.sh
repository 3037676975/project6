#!/usr/bin/env bash
# Project6 post-pull hook for Baota Git auto deployment.
# IMPORTANT: keep this hook fast. Baota already runs git pull before this script.
# Garden Skills sync is launched in background so network latency can never block website deployment.

PROJECT_DIR="/www/wwwroot/project6"
GARDEN_LOG="/tmp/project6-garden-sync.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Project6] $*"
}

# The site directory must exist because Baota has just pulled into it.
if [ ! -d "$PROJECT_DIR" ]; then
  echo "[Project6] WARNING: project directory not found: $PROJECT_DIR"
  # Do not make Baota show a red deployment just because the optional hook cannot run.
  exit 0
fi

cd "$PROJECT_DIR" 2>/dev/null || exit 0

log "post-pull hook started"

# Never run git fetch/pull/submodule synchronously here.
# They can block for 1-3 minutes on slow GitHub connections and Baota will mark deployment failed.
if [ -f scripts/sync-garden.sh ] && [ -f .gitmodules ]; then
  log "Garden Skills sync scheduled in background"
  (
    sleep 2
    cd "$PROJECT_DIR" || exit 0
    # Limit the optional background sync as well. If timeout is unavailable, run normally.
    if command -v timeout >/dev/null 2>&1; then
      timeout 180 bash scripts/sync-garden.sh
    else
      bash scripts/sync-garden.sh
    fi
  ) >"$GARDEN_LOG" 2>&1 </dev/null &
fi

if [ -f index.html ]; then
  log "index page ready: $PROJECT_DIR/index.html"
else
  log "WARNING: index.html not found"
fi

log "post-pull hook finished"
log "Garden background log: $GARDEN_LOG"

# Always return success: Baota's own git pull result is the authoritative deployment result.
exit 0
