import assert from "node:assert/strict";
import test from "node:test";

import {
  getCtaModalBodyClassName,
  getCtaModalContentClassName,
  getCtaModalWidthStyle,
} from "./cta-modal";

test("keeps CtaModal medium width while applying a viewport-safe width rule", () => {
  const className = getCtaModalContentClassName();
  const style = getCtaModalWidthStyle("medium");

  assert.equal(style["--umc-cta-modal-width"], "360px");
  assert.equal(
    style.width,
    "min(var(--umc-cta-modal-width), calc(100vw - 40px))",
  );
  assert.doesNotMatch(className, /max-w-\[/);
  assert.doesNotMatch(className, /\bw-full\b/);
});

test("keeps CtaModal panel padding on the body layer", () => {
  const panelClassName = getCtaModalContentClassName();
  const bodyClassName = getCtaModalBodyClassName();

  assert.match(panelClassName, /\boverflow-hidden\b/);
  assert.doesNotMatch(panelClassName, /\bpx-6\b/);
  assert.doesNotMatch(panelClassName, /\bpt-7\b/);
  assert.doesNotMatch(panelClassName, /\bpb-5\b/);
  assert.match(bodyClassName, /\bpx-6\b/);
  assert.match(bodyClassName, /\bpy-6\b/);
});

test("maps all CtaModal sizes to their intended desktop widths", () => {
  assert.equal(
    getCtaModalWidthStyle("small")["--umc-cta-modal-width"],
    "320px",
  );
  assert.equal(
    getCtaModalWidthStyle("medium")["--umc-cta-modal-width"],
    "360px",
  );
  assert.equal(
    getCtaModalWidthStyle("large")["--umc-cta-modal-width"],
    "480px",
  );
});
