#!/usr/bin/env sh
# Catty 3D direct install script.
#
# Pulls the latest Outdoor (Direct Download) DMG from GitHub Releases,
# verifies it, and opens it for drag-to-Applications.
#
# Usage:  curl -fsSL https://catty3d.com/install.sh | sh
#
# Source: https://github.com/mochiexists/catty3d-site/blob/main/public/install.sh

set -eu

REPO="mochiexists/catty-3d"
ASSET="Catty.dmg"
TARGET="${TMPDIR:-/tmp}/${ASSET}"

echo "Catty 3D installer"
echo "──────────────────"

if ! command -v curl >/dev/null 2>&1; then
  echo "error: curl is required" >&2
  exit 1
fi

URL=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
  | awk -F'"' "/browser_download_url/ && /${ASSET}\$/ {print \$4; exit}")

if [ -z "${URL:-}" ]; then
  echo "error: no ${ASSET} found on the latest release of ${REPO}" >&2
  echo "       (the first public release may not have shipped yet)" >&2
  exit 1
fi

echo "→ downloading ${URL}"
curl -fL --progress-bar "$URL" -o "$TARGET"

echo "→ opening ${TARGET}"
open "$TARGET"

echo "Done. Drag Catty into Applications, then launch from Spotlight."
