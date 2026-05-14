#!/bin/sh
# Catty 3D direct install — mounts the latest release DMG, drops the
# .app into /Applications (or ~/Applications), strips the quarantine
# attribute, and opens it. Mirrors the Local AI Cat installer flow.
#
#   curl -fsSL https://catty3d.com/install.sh | sh
#
# Source: https://github.com/mochiexists/catty3d-site/blob/main/public/install.sh

set -eu

# Release host (mirrors localaicat's pattern: site repo hosts the DMG +
# appcast, source repo holds the code). The site repo is also a public
# Pages deploy, so rate-limited GitHub API calls aren't the bottleneck.
REPO="mochiexists/catty3d-site"
SITE="https://catty3d.com"
TMP_DIR=$(mktemp -d)
DMG_PATH="$TMP_DIR/Catty.dmg"
MOUNT_POINT=""
TARGET_DIR="/Applications"

# ────── colour ──────
if [ -t 1 ]; then
  RESET=$(printf '\033[0m')
  TEXT=$(printf '\033[38;5;252m')
  PINK=$(printf '\033[38;5;213m')
  VIOLET=$(printf '\033[38;5;141m')
  GREEN=$(printf '\033[38;5;120m')
  DIM=$(printf '\033[38;5;244m')
else
  RESET=""; TEXT=""; PINK=""; VIOLET=""; GREEN=""; DIM=""
fi

print_banner() {
  printf "\n"
  printf "  %s/%s\\_%s/%s\\%s\n"        "$PINK" "$VIOLET" "$PINK" "$VIOLET" "$RESET"
  printf " %s(%s %so%s.%so %s)%s  %sCatty%s %s3D%s\n" \
    "$TEXT" "$VIOLET" "$TEXT" "$VIOLET" "$TEXT" "$VIOLET" "$RESET" \
    "$TEXT" "$RESET" "$PINK" "$RESET"
  printf "  %s>%s %s^%s %s<%s   %sa terminal that lives in 3D space%s\n" \
    "$VIOLET" "$RESET" "$TEXT" "$RESET" "$VIOLET" "$RESET" "$DIM" "$RESET"
  printf "\n"
}

print_done_banner() {
  printf "\n"
  printf "  %s/%s\\_%s/%s\\%s\n"        "$PINK" "$VIOLET" "$PINK" "$VIOLET" "$RESET"
  printf " %s(%s %s^%s.%s^ %s)%s  %sInstalled — launching…%s\n" \
    "$TEXT" "$VIOLET" "$TEXT" "$VIOLET" "$TEXT" "$VIOLET" "$RESET" "$GREEN" "$RESET"
  printf "  %s>%s %s^%s %s<%s   %smeow~%s\n" \
    "$VIOLET" "$RESET" "$TEXT" "$RESET" "$VIOLET" "$RESET" "$PINK" "$RESET"
  printf "\n"
}

print_no_release() {
  printf "\n"
  printf "  %s/%s\\_%s/%s\\%s\n"        "$PINK" "$VIOLET" "$PINK" "$VIOLET" "$RESET"
  printf " %s(%s %s-%s.%s- %s)%s  %sNo release yet%s\n" \
    "$TEXT" "$VIOLET" "$TEXT" "$VIOLET" "$TEXT" "$VIOLET" "$RESET" "$PINK" "$RESET"
  printf "  %s>%s %s_%s %s<%s   %smaxwell is napping%s\n" \
    "$VIOLET" "$RESET" "$TEXT" "$RESET" "$VIOLET" "$RESET" "$DIM" "$RESET"
  printf "\n"
  printf "%sCatty's first public release hasn't shipped yet — there's no .dmg on%s\n" "$TEXT" "$RESET"
  printf "%s%s/releases/latest to install.%s\n\n" "$TEXT" "$REPO" "$RESET"
  printf "%sIn the meantime:%s\n" "$TEXT" "$RESET"
  printf "  %s•%s Watch the repo:  %shttps://github.com/%s%s\n" "$PINK" "$RESET" "$VIOLET" "$REPO" "$RESET"
  printf "  %s•%s Read the docs:   %s%s%s\n" "$PINK" "$RESET" "$VIOLET" "$SITE" "$RESET"
  printf "  %s•%s Re-run later:    %scurl -fsSL %s/install.sh | sh%s\n\n" "$PINK" "$RESET" "$GREEN" "$SITE" "$RESET"
}

