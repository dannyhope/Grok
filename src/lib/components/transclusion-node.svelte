<script lang="ts">
	import type { TransclusionNode } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";

	let { node }: { node: TransclusionNode } = $props();

	const isSelected = $derived(grokState.selectedNodeIds.has(node.id));
	const isHovered = $derived(
		grokState.hoveredNodeId === node.id ||
		grokState.hoveredParagraphId === node.transclusion.paragraphId
	);
	const isCollapsed = $derived(grokState.isCollapsed(`node-${node.id}`));

	function getPreview(text: string, maxChars: number = 50): string {
		if (text.length <= maxChars) return text;
		return text.slice(0, maxChars) + "…";
	}

	function handleClick(event: MouseEvent) {
		event.stopPropagation();
		grokState.selectNode(node.id, event.metaKey || event.ctrlKey);
	}

	function handleMouseEnter() {
		grokState.setHoveredNode(node.id);
	}

	function handleMouseLeave() {
		grokState.setHoveredNode(null);
	}

	function handleRemove() {
		grokState.removeNodes([node.id]);
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="cursor-pointer rounded-md border px-3 py-2 text-sm transition-all
				{isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border'}
				{isHovered ? 'bg-accent' : 'hover:bg-accent/50'}"
			onclick={handleClick}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			title="From paragraph {node.transclusion.paragraphId} [{node.transclusion.startOffset}–{node.transclusion.endOffset}]"
		>
			<div class="flex items-center gap-2">
				<button
					class="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
					onclick={(e) => {
						e.stopPropagation();
						grokState.toggleCollapsed(`node-${node.id}`);
					}}
					title={isCollapsed ? "Expand" : "Collapse"}
				>
					{isCollapsed ? "▶" : "▼"}
				</button>
				<span>
					{#if isCollapsed}
						<span class="text-muted-foreground">{getPreview(node.transclusion.text)}</span>
					{:else}
						{node.transclusion.text}
					{/if}
				</span>
			</div>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item onclick={handleRemove}>
			Remove
			<ContextMenu.Shortcut>⌫</ContextMenu.Shortcut>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
