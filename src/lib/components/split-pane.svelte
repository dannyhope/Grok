<script lang="ts">
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import SourcePanel from "./source-panel.svelte";
	import RestructuredPanel from "./restructured-panel.svelte";

	function handleResize(sizes: number[]) {
		grokState.setPanelSizes(sizes);
	}
</script>

<Resizable.PaneGroup
	direction="horizontal"
	class="h-full"
	onLayoutChange={handleResize}
>
	<Resizable.Pane defaultSize={grokState.panelSizes[0]} minSize={20}>
		<SourcePanel />
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={grokState.panelSizes[1]} minSize={20}>
		<RestructuredPanel />
	</Resizable.Pane>
</Resizable.PaneGroup>
