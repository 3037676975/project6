#!/usr/bin/env bash
# Project6 唯一部署脚本（宝塔 Git 自动部署：git pull 后执行）
# 原则：主站部署必须快速成功；Garden Skills 只做后台可选同步，绝不阻塞宝塔。

PROJECT_DIR="/www/wwwroot/project6"
GARDEN_LOG="/tmp/project6-garden-sync.log"
export GIT_TERMINAL_PROMPT=0

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Project6] $*"
}

# 宝塔已经完成 git pull，因此这里不再 fetch / pull。
if [ ! -d "$PROJECT_DIR" ]; then
  log "WARNING: project directory not found: $PROJECT_DIR"
  exit 0
fi

cd "$PROJECT_DIR" 2>/dev/null || exit 0
git config --global --add safe.directory "$PROJECT_DIR" >/dev/null 2>&1 || true

log "post-pull hook started"

# Garden Skills：直接在本脚本里后台同步，不再依赖第二个 SH 文件。
# 即使 GitHub 网络慢或同步失败，也不会影响 Project6 主站部署状态。
if [ -f .gitmodules ]; then
  log "Garden Skills background sync scheduled"
  (
    sleep 2
    cd "$PROJECT_DIR" || exit 0
    git submodule sync --recursive || true

    for attempt in 1 2 3; do
      echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Garden] update attempt $attempt/3"
      if command -v timeout >/dev/null 2>&1; then
        timeout 60 git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=20 submodule update --init --recursive && break
      else
        git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=20 submodule update --init --recursive && break
      fi
      sleep 3
    done
  ) >"$GARDEN_LOG" 2>&1 </dev/null &
fi

if [ -f index.html ]; then
  log "index page ready: $PROJECT_DIR/index.html"
else
  log "WARNING: index.html not found"
fi

log "post-pull hook finished"
log "Garden log: $GARDEN_LOG"

# 宝塔是否部署成功，以它自己的 git pull 为准；本后置脚本永远不制造红色失败。
exit 0
