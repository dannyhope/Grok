<script lang="ts">
	import { grokState } from "$lib/stores/grok-state.svelte.js";
	import { DEMO_DOCUMENT } from "$lib/demo-document.js";
	import SourceParagraph from "./source-paragraph.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";

	let textInput = $state("");

	function handlePaste() {
		if (textInput.trim()) {
			grokState.loadSource(textInput);
		}
	}

	function handleLoadDemo() {
		grokState.loadSource(DEMO_DOCUMENT);
	}

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			if (text) grokState.loadSource(text);
		};
		reader.readAsText(file);
	}
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center justify-between border-b px-4 py-2">
		<h2 class="text-sm font-semibold tracking-tight">Source</h2>
		{#if grokState.source}
			<Button
				size="sm"
				variant="ghost"
				onclick={() => grokState.clearSource()}
				title="Clear source and start over"
			>
				Clear
			</Button>
		{/if}
	</div>

	{#if !grokState.source}
		<div class="flex flex-1 flex-col gap-4 p-4">
			<p class="text-sm text-muted-foreground">
				Provide a document to restructure. Paste text, upload a file, or try the demo.
			</p>

			<textarea
				class="min-h-[200px] flex-1 resize-none rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				placeholder=""
				bind:value={textInput}
			></textarea>

			<p class="text-xs text-muted-foreground">
				Paste or type your document text above, then click Load.
			</p>

			<div class="flex gap-2">
				<Button onclick={handlePaste} disabled={!textInput.trim()}>
					Load text
				</Button>

				<Button variant="outline" onclick={handleLoadDemo}>
					Try demo
				</Button>

				<label>
					<Button variant="outline" onclick={() => document.getElementById('file-upload')?.click()}>
						Upload file
					</Button>
				</label>
				<input
					id="file-upload"
					type="file"
					accept=".txt,.md"
					class="hidden"
					onchange={handleFileUpload}
				/>
			</div>
		</div>
	{:else}
		<ScrollArea.Root class="flex-1">
			<div class="p-4">
				<div class="space-y-1">
					{#each grokState.source.paragraphs as paragraph (paragraph.id)}
						<SourceParagraph {paragraph} />
					{/each}
				</div>
			</div>
		</ScrollArea.Root>
	{/if}
</div>