print_appstore_conflict() {
  existing="$1"
  printf "\n"
  printf " %s(=^.^=)%s  %sThis cat is already home%s\n\n" "$VIOLET" "$RESET" "$PINK" "$RESET"
  printf "%sLooks like an App Store / TestFlight copy is already installed at:%s\n" "$TEXT" "$RESET"
  printf "  %s%s%s\n\n" "$VIOLET" "$existing" "$RESET"
  printf "%sThe Outdoor (direct-download) build can't replace it because the%s\n" "$TEXT" "$RESET"
  printf "%sApp Store version is owned by the system. Pick one of these:%s\n\n" "$TEXT" "$RESET"
  printf "  %s1.%s Drag it from /Applications to the Trash in Finder.\n" "$PINK" "$RESET"
  printf "  %s2.%s Or in this terminal:\n" "$PINK" "$RESET"
  printf "       %ssudo rm -rf %s\"%s\"%s\n\n" "$VIOLET" "$PINK" "$existing" "$RESET"
  printf "%sThen re-run:%s\n" "$TEXT" "$RESET"
  printf "  %scurl -fsSL %s/install.sh | sh%s\n\n" "$GREEN" "$SITE" "$RESET"
}

cleanup() {
  if [ -n "${MOUNT_POINT:-}" ] && [ -d "$MOUNT_POINT" ]; then
    /usr/bin/hdiutil detach "$MOUNT_POINT" -quiet 2>/dev/null || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if ! command -v curl >/dev/null 2>&1; then
  printf "error: curl is required\n" >&2
  exit 1
fi

if [ "$(uname -s)" != "Darwin" ]; then
  printf "Catty 3D is macOS-only — sorry. (uname -s reported %s)\n" "$(uname -s)" >&2
  exit 1
fi

if [ ! -w "$TARGET_DIR" ]; then
  TARGET_DIR="$HOME/Applications"
  mkdir -p "$TARGET_DIR"
fi

print_banner

# ────── discover .dmg on the latest release ──────
printf "%s==>%s Looking for the latest release of %s%s%s…\n" \
  "$VIOLET" "$RESET" "$PINK" "$REPO" "$RESET"

# Fetch the latest release JSON. If the repo has zero releases the
# endpoint returns 404; if it has a release we walk every asset URL
# and grab the first .dmg, so the script keeps working even if the
# DMG filename changes between releases.
RELEASE_JSON=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" 2>/dev/null || true)
if [ -z "$RELEASE_JSON" ]; then
  print_no_release
  exit 0
fi

DOWNLOAD_URL=$(printf "%s" "$RELEASE_JSON" \
  | awk -F'"' '/browser_download_url/ {print $4}' \
  | grep -i '\.dmg$' \
  | head -1 || true)

if [ -z "${DOWNLOAD_URL:-}" ]; then
  print_no_release
  exit 0
fi

VERSION=$(printf "%s" "$RELEASE_JSON" \
  | awk -F'"' '/^[[:space:]]*"tag_name":/ {print $4; exit}')
if [ -n "${VERSION:-}" ]; then
  printf "%s   →%s found %s%s%s\n" "$DIM" "$RESET" "$GREEN" "$VERSION" "$RESET"
fi

# ────── download ──────
printf "%s==>%s Downloading %s%s%s …\n" \
  "$VIOLET" "$RESET" "$DIM" "$DOWNLOAD_URL" "$RESET"
# Use curl's default progress meter — --progress-bar is invisible
# for the first few seconds and looks broken.
/usr/bin/curl -fL "$DOWNLOAD_URL" -o "$DMG_PATH"

# ────── mount ──────
printf "%s==>%s Mounting … %s*paws at disk*%s\n" "$VIOLET" "$RESET" "$DIM" "$RESET"
HDIUTIL_OUT=$(/usr/bin/hdiutil attach "$DMG_PATH" -nobrowse -readonly)
MOUNT_POINT=$(printf "%s" "$HDIUTIL_OUT" | grep -o '/Volumes/.*' | head -1)

# ────── locate .app ──────
APP_PATH=""
for candidate in "$MOUNT_POINT"/*.app; do
  if [ -d "$candidate" ]; then
    APP_PATH="$candidate"
    break
  fi
done

if [ -z "$APP_PATH" ]; then
  printf "error: no .app bundle inside the DMG. is this the right release?\n" >&2
  exit 1
fi

APP_NAME=$(basename "$APP_PATH")
DESTINATION_PATH="$TARGET_DIR/$APP_NAME"

# App Store / system-owned conflict?
if [ -e "$DESTINATION_PATH" ]; then
  if [ -e "$DESTINATION_PATH/Contents/_MASReceipt" ] || [ ! -w "$DESTINATION_PATH" ]; then
    print_appstore_conflict "$DESTINATION_PATH"
    exit 1
  fi
fi

# ────── install ──────
printf "%s==>%s Installing into %s%s%s … %s*knocks things off desk*%s\n" \
  "$VIOLET" "$RESET" "$PINK" "$TARGET_DIR" "$RESET" "$DIM" "$RESET"
/bin/rm -rf "$DESTINATION_PATH"
/bin/cp -R "$APP_PATH" "$DESTINATION_PATH"
/usr/bin/xattr -cr "$DESTINATION_PATH"

print_done_banner
/usr/bin/open "$DESTINATION_PATH"
