<script lang="ts">
	import "../app.css";
	import { handleKeydown } from "$lib/actions/keyboard-shortcuts.js";
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	let { children } = $props();
</script>

<svelte:head>
	<title>Grok — Document Restructuring</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-screen flex-col overflow-hidden font-sans">
	{@render children()}
</div>

<Toaster />
