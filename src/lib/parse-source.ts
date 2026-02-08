import type { SourceDocument, SourceParagraph } from "./types.js";
import { generateParagraphId } from "./id.js";

export function parseSource(rawText: string): SourceDocument {
	const lines = rawText.split(/\n/);
	const paragraphs: SourceParagraph[] = [];
	let current = "";
	let paragraphIndex = 0;

	for (const line of lines) {
		if (line.trim() === "") {
			if (current.trim() !== "") {
				paragraphs.push({
					id: generateParagraphId(paragraphIndex),
					index: paragraphIndex,
					text: current.trim(),
				});
				paragraphIndex++;
			}
			current = "";
		} else {
			if (current) current += "\n";
			current += line;
		}
	}

	if (current.trim() !== "") {
		paragraphs.push({
			id: generateParagraphId(paragraphIndex),
			index: paragraphIndex,
			text: current.trim(),
		});
	}

	return { paragraphs, rawText };
}
