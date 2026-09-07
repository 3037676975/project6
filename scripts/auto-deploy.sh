#!/usr/bin/env bash
# Project6 唯一宝塔部署后置脚本。
# 宝塔已经负责 git pull；这里不再执行任何联网、构建或 submodule 操作。

PROJECT_DIR="/www/wwwroot/project6"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Project6] $*"
}

if [ ! -d "$PROJECT_DIR" ]; then
  log "WARNING: project directory not found: $PROJECT_DIR"
  exit 0
fi

cd "$PROJECT_DIR" 2>/dev/null || exit 0

git config --global --add safe.directory "$PROJECT_DIR" >/dev/null 2>&1 || true

if [ -f index.html ]; then
  log "index.html ready"
else
  log "WARNING: index.html not found"
fi

log "post-pull hook finished"
exit 0
