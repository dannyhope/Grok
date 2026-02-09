# Collapse paragraphs to a small square icon with no text preview
**Refined:** 2026-02-08
**Done when:** Collapsed paragraphs/nodes show only a small outlined square with `+` (like `⊞`) — no text is visible until expanded. Expanding shows the full text with a `−` square (like `⊟`) to re-collapse. Applies to all node types: source paragraphs, text nodes, list nodes, and transclusions.

## Current behaviour
- Collapsed items show a `▶` triangle alongside a 50-character text preview
- Expanded items show a `▼` triangle

## Desired behaviour
- Collapsed items show only a small outlined square with `+` — no text whatsoever
- Expanded items show the full text with a small outlined square with `−`
- Applies to: `source-paragraph.svelte`, `text-node.svelte`, `list-node.svelte`, `transclusion-node.svelte`
