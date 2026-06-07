import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SocialAuthButton } from "./social-auth-button";

test("renders the Apple social auth button in server-rendered React output", () => {
  const html = renderToStaticMarkup(
    <SocialAuthButton social="apple" label="Apple 로그인" />,
  );

  assert.match(html, /data-login-apple/);
  assert.match(html, /Apple 로그인/);
  assert.match(html, /bg-teal-gray-900/);
});

test("renders the Apple social auth button from a workspace app runtime", () => {
  const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../..",
  );
  const code = [
    "import React from 'react';",
    "import { renderToStaticMarkup } from 'react-dom/server';",
    "import { SocialAuthButton } from '@umc/ui';",
    "console.log(renderToStaticMarkup(React.createElement(SocialAuthButton, { social: 'apple' })));",
  ].join(" ");

  const result = spawnSync(
    "pnpm",
    ["--filter", "@umc/blog", "exec", "tsx", "-e", code],
    {
      cwd: rootDir,
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /data-login-apple/);
  assert.match(result.stdout, /Apple 로그인/);
});
