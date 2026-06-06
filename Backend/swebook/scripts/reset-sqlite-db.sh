#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DB_PATH="${SWEBOOK_DB_PATH:-${PROJECT_DIR}/data/swebook.sqlite}"
SCHEMA_PATH="${PROJECT_DIR}/db/sqlite/01-schema.sql"
SEED_PATH="${PROJECT_DIR}/db/sqlite/02-seed.sql"
UPLOADS_PATH="${PROJECT_DIR}/uploads/trade-posts"

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "sqlite3 command is required to reset the demo database." >&2
  exit 1
fi

mkdir -p "$(dirname "${DB_PATH}")"
rm -f "${DB_PATH}"
rm -rf "${UPLOADS_PATH}"

sqlite3 "${DB_PATH}" <<SQL
.read ${SCHEMA_PATH}
.read ${SEED_PATH}
PRAGMA foreign_key_check;
SQL

echo "Reset SWEBook SQLite demo database: ${DB_PATH}"
