#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="$(tr -d '[:space:]' < "$ROOT/.local-domain")"
HOSTS_FILE="${DANNIFY_HOSTS_FILE:-/etc/hosts}"
MARKER="# grok-local-domain"

if [[ ! "$DOMAIN" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.local$ ]]; then
	printf 'error: invalid .local-domain: %s\n' "$DOMAIN" >&2
	exit 1
fi

if awk -v domain="$DOMAIN" '$1 == "127.0.0.1" { for (i = 2; i <= NF; i++) if ($i == domain) found = 1 } END { exit found ? 0 : 1 }' "$HOSTS_FILE"; then
	printf '%s already resolves to 127.0.0.1\n' "$DOMAIN"
	exit 0
fi

if [[ "$HOSTS_FILE" == "/etc/hosts" && "$EUID" -ne 0 ]]; then
	/usr/bin/osascript - "$0" <<'APPLESCRIPT'
on run argv
	do shell script quoted form of item 1 of argv with administrator privileges
end run
APPLESCRIPT
	exit $?
fi

printf '127.0.0.1\t%s\t%s\n' "$DOMAIN" "$MARKER" >> "$HOSTS_FILE"
/usr/bin/dscacheutil -flushcache 2>/dev/null || true
/usr/bin/killall -HUP mDNSResponder 2>/dev/null || true
printf 'Added %s -> 127.0.0.1\n' "$DOMAIN"
