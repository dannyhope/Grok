#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
HOSTNAME="$(tr -d '[:space:]' < "$ROOT_DIR/.local-domain")"
PORT="$(tr -d '[:space:]' < "$ROOT_DIR/.dev-port")"
URL="http://${HOSTNAME}/"
HEALTH_URL="http://127.0.0.1:${PORT}/"

if ! curl --silent --show-error --fail --max-time 2 "$HEALTH_URL" >/dev/null; then
  echo "Grok is not running on 127.0.0.1:${PORT}." >&2
  echo "Start it with: npm run dev" >&2
  exit 1
fi

echo "Opening ${URL}"
open "$URL"
