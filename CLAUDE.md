# Grok

Semantic document restructuring tool — SvelteKit SPA with TypeScript and shadcn-svelte.

## Tech Stack
- SvelteKit (SPA mode via adapter-static)
- Svelte 5 runes ($state, $derived, $effect)
- TypeScript
- Tailwind CSS v4
- shadcn-svelte (bits-ui, paneforge, sonner)
- localStorage for persistence

## Architecture
- **Store**: Class-based with Svelte 5 runes in `src/lib/stores/grok-state.svelte.ts`
- **Data model**: Flat node map (`Record<NodeId, RNode>`) + ordered `rootOrder: NodeId[]`
- **Components**: `src/lib/components/` — shadcn UI in `ui/`, app components at top level
- **Types**: `src/lib/types.ts`

## Dev Commands
- `npm run dev` — start dev server (port 5174 if 5173 is taken)
- `npm run build` — build for production
- `npm run check` — run svelte-check type checking

## Key Patterns
- All source text is immutable once loaded
- Transclusions reference source paragraphs by stable ID + character offsets
- Undo/redo via linear history stack of RestructuredDocument snapshots
- Debug mode shows internal state in a drawer panel
