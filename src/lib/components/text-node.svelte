<script lang="ts">
	import type { TextNode } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";

	let { node }: { node: TextNode } = $props();

	const isSelected = $derived(grokState.selectedNodeIds.has(node.id));
	const isCollapsed = $derived(grokState.isCollapsed(`node-${node.id}`));

	function handleClick(event: MouseEvent) {
		event.stopPropagation();
		grokState.selectNode(node.id, event.metaKey || event.ctrlKey);
	}

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="cursor-pointer rounded-md border border-dashed px-3 py-2 text-sm transition-all
		{isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border'}
		hover:bg-accent/50"
	onclick={handleClick}
	title="Text node"
>
	{#if isCollapsed}
		<button
			class="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
			onclick={(e) => {
				e.stopPropagation();
				grokState.toggleCollapsed(`node-${node.id}`);
			}}
			title="Expand"
			aria-label="Expand"
		>⊞</button>
	{:else}
		<div class="flex items-center gap-2">
			<button
				class="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
				onclick={(e) => {
					e.stopPropagation();
					grokState.toggleCollapsed(`node-${node.id}`);
				}}
				title="Collapse"
				aria-label="Collapse"
			>⊟</button>
			<span class="text-xs text-muted-foreground">📝</span>
			<span>{node.text}</span>
		</div>
	{/if}
</div>
