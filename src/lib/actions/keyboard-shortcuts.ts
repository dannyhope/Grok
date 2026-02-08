import { grokState } from "../stores/grok-state.svelte.js";
import { getTextSelection, clearTextSelection } from "./text-selection.js";

export interface ShortcutDef {
	key: string;
	meta?: boolean;
	shift?: boolean;
	label: string;
	action: () => void;
}

function transcludeSelection() {
	const paragraphs = document.querySelectorAll("[data-paragraph-id]");
	for (const el of paragraphs) {
		const paragraphId = el.getAttribute("data-paragraph-id");
		if (!paragraphId) continue;
		const result = getTextSelection(paragraphId);
		if (result) {
			grokState.transclude(result.paragraphId, result.startOffset, result.endOffset, result.text);
			clearTextSelection();
			return;
		}
	}
}

export const shortcuts: ShortcutDef[] = [
	{
		key: "t",
		meta: true,
		label: "Transclude",
		action: transcludeSelection,
	},
	{
		key: "z",
		meta: true,
		label: "Undo",
		action: () => grokState.undo(),
	},
	{
		key: "z",
		meta: true,
		shift: true,
		label: "Redo",
		action: () => grokState.redo(),
	},
	{
		key: "d",
		meta: true,
		label: "Toggle debug",
		action: () => grokState.toggleDebug(),
	},
	{
		key: "Escape",
		label: "Clear selection",
		action: () => grokState.clearSelection(),
	},
	{
		key: "Backspace",
		label: "Remove selected",
		action: () => {
			const ids = Array.from(grokState.selectedNodeIds);
			if (ids.length > 0) grokState.removeNodes(ids);
		},
	},
	{
		key: "l",
		meta: true,
		label: "Make list",
		action: () => {
			const ids = Array.from(grokState.selectedNodeIds);
			if (ids.length >= 2) grokState.makeList(ids);
		},
	},
];

export function handleKeydown(event: KeyboardEvent) {
	const target = event.target as HTMLElement;
	if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable) {
		if (event.key === "Escape") {
			grokState.clearSelection();
			return;
		}
		return;
	}

	for (const shortcut of shortcuts) {
		const metaMatch = shortcut.meta ? event.metaKey || event.ctrlKey : !event.metaKey && !event.ctrlKey;
		const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
		const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

		if (metaMatch && shiftMatch && keyMatch) {
			event.preventDefault();
			shortcut.action();
			return;
		}
	}
}
