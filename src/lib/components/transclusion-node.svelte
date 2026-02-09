<script lang="ts">
	import type { TransclusionNode } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";

	type ViewMode = "edited" | "diff" | "original";
	type DiffSegment = { text: string; type: "same" | "added" | "removed" };

	let { node }: { node: TransclusionNode } = $props();

	let isEditing = $state(false);
	let editText = $state("");
	let viewMode = $state<ViewMode>("edited");
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
		viewMode === "original" ? node.transclusion.text : (node.editedText ?? node.transclusion.text)
	);

	const viewModeLabel = $derived.by(() => {
		if (viewMode === "edited") return "Edited";
		if (viewMode === "diff") return "Diff";
		return "Original";
	});

	const nextModeLabel = $derived.by(() => {
		if (viewMode === "edited") return "Diff";
		if (viewMode === "diff") return "Original";
		return "Edited";
	});

	function cycleViewMode() {
		if (viewMode === "edited") viewMode = "diff";
		else if (viewMode === "diff") viewMode = "original";
		else viewMode = "edited";
	}

	function computeDiff(oldText: string, newText: string): DiffSegment[] {
		const oldWords = oldText.split(/(\s+)/);
		const newWords = newText.split(/(\s+)/);

		// LCS table
		const m = oldWords.length;
		const n = newWords.length;
		const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				if (oldWords[i - 1] === newWords[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1] + 1;
				} else {
					dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
				}
			}
		}

		// Backtrack to build diff
		const segments: DiffSegment[] = [];
		let i = m, j = n;

		const raw: DiffSegment[] = [];
		while (i > 0 || j > 0) {
			if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
				raw.push({ text: oldWords[i - 1], type: "same" });
				i--; j--;
			} else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
				raw.push({ text: newWords[j - 1], type: "added" });
				j--;
			} else {
				raw.push({ text: oldWords[i - 1], type: "removed" });
				i--;
			}
		}

		raw.reverse();

		// Merge consecutive segments of the same type
		for (const seg of raw) {
			if (segments.length > 0 && segments[segments.length - 1].type === seg.type) {
				segments[segments.length - 1].text += seg.text;
			} else {
				segments.push({ ...seg });
			}
		}

		return segments;
	}

	const diffSegments = $derived.by(() => {
		if (!hasEdits || !node.editedText) return [];
		return computeDiff(node.transclusion.text, node.editedText);
	});

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
		viewMode = "edited";
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
					{:else if viewMode === "diff" && hasEdits}
						<span>
							{#each diffSegments as seg}
								{#if seg.type === "removed"}
									<span class="text-red-300 line-through">{seg.text}</span>
								{:else if seg.type === "added"}
									<span class="font-bold text-green-600">{seg.text}</span>
								{:else}
									<span>{seg.text}</span>
								{/if}
							{/each}
						</span>
					{:else}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							bind:this={textSpan}
							class={viewMode === "original" ? 'text-muted-foreground italic' : ''}
							onmouseup={detectCursorOffset}
							oncontextmenu={detectCursorOffset}
						>{displayText}</span>
					{/if}
				</div>
				{#if !isCollapsed && !isEditing && hasEdits}
					<div class="flex gap-1 shrink-0">
						<button
							class="text-xs px-1.5 py-0.5 rounded transition-colors
								{viewMode !== 'edited' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
							onclick={(e) => { e.stopPropagation(); cycleViewMode(); }}
							title="Show {nextModeLabel.toLowerCase()}"
						>{nextModeLabel}</button>
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
			<ContextMenu.Item onclick={cycleViewMode}>
				Show {nextModeLabel.toLowerCase()}
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
