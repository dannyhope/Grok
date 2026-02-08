<script lang="ts">
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import { clearState } from "$lib/persist.js";

	const debugData = $derived({
		source: grokState.source
			? {
					paragraphCount: grokState.source.paragraphs.length,
					totalChars: grokState.source.rawText.length,
				}
			: null,
		restructured: {
			nodeCount: Object.keys(grokState.restructured.nodes).length,
			rootOrder: grokState.restructured.rootOrder,
			nodes: grokState.restructured.nodes,
		},
		history: {
			stackSize: grokState.historyStack.length,
			currentIndex: grokState.historyIndex,
			labels: grokState.historyStack.map((e) => e.label),
		},
		selection: Array.from(grokState.selectedNodeIds),
		hoveredNodeId: grokState.hoveredNodeId,
		hoveredParagraphId: grokState.hoveredParagraphId,
		transcludedRanges: grokState.transcludedRanges,
	});

	function handleClearStorage() {
		clearState();
	}
</script>

{#if grokState.debugMode}
	<div class="border-t bg-muted/30">
		<div class="flex items-center justify-between border-b px-4 py-2">
			<h3 class="text-xs font-semibold tracking-tight">Debug</h3>
			<div class="flex gap-1">
				<Button size="sm" variant="ghost" onclick={handleClearStorage} class="text-xs h-6">
					Clear localStorage
				</Button>
				<Button size="sm" variant="ghost" onclick={() => grokState.toggleDebug()} class="text-xs h-6">
					Close
				</Button>
			</div>
		</div>
		<ScrollArea.Root class="h-[200px]">
			<div class="p-4">
				<pre class="text-xs font-mono whitespace-pre-wrap break-all">{JSON.stringify(debugData, null, 2)}</pre>
			</div>
		</ScrollArea.Root>
	</div>
{/if}
