#!/usr/bin/env bash
set -euo pipefail

echo "[Project6] Syncing Garden Skills submodule..."
git submodule sync --recursive
git submodule update --init --recursive

echo "[Project6] Garden Skills ready at vendor/garden-skills"
