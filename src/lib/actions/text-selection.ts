import type { ParagraphId } from "../types.js";

export interface TextSelectionResult {
	paragraphId: ParagraphId;
	startOffset: number;
	endOffset: number;
	text: string;
}

export function getTextSelection(paragraphId: ParagraphId): TextSelectionResult | null {
	const selection = window.getSelection();
	if (!selection || selection.isCollapsed) return null;

	const range = selection.getRangeAt(0);
	const text = selection.toString().trim();
	if (!text) return null;

	const paragraphEl = document.querySelector(`[data-paragraph-id="${paragraphId}"]`);
	if (!paragraphEl) return null;

	if (!paragraphEl.contains(range.startContainer) || !paragraphEl.contains(range.endContainer)) {
		return null;
	}

	const textContent = paragraphEl.textContent || "";
	const preRange = document.createRange();
	preRange.setStart(paragraphEl, 0);
	preRange.setEnd(range.startContainer, range.startOffset);
	const startOffset = preRange.toString().length;
	const endOffset = startOffset + text.length;

	if (startOffset < 0 || endOffset > textContent.length) return null;

	return { paragraphId, startOffset, endOffset, text };
}

export function clearTextSelection() {
	window.getSelection()?.removeAllRanges();
}
