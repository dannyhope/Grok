<script lang="ts">
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import RNodeRenderer from "./r-node-renderer.svelte";
	import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";

	let dragOverIndex = $state<number | null>(null);

	function handleBackgroundClick() {
		grokState.clearSelection();
	}

	function handleDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
		dragOverIndex = index;
	}

	function handleDragLeave() {
		dragOverIndex = null;
	}

	function handleDrop(event: DragEvent, toIndex: number) {
		event.preventDefault();
		dragOverIndex = null;

		const draggedId = event.dataTransfer?.getData("text/plain");
		if (!draggedId) return;

		const fromIndex = grokState.restructured.rootOrder.indexOf(draggedId);
		if (fromIndex === -1) return;

		const adjustedTo = toIndex > fromIndex ? toIndex - 1 : toIndex;
		if (fromIndex !== adjustedTo) {
			grokState.reorder(fromIndex, adjustedTo);
		}
	}

	function handleDropAtEnd(event: DragEvent) {
		event.preventDefault();
		dragOverIndex = null;

		const draggedId = event.dataTransfer?.getData("text/plain");
		if (!draggedId) return;

		const fromIndex = grokState.restructured.rootOrder.indexOf(draggedId);
		if (fromIndex === -1) return;

		const toIndex = grokState.restructured.rootOrder.length - 1;
		if (fromIndex !== toIndex) {
			grokState.reorder(fromIndex, toIndex);
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex h-full flex-col" onclick={handleBackgroundClick}>
	<div class="flex items-center justify-between border-b px-4 py-2">
		<h2 class="text-sm font-semibold tracking-tight">Restructured</h2>
		{#if grokState.rootNodes.length > 0}
			<span class="text-xs text-muted-foreground">{grokState.rootNodes.length} items</span>
		{/if}
	</div>

	{#if grokState.rootNodes.length === 0}
		<div class="flex flex-1 items-center justify-center p-8">
			<div class="text-center">
				<p class="text-sm text-muted-foreground">
					{#if grokState.source}
						Select text in the source panel and click <strong>Transclude</strong> to add items here.
					{:else}
						Load a source document to get started.
					{/if}
				</p>
			</div>
		</div>
	{:else}
		<ScrollArea.Root class="flex-1">
			<div class="p-4">
				<div class="space-y-1">
					{#each grokState.rootNodes as node, i (node.id)}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							ondragover={(e) => handleDragOver(e, i)}
							ondragleave={handleDragLeave}
							ondrop={(e) => handleDrop(e, i)}
						>
							{#if dragOverIndex === i}
								<div class="h-0.5 rounded bg-primary/50 my-1"></div>
							{/if}
							<RNodeRenderer {node} />
						</div>
					{/each}
				</div>
				<!-- Drop zone at end -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="min-h-[100px]"
					ondragover={(e) => { e.preventDefault(); dragOverIndex = grokState.rootNodes.length; }}
					ondragleave={handleDragLeave}
					ondrop={handleDropAtEnd}
				>
					{#if dragOverIndex === grokState.rootNodes.length}
						<div class="h-0.5 rounded bg-primary/50 my-1"></div>
					{/if}
				</div>
			</div>
		</ScrollArea.Root>
	{/if}
</div>
