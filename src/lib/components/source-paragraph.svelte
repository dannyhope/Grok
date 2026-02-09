<script lang="ts">
	import type { SourceParagraph } from "$lib/types.js";
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import { getTextSelection, clearTextSelection } from "$lib/actions/text-selection.js";
	import TranscludeButton from "./transclude-button.svelte";

	let { paragraph }: { paragraph: SourceParagraph } = $props();

	let showTranscludeButton = $state(false);
	let buttonPosition = $state({ x: 0, y: 0 });

	const ranges = $derived(grokState.transcludedRanges[paragraph.id] ?? []);
	const isHighlighted = $derived(grokState.hoveredParagraphId === paragraph.id);
	const isCollapsed = $derived(grokState.isCollapsed(`src-${paragraph.id}`));

	function mergeRanges(ranges: Array<{ start: number; end: number }>) {
		if (ranges.length === 0) return [];
		const sorted = [...ranges].sort((a, b) => a.start - b.start);
		const merged: Array<{ start: number; end: number }> = [sorted[0]];
		for (let i = 1; i < sorted.length; i++) {
			const last = merged[merged.length - 1];
			if (sorted[i].start <= last.end) {
				last.end = Math.max(last.end, sorted[i].end);
			} else {
				merged.push(sorted[i]);
			}
		}
		return merged;
	}

	function buildSegments(text: string, dimRanges: Array<{ start: number; end: number }>) {
		if (dimRanges.length === 0) return [{ text, dimmed: false }];

		const merged = mergeRanges(dimRanges);
		const segments: Array<{ text: string; dimmed: boolean }> = [];
		let pos = 0;

		for (const range of merged) {
			if (range.start > pos) {
				segments.push({ text: text.slice(pos, range.start), dimmed: false });
			}
			segments.push({ text: text.slice(range.start, range.end), dimmed: true });
			pos = range.end;
		}

		if (pos < text.length) {
			segments.push({ text: text.slice(pos), dimmed: false });
		}

		return segments;
	}

	const segments = $derived(buildSegments(paragraph.text, ranges));

	function handleMouseUp(event: MouseEvent) {
		const selection = getTextSelection(paragraph.id);
		if (selection) {
			showTranscludeButton = true;
			buttonPosition = { x: event.clientX, y: event.clientY - 40 };
		} else {
			showTranscludeButton = false;
		}
	}

	function handleTransclude() {
		const selection = getTextSelection(paragraph.id);
		if (selection) {
			grokState.transclude(
				selection.paragraphId,
				selection.startOffset,
				selection.endOffset,
				selection.text
			);
			clearTextSelection();
			showTranscludeButton = false;
		}
	}

	function handleMouseEnter() {
		grokState.setHoveredParagraph(paragraph.id);
	}

	function handleMouseLeave() {
		grokState.setHoveredParagraph(null);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative rounded px-3 py-2 leading-relaxed transition-colors select-text
		{isHighlighted ? 'bg-amber-100 ring-2 ring-amber-300' : 'hover:bg-muted/50'}"
	data-paragraph-id={paragraph.id}
	onmouseup={handleMouseUp}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	{#if isCollapsed}
		<button
			class="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
			onclick={() => grokState.toggleCollapsed(`src-${paragraph.id}`)}
			title="Expand"
			aria-label="Expand"
		>⊞</button>
	{:else}
		<div class="flex items-start gap-2">
			<button
				class="shrink-0 mt-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
				onclick={() => grokState.toggleCollapsed(`src-${paragraph.id}`)}
				title="Collapse"
				aria-label="Collapse"
			>⊟</button>
			<div class="flex-1">
				{#each segments as segment}
					{#if segment.dimmed}
						<span class="text-muted-foreground/40 line-through decoration-muted-foreground/20">{segment.text}</span>
					{:else}
						<span>{segment.text}</span>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if showTranscludeButton}
	<TranscludeButton
		x={buttonPosition.x}
		y={buttonPosition.y}
		ontransclude={handleTransclude}
		onclose={() => (showTranscludeButton = false)}
	/>
{/if}
