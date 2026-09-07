#!/usr/bin/env bash
set -u

PROJECT_DIR="/www/wwwroot/project6"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Project6] $*"
}

if [ ! -d "$PROJECT_DIR" ]; then
  echo "[Project6] ERROR: project directory not found: $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR" || exit 1

# 宝塔的 Git 自动部署会先执行 git pull，再执行本脚本。
# 因此这里不再重复 fetch / pull，避免二次拉取造成部署失败。
git config --global --add safe.directory "$PROJECT_DIR" >/dev/null 2>&1 || true

log "post-pull deployment hook started"

# Garden Skills 是 Project6 的学习底座，但它不应该阻断主站部署。
# 首次部署会初始化 submodule；如果网络或 GitHub 临时异常，只记录警告。
if [ -f .gitmodules ]; then
  log "syncing Garden Skills submodule"
  if git submodule sync --recursive && git submodule update --init --recursive; then
    log "Garden Skills ready"
  else
    log "WARNING: Garden Skills sync failed; main Project6 site will continue deploying"
  fi
fi

if [ -f scripts/sync-garden.sh ]; then
  chmod +x scripts/sync-garden.sh >/dev/null 2>&1 || true
fi

if [ ! -f index.html ]; then
  echo "[Project6] ERROR: index.html not found"
  exit 1
fi

log "index page ready: $PROJECT_DIR/index.html"
log "deployment completed successfully"
exit 0
