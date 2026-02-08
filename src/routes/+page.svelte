<script lang="ts">
	import Toolbar from "$lib/components/toolbar.svelte";
	import SplitPane from "$lib/components/split-pane.svelte";
	import DebugPanel from "$lib/components/debug-panel.svelte";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>

<Tooltip.Provider>
	<Toolbar />
	<div class="flex-1 overflow-hidden">
		<SplitPane />
	</div>
	<DebugPanel />
</Tooltip.Provider>
