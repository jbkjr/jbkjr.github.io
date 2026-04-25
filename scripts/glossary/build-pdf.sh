#!/usr/bin/env bash
# Build the dhamma glossary PDF from content/dhamma/glossary.md.
#
# Output: content/dhamma/glossary.pdf, served by Quartz at /dhamma/glossary.pdf.
# Requires pandoc, xelatex, xeCJK, and a CJK font.

set -euo pipefail

cd "$(dirname "$0")/../.."

command -v pandoc >/dev/null
command -v xelatex >/dev/null

HEADER_SRC="scripts/glossary/header.tex"
HEADER="$HEADER_SRC"
TMPFILES=()

cleanup() {
  if [[ ${#TMPFILES[@]} -gt 0 ]]; then
    rm -f "${TMPFILES[@]}"
  fi
}
trap cleanup EXIT

FONTS=$(fc-list 2>/dev/null || true)
if [[ "${OSTYPE:-}" == "darwin"* ]] && ! grep -qi "Noto Serif CJK" <<< "$FONTS"; then
  if grep -qi "Hiragino Mincho" <<< "$FONTS"; then
    HEADER=$(mktemp -t glossary-header.XXXXXX)
    TMPFILES+=("$HEADER")
    sed \
      -e 's/Noto Serif CJK SC/Hiragino Mincho ProN/' \
      -e 's/Noto Sans CJK SC/Hiragino Sans/' \
      -e 's/Noto Sans Mono CJK SC/Hiragino Mincho ProN/' \
      "$HEADER_SRC" > "$HEADER"
    echo "Using Hiragino CJK fonts because Noto CJK was not found."
  fi
fi

mkdir -p content/dhamma

GIT_DATE=$(git log -1 --format='%cd' --date=format:'%B %d, %Y' -- content/dhamma/glossary.md 2>/dev/null || true)
if [[ -z "$GIT_DATE" ]]; then
  GIT_DATE=$(date '+%B %d, %Y')
fi
LAST_UPDATED="Last updated $(echo "$GIT_DATE" | sed 's/ 0/ /')"

TRANSFORMED="${TMPDIR:-/tmp}/glossary-pandoc-$$.md"
TMPFILES+=("$TRANSFORMED")
node --experimental-strip-types scripts/glossary/preprocess.mjs "$TRANSFORMED"

pandoc "$TRANSFORMED" \
  -o content/dhamma/glossary.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V documentclass=article \
  -V date="$LAST_UPDATED" \
  -V colorlinks=true \
  -V linkcolor=teal \
  --toc \
  --toc-depth=3 \
  -H "$HEADER"

echo "Built content/dhamma/glossary.pdf ($LAST_UPDATED)"
