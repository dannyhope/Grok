# Port the extension to Safari and Firefox

**Readiness:** auto-refined
**Roadmap:** later
**Dictated:** 2026-09-15
**Source:** session-prompt

## Task

If Grok is distributed as a browser extension, port it to Safari and Firefox after the current browser-extension implementation is stable.

## Scope

- Confirm the current extension manifest and browser APIs used.
- Identify Safari Web Extension conversion requirements and Firefox compatibility gaps.
- Share the cross-browser implementation where practical, with browser-specific manifests or adapters only where necessary.
- Test installation, permissions, content scripts, background behaviour, and the primary user flow in Safari and Firefox.
- Document build, signing/submission, and release steps for both browsers.

## Acceptance criteria

- Safari and Firefox builds can be produced from the repository.
- The primary extension flow works in both browsers.
- Browser-specific limitations and release prerequisites are documented.

## Auto-investigation
**Investigated:** 2026-09-15
**Research depth:** baseline
**Understanding:** clear
**AI investigated:** 2026-09-15
**Complexity:** large
**Ambiguity score:** 0.35
**Complexity score:** 0.75

### At a glance
- **Outcome:** Repeatable Safari Web Extension and Firefox builds from the repo, with docs — **after** Grok ships a Chromium extension baseline.
- **Risk:** Premature port work; Grok is currently a SvelteKit web app (`npm run dev`, `grok.local`) with **no** `manifest.json` or extension tree in-repo.
- **Next:** Decide distribution shape first (extension vs hosted app), then ship MV3 Chrome/Edge, then port.
- **Plus (one line):** Treat “extension” as a thin shell around the same Grok UI with shared build pipeline (Vite multi-target) instead of three forks.

### Questions for refinement
1. **Is Grok meant to become a browser extension at all, or stay a local web app?** The repo today is SvelteKit-only (`_docs/spec.md` describes dev server, not a store listing).

   **Answer:**

2. **Should this task wait until a Chromium MV3 extension exists in-repo?** Porting without a baseline doubles discovery work.

   **Answer:**

### Recommended approach
1. Add a parent task or roadmap gate: “Ship Chromium extension MVP” before Safari/Firefox.
2. When unblocked, mirror Sapling’s MV3 manifest pattern and add `safari/` + `firefox/` packaging folders per `browser-extension` skill publish pack.
3. Document signing (Apple Developer, Mozilla AMO) as human-only hops in a helper page.

### Deeper insight

#### Findings
- No extension manifest or content/background scripts in Grok repo; build output is standard SvelteKit static/server bundle.
- Sapling (sibling product) already has a minimal MV3 `manifest.json` — reasonable precedent for Grok if extension-bound.

#### Scope (when unblocked)
- New extension entry (popup or side panel), shared assets from Svelte build, browser-specific manifest tweaks, store publish packs.

#### Documentation impact
- Update `_docs/spec.md` — product surface (extension vs web app) and cross-browser release paths once decided.

### Related items
- `port-sapling-to-safari-and-firefox.md` (Sapling) — complementary cross-browser port pattern.
- Grok `.in/auto-refined/grok-sapling-style-versioning-per-transclusion.md` — product direction, not extension packaging.
