#!/usr/bin/env bash
# cron デーモンが動いていなければ起動する。コンテナが VS Code の外で再起動されると
# postStartCommand が走らず cron が止まったままになるため、postAttachCommand から呼ぶ。
set -euo pipefail

if ! command -v cron >/dev/null 2>&1; then
  echo "ensure-cron: cron is not installed"
  exit 0
fi
if sudo service cron status >/dev/null 2>&1; then
  echo "ensure-cron: cron is running"
else
  echo "ensure-cron: cron was not running; starting"
  sudo service cron start
fi
