<script lang="ts">
	import type { TransclusionNode } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";

	let { node }: { node: TransclusionNode } = $props();

	let isEditing = $state(false);
	let editText = $state("");
	let showOriginal = $state(false);
	let cursorOffset = $state<number | null>(null);
	let textSpan: HTMLSpanElement | undefined = $state();

	const isSelected = $derived(grokState.selectedNodeIds.has(node.id));
	const isHovered = $derived(
		grokState.hoveredNodeId === node.id ||
		grokState.hoveredParagraphId === node.transclusion.paragraphId
	);
	const isCollapsed = $derived(grokState.isCollapsed(`node-${node.id}`));
	const hasEdits = $derived(node.editedText !== undefined);
	const displayText = $derived(
		showOriginal ? node.transclusion.text : (node.editedText ?? node.transclusion.text)
	);

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

	function startEditing() {
		editText = node.editedText ?? node.transclusion.text;
		isEditing = true;
	}

	function saveEdit() {
		grokState.editTransclusion(node.id, editText);
		isEditing = false;
	}

	function cancelEdit() {
		isEditing = false;
	}

	function handleEditKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			cancelEdit();
		}
	}

	function handleRevert() {
		grokState.revertTransclusion(node.id);
		showOriginal = false;
	}

	function detectCursorOffset() {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || !textSpan) {
			cursorOffset = null;
			return;
		}
		const range = sel.getRangeAt(0);
		if (!textSpan.contains(range.startContainer)) {
			cursorOffset = null;
			return;
		}
		const preRange = document.createRange();
		preRange.setStart(textSpan, 0);
		preRange.setEnd(range.startContainer, range.startOffset);
		cursorOffset = preRange.toString().length;
	}

	function handleSplit() {
		if (cursorOffset !== null && cursorOffset > 0 && cursorOffset < displayText.length) {
			grokState.splitTransclusion(node.id, cursorOffset);
		}
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="cursor-pointer rounded-md border px-3 py-2 text-sm transition-all
				{isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border'}
				{isHovered ? 'bg-accent' : 'hover:bg-accent/50'}
				{hasEdits ? 'border-l-4 border-l-blue-400' : ''}"
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
				<div class="flex-1 min-w-0">
					{#if isCollapsed}
						<span class="text-muted-foreground">{getPreview(displayText)}</span>
					{:else if isEditing}
						<textarea
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm resize-y min-h-[3em]"
							bind:value={editText}
							onkeydown={handleEditKeydown}
							onclick={(e) => e.stopPropagation()}
						></textarea>
						<div class="flex gap-1 mt-1">
							<button
								class="text-xs px-2 py-0.5 rounded bg-primary text-primary-foreground hover:bg-primary/90"
								onclick={(e) => { e.stopPropagation(); saveEdit(); }}
								title="Save edit"
							>Save</button>
							<button
								class="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80"
								onclick={(e) => { e.stopPropagation(); cancelEdit(); }}
								title="Cancel edit"
							>Cancel</button>
						</div>
					{:else}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							bind:this={textSpan}
							class={showOriginal ? 'text-muted-foreground italic' : ''}
							onmouseup={detectCursorOffset}
							oncontextmenu={detectCursorOffset}
						>{displayText}</span>
					{/if}
				</div>
				{#if !isCollapsed && !isEditing && hasEdits}
					<div class="flex gap-1 shrink-0">
						<button
							class="text-xs px-1.5 py-0.5 rounded transition-colors
								{showOriginal ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
							onclick={(e) => { e.stopPropagation(); showOriginal = !showOriginal; }}
							title={showOriginal ? "Show edited" : "Show original"}
						>{showOriginal ? "Edited" : "Original"}</button>
						<button
							class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-700 transition-colors"
							onclick={(e) => { e.stopPropagation(); handleRevert(); }}
							title="Revert to original text"
						>Revert</button>
					</div>
				{/if}
			</div>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item onclick={startEditing}>
			Edit
		</ContextMenu.Item>
		{#if cursorOffset !== null && cursorOffset > 0 && cursorOffset < displayText.length}
			<ContextMenu.Item onclick={handleSplit}>
				Split here
			</ContextMenu.Item>
		{/if}
		<ContextMenu.Item onclick={() => grokState.listifyNode(node.id)}>
			Listify
		</ContextMenu.Item>
		{#if hasEdits}
			<ContextMenu.Item onclick={() => { showOriginal = !showOriginal; }}>
				{showOriginal ? "Show edited" : "Show original"}
			</ContextMenu.Item>
			<ContextMenu.Item onclick={handleRevert}>
				Revert to original
			</ContextMenu.Item>
		{/if}
		<ContextMenu.Separator />
		<ContextMenu.Item onclick={handleRemove}>
			Remove
			<ContextMenu.Shortcut>⌫</ContextMenu.Shortcut>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
