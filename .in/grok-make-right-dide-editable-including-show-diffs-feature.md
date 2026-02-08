# Make transclusion text editable with diff toggle
**Refined:** 2026-02-08
**Done when:** Users can edit transclusion text in the restructured panel while maintaining the link to the source, and toggle between original and edited views.

## Foundational principle
Source text is immutable in this version. Edits only happen on the transclusion side.

## Details
- Transclusion text in the restructured panel (right side) becomes editable
- Editing a transclusion does not alter the original source text (left side)
- The relationship between the transclusion and its source paragraph is preserved after editing
- Store edits as diff/patches relative to the source text (not override text) — this lays groundwork for future versioning
- A toggle button switches each edited transclusion between "original" and "edited" views
- Each edited transclusion has a revert button to restore the original source text
- Source panel (left) remains immutable

## Out of scope (v1)
- Sapling-style versioning per transclusion (see separate task)
