<script lang="ts">
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import Separator from "$lib/components/ui/separator/separator.svelte";

	const selectedCount = $derived(grokState.selectedNodeIds.size);

	function handleRemove() {
		const ids = Array.from(grokState.selectedNodeIds);
		if (ids.length > 0) grokState.removeNodes(ids);
	}

	function handleMakeList() {
		const ids = Array.from(grokState.selectedNodeIds);
		if (ids.length >= 2) grokState.makeList(ids);
	}
</script>

<div class="flex items-center gap-1 border-b px-3 py-1.5">
	<span class="text-sm font-semibold mr-2">Grok</span>

	<Separator orientation="vertical" class="h-5" />

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				size="sm"
				variant="ghost"
				disabled={!grokState.canUndo}
				onclick={() => grokState.undo()}
				title="Undo (⌘Z)"
			>
				↩
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>Undo (⌘Z)</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				size="sm"
				variant="ghost"
				disabled={!grokState.canRedo}
				onclick={() => grokState.redo()}
				title="Redo (⌘⇧Z)"
			>
				↪
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>Redo (⌘⇧Z)</Tooltip.Content>
	</Tooltip.Root>

	<Separator orientation="vertical" class="h-5" />

	{#if selectedCount > 0}
		<span class="text-xs text-muted-foreground mx-1">{selectedCount} selected</span>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="sm"
					variant="ghost"
					onclick={handleRemove}
					title="Remove selected (⌫)"
				>
					Remove
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>Remove selected (⌫)</Tooltip.Content>
		</Tooltip.Root>

		{#if selectedCount >= 2}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						size="sm"
						variant="ghost"
						onclick={handleMakeList}
						title="Make list (⌘L)"
					>
						Make list
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Make list (⌘L)</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	{/if}

	<div class="flex-1"></div>

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				size="sm"
				variant={grokState.debugMode ? "secondary" : "ghost"}
				onclick={() => grokState.toggleDebug()}
				title="Toggle debug (⌘D)"
			>
				Debug
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>Toggle debug panel (⌘D)</Tooltip.Content>
	</Tooltip.Root>
</div>
