import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const stylesDir = dirname(fileURLToPath(import.meta.url));

test("exposes semantic color tokens as Tailwind theme colors", () => {
  const css = readFileSync(join(stylesDir, "color.css"), "utf8");

  assert.match(css, /@theme\s+inline\s*{/);
  assert.match(css, /--color-ds-primary:\s*var\(--color-teal-500\);/);
  assert.match(css, /--color-ds-primary-strong:\s*var\(--color-teal-600\);/);
});

test("keeps display typography token names aligned with utilities", () => {
  const css = readFileSync(join(stylesDir, "typography.css"), "utf8");

  assert.match(css, /--text-display-2-medium-size:\s*2\.5rem;/);
  assert.match(css, /font-size:\s*var\(--text-display-2-medium-size\);/);
  assert.doesNotMatch(css, /--text-display-medium-2-size/);
});
