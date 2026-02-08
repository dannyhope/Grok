let counter = 0;

export function generateId(prefix = "n"): string {
	counter++;
	const random = Math.random().toString(36).substring(2, 7);
	return `${prefix}_${Date.now().toString(36)}_${random}_${counter}`;
}

export function generateParagraphId(index: number): string {
	return `p_${index}`;
}
