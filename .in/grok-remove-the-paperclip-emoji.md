# Remove the paperclip emoji from transclusion nodes
**Refined:** 2026-02-08
**Done when:** The 📎 emoji no longer appears on transclusion nodes in the restructured document panel.

## Details
- Location: `src/lib/components/transclusion-node.svelte`, line 42
- Remove the `<span class="text-xs text-muted-foreground">📎</span>` element entirely
- No replacement indicator needed
