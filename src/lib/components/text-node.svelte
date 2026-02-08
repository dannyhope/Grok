<script lang="ts">
	import type { TextNode } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";

	let { node }: { node: TextNode } = $props();

	const isSelected = $derived(grokState.selectedNodeIds.has(node.id));

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
	<span class="text-xs text-muted-foreground">📝</span>
	{node.text}
</div>
