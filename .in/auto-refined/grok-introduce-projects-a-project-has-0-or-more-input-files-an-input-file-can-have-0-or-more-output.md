# Grok: projects with per-file version history

**Readiness:** auto-refined
**Roadmap:** later
**Dictated:** 2026-09-15
**Source:** session-prompt

grok- introduce projects – a project has 0 or more input files, an input file can have 0 or more output versions an output version stores all of its stantes (think sapling style infinite undo and branching)

## Done when
Grok supports a project container with multiple input files, each with Sapling-style branched version history for outputs (undo/branch per file), with persistence and UI to switch files.

## Auto-investigation
**Investigated:** 2026-09-15
**Research depth:** deep
**Understanding:** needs-clarification
**AI investigated:** 2026-09-15
**Complexity:** large
**Ambiguity score:** 0.70
**Complexity score:** 0.85

### At a glance
- **Outcome:** Multi-file “project” model with per-file Sapling-like versioning (states/branches), not single textarea only.
- **Risk:** Architectural rewrite; storage today may be disabled or single-document.
- **Next:** Answer history scope + persistence questions; consider task breakdown into children.
- **Plus (one line):** Start with two-file project cap and local-only IndexedDB before cloud/sync.

### Questions for refinement
1. **When someone edits a file, should they see only that file’s history, or one history for the whole project?**

   **Answer:**

2. **What should happen when someone adds, removes, or renames a file?** Should the action be undoable?

   **Answer:**

3. **Where should projects be saved?** Browser on device, native files, or account — pick one for v1.

   **Answer:**

4. **Should Grok become a multi-file tool, or stay single-file with this as a spin-off product?**

   **Answer:**

### Recommended approach
1. `/bombay refine` interactive or split into child tasks: persistence layer, file tree UI, per-file VC instance, project CRUD.
2. Reuse Sapling/Grok prior art in `.in/auto-refined/grok-sapling-style-versioning-per-transclusion.md`.
3. Do not implement until persistence + product boundary answered.

### Deeper insight

#### Findings
- Major graduation from SvelteKit demo app to multi-document VC product.
- Typo in source: “stantes” → states/versions.

#### Scope (indicative)
- New project manager module, file sidebar, multi-instance version control, storage manager, app bootstrap changes.

#### Documentation impact
- Rewrite `_docs/spec.md` for project/file model; `_docs/architecture.md` for storage and VC graph.

### Related items
- `grok-sapling-style-versioning-per-transclusion.md` — complementary versioning concept.
- Sapling product — precedent for per-document branching.
