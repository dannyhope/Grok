<script lang="ts">
	import type { ListNode } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import RNodeRenderer from "./r-node-renderer.svelte";

	let { node }: { node: ListNode } = $props();

	const isSelected = $derived(grokState.selectedNodeIds.has(node.id));
	const isCollapsed = $derived(grokState.isCollapsed(`node-${node.id}`));

	const children = $derived(
		node.children
			.map((id) => grokState.restructured.nodes[id])
			.filter(Boolean)
	);

	function handleClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			event.stopPropagation();
			grokState.selectNode(node.id, event.metaKey || event.ctrlKey);
		}
	}

	function handleChildDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
	}

	function handleChildDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		const draggedId = event.dataTransfer?.getData("text/plain");
		if (draggedId && draggedId !== node.id) {
			grokState.moveIntoList(draggedId, node.id);
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="rounded-md border-2 border-dashed px-2 py-2 transition-all
		{isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-muted-foreground/30'}
		hover:border-muted-foreground/50"
	onclick={handleClick}
	ondragover={handleChildDragOver}
	ondrop={handleChildDrop}
	title="List ({node.children.length} items)"
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
		<div class="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
			<button
				class="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
				onclick={(e) => {
					e.stopPropagation();
					grokState.toggleCollapsed(`node-${node.id}`);
				}}
				title="Collapse"
				aria-label="Collapse"
			>⊟</button>
			<span>📋</span>
			<span>List ({node.children.length})</span>
		</div>
		<div class="space-y-1 pl-3">
			{#each children as child (child.id)}
				<RNodeRenderer node={child} inList />
			{/each}
		</div>
	{/if}
</div>
