<script lang="ts">
	import type { RNode } from "$lib/types.js";
	import TransclusionNodeComponent from "./transclusion-node.svelte";
	import TextNodeComponent from "./text-node.svelte";
	import ListNodeComponent from "./list-node.svelte";

	let { node, inList = false }: { node: RNode; inList?: boolean } = $props();

	let draggedOver = $state(false);

	function handleDragStart(event: DragEvent) {
		if (event.dataTransfer) {
			event.dataTransfer.setData("text/plain", node.id);
			event.dataTransfer.effectAllowed = "move";
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
		draggedOver = true;
	}

	function handleDragLeave() {
		draggedOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		draggedOver = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="transition-all {draggedOver ? 'ring-2 ring-primary/50 rounded' : ''}"
	draggable="true"
	ondragstart={handleDragStart}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="listitem"
>
	{#if node.type === "transclusion"}
		<TransclusionNodeComponent {node} />
	{:else if node.type === "text"}
		<TextNodeComponent {node} />
	{:else if node.type === "list"}
		<ListNodeComponent {node} />
	{/if}
</div>
