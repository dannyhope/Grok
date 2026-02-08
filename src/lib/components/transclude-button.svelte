<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

	let {
		x,
		y,
		ontransclude,
		onclose,
	}: {
		x: number;
		y: number;
		ontransclude: () => void;
		onclose: () => void;
	} = $props();

	function handleClick() {
		ontransclude();
	}

	function handleBlur() {
		setTimeout(onclose, 200);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed z-50 animate-in fade-in-0 zoom-in-95"
	style="left: {x}px; top: {y}px; transform: translateX(-50%)"
	onmousedown={(e: MouseEvent) => e.stopPropagation()}
>
	<Button
		size="sm"
		variant="default"
		class="shadow-lg"
		onclick={handleClick}
		onblur={handleBlur}
	>
		Transclude
		<kbd class="ml-1 rounded bg-primary-foreground/20 px-1 text-xs font-mono">⌘T</kbd>
	</Button>
</div>
